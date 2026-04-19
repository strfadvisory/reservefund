import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import {
  ActivityRange,
  describeEvent,
  isActivityEnabled,
  rangeToDates,
} from '@/lib/activity';

export const runtime = 'nodejs';

const VALID_RANGES: ActivityRange[] = ['today', 'yesterday', 'last7', 'month', 'all'];

function parseRange(value: string | null): ActivityRange {
  if (!value) return 'today';
  const v = value.toLowerCase();
  if (VALID_RANGES.includes(v as ActivityRange)) return v as ActivityRange;
  return 'today';
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!isActivityEnabled()) {
      return NextResponse.json({
        enabled: false,
        items: [],
        total: 0,
        range: 'today',
        search: '',
      });
    }

    const sp = request.nextUrl.searchParams;
    const orgId = sp.get('orgId') || 'self';
    const range = parseRange(sp.get('range'));
    const search = (sp.get('search') || '').trim();
    const limit = Math.min(Number(sp.get('limit')) || 100, 500);

    let ownerUserId = user.id;
    if (orgId !== 'self') {
      const invite = await prisma.invite.findUnique({ where: { id: orgId } });
      if (!invite || invite.linkedUserId !== user.id) {
        return NextResponse.json({ error: 'Org not found' }, { status: 404 });
      }
      ownerUserId = invite.invitedBy;
    }

    const { from, to } = rangeToDates(range);
    const where: any = { ownerUserId };
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = from;
      if (to) where.createdAt.lt = to;
    }
    if (search) {
      where.OR = [
        { actorName: { contains: search, mode: 'insensitive' } },
        { actorEmail: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { event: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [rows, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ]);

    const items = rows.map((r) => ({
      id: r.id,
      event: r.event,
      eventLabel: describeEvent(r.event),
      description: r.description,
      actorName: r.actorName,
      actorEmail: r.actorEmail,
      actorUserId: r.actorUserId,
      ipAddress: r.ipAddress,
      userAgent: r.userAgent,
      metadata: r.metadata,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({
      enabled: true,
      items,
      total,
      range,
      search,
    });
  } catch (error: any) {
    console.error('[api/activity] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to load activity' }, { status: 500 });
  }
}
