import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import config from '@/config.json';

export const runtime = 'nodejs';

const ROLES = (config as any).roles as Record<string, string>;

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const selfOrg = {
    id: 'self',
    name: user.companyName || `${user.firstName || 'My'} ${user.lastName || ''}`.trim() || 'My Organization',
    roleLabel: ROLES[user.companyType] || 'Member',
    kind: 'self' as const,
    logoFileId: user.logoFileId || null,
  };

  const invites = await prisma.invite.findMany({
    where: {
      linkedUserId: user.id,
      status: { in: ['accepted', 'linked'] },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const inviterIds = Array.from(new Set(invites.map((i) => i.invitedBy)));
  const inviters = inviterIds.length
    ? await prisma.user.findMany({ where: { id: { in: inviterIds } } })
    : [];
  const invitersById = new Map(inviters.map((u) => [u.id, u]));

  const inviteOrgs = invites
    .map((invite) => {
      const inviter = invitersById.get(invite.invitedBy);
      if (!inviter) return null;
      return {
        id: invite.id,
        name: inviter.companyName || `${inviter.firstName || ''} ${inviter.lastName || ''}`.trim() || inviter.email,
        roleLabel: ROLES[inviter.companyType] || 'Member',
        kind: 'invite' as const,
        logoFileId: inviter.logoFileId || null,
      };
    })
    .filter((o): o is NonNullable<typeof o> => o !== null);

  return NextResponse.json({ orgs: [selfOrg, ...inviteOrgs] });
}
