import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { sendInviteEmail } from '@/lib/mailer';
import config from '@/config.json';

export const runtime = 'nodejs';

const ROLES = (config as any).roles as Record<string, string>;

export async function POST(request: NextRequest) {
  try {
    const inviter = await getSessionUser();
    if (!inviter) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { firstName, lastName, email, associationId, designation, permissions } = await request.json();
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'First name, last name and email are required' }, { status: 400 });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const designationValue = designation ? String(designation).trim() || null : null;
    const permissionsValue =
      permissions && typeof permissions === 'object' && !Array.isArray(permissions) ? permissions : null;

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      const invite = await prisma.invite.create({
        data: {
          invitedBy: inviter.id,
          associationId: associationId || null,
          firstName: String(firstName).trim(),
          lastName: String(lastName).trim(),
          email: normalizedEmail,
          status: 'linked',
          linkedUserId: existingUser.id,
          designation: designationValue,
          permissions: permissionsValue ?? undefined,
        },
      });
      return NextResponse.json({ invite, linked: true });
    }

    const token = randomBytes(32).toString('hex');
    const invite = await prisma.invite.create({
      data: {
        invitedBy: inviter.id,
        associationId: associationId || null,
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: normalizedEmail,
        token,
        status: 'pending',
        designation: designationValue,
        permissions: permissionsValue ?? undefined,
      },
    });

    const origin = request.headers.get('origin') || `http://${request.headers.get('host')}`;
    const link = `${origin}/invite/accept?token=${token}`;
    const inviterName = [inviter.firstName, inviter.lastName].filter(Boolean).join(' ') || inviter.email;
    const roleLabel = ROLES[inviter.companyType] || 'team member';
    try {
      await sendInviteEmail(normalizedEmail, {
        firstName: String(firstName).trim(),
        inviterName,
        roleLabel,
        link,
      });
    } catch (e: any) {
      return NextResponse.json({ error: `Failed to send invite email: ${e.message}` }, { status: 502 });
    }

    return NextResponse.json({ invite, linked: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to invite' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const associationId = request.nextUrl.searchParams.get('associationId');
  const where: any = { invitedBy: user.id };
  if (associationId) where.associationId = associationId;
  const list = await prisma.invite.findMany({ where, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ invites: list });
}
