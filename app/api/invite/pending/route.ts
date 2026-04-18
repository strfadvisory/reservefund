import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import config from '@/config.json';

export const runtime = 'nodejs';

const ROLES = (config as any).roles as Record<string, string>;

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const invites = await prisma.invite.findMany({
    where: { linkedUserId: user.id, status: 'awaiting_response' },
    orderBy: { createdAt: 'asc' },
  });

  const inviterIds = Array.from(new Set(invites.map((i) => i.invitedBy)));
  const inviters = await prisma.user.findMany({
    where: { id: { in: inviterIds } },
  });
  const invitersById = new Map(inviters.map((u) => [u.id, u]));

  const associations = await prisma.association.findMany({
    where: { userId: { in: inviterIds } },
    orderBy: { createdAt: 'desc' },
  });
  const associationsByInviter = new Map<string, typeof associations>();
  for (const a of associations) {
    const list = associationsByInviter.get(a.userId) || [];
    list.push(a);
    associationsByInviter.set(a.userId, list);
  }

  const hydrated = invites.map((invite) => {
    const inviter = invitersById.get(invite.invitedBy);
    const inviterAssociations = (associationsByInviter.get(invite.invitedBy) || []).map((a) => ({
      id: a.id,
      associationName: a.associationName,
      city: a.city,
      managerFirstName: a.managerFirstName,
      managerLastName: a.managerLastName,
    }));
    return {
      id: invite.id,
      createdAt: invite.createdAt,
      inviter: inviter
        ? {
            firstName: inviter.firstName,
            lastName: inviter.lastName,
            email: inviter.email,
            companyName: inviter.companyName,
            roleLabel: ROLES[inviter.companyType] || 'team member',
          }
        : null,
      inviterAssociations,
    };
  });

  return NextResponse.json({ invites: hydrated });
}
