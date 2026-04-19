import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import config from '@/config.json';

export const runtime = 'nodejs';

const ROLES = (config as any).roles as Record<string, string>;

type MemberRow = { primary: string; secondary: string; status?: string };
type AssociationRow = { id: string; name: string; sub: string; status: string };
type StudyRow = { id: string; name: string; sub: string };

type DashboardPayload = {
  hero: { addressLine: string };
  roleColumn: { profileImageFileId: string | null; roleLabel: string; description: string };
  members: MemberRow[];
  associations: AssociationRow[];
  studies: StudyRow[];
  stats: { associations: number; members: number; studies: number; versions: number };
  canInviteMembers: boolean;
  canAddAssociation: boolean;
  canUploadStudy: boolean;
};

function buildAddressLine(u: {
  companyName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
}): string {
  const stateZip = [u.state, u.zipCode].filter(Boolean).join(' ').trim();
  return [u.companyName, u.address1, u.address2, u.city, stateZip]
    .map((p) => (p ? String(p).trim() : ''))
    .filter(Boolean)
    .join(', ');
}

function fullName(u: { firstName: string | null; lastName: string | null; email: string }): string {
  return [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.email;
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const orgId = request.nextUrl.searchParams.get('orgId') || 'self';

  if (orgId === 'self') {
    return NextResponse.json(await buildSelfPayload(user));
  }

  const invite = await prisma.invite.findUnique({ where: { id: orgId } });
  if (!invite || invite.linkedUserId !== user.id) {
    return NextResponse.json({ error: 'Org not found' }, { status: 404 });
  }
  if (invite.status !== 'accepted' && invite.status !== 'linked') {
    return NextResponse.json({ error: 'Org not active' }, { status: 403 });
  }

  return NextResponse.json(await buildInvitePayload(user, invite));
}

async function buildSelfPayload(user: any): Promise<DashboardPayload> {
  const [associations, invitesSent, studies] = await Promise.all([
    prisma.association.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.invite.findMany({ where: { invitedBy: user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.study.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
  ]);

  const associationNameById = new Map(associations.map((a) => [a.id, a.associationName]));

  const members: MemberRow[] = invitesSent.map((i) => {
    let status = 'Pending';
    if (i.status === 'accepted' || i.status === 'linked') status = 'Active';
    else if (i.status === 'denied') status = 'Denied';
    return {
      primary: `${i.firstName} ${i.lastName}`.trim() || i.email,
      secondary: i.email,
      status,
    };
  });

  const associationRows: AssociationRow[] = associations.map((a) => ({
    id: a.id,
    name: a.associationName,
    sub: [a.managerFirstName, a.managerLastName].filter(Boolean).join(' ') || a.city || '',
    status: a.published ? 'Active' : 'Pending',
  }));

  const studyRows: StudyRow[] = studies.map((s) => ({
    id: s.id,
    name: s.modelName,
    sub: s.associationId
      ? associationNameById.get(s.associationId) || 'Unknown Association'
      : 'No Association',
  }));

  let versionsCount = 0;
  studies.forEach((s: any) => {
    if (Array.isArray(s.items)) versionsCount += s.items.length;
  });

  return {
    hero: { addressLine: buildAddressLine(user) },
    roleColumn: {
      profileImageFileId: user.profileImageFileId || null,
      roleLabel: ROLES[user.companyType] || 'Member',
      description: 'You can manage associations, members and study data behalf of your company',
    },
    members,
    associations: associationRows,
    studies: studyRows,
    stats: {
      associations: associations.length,
      members: invitesSent.length,
      studies: studies.length,
      versions: versionsCount,
    },
    canInviteMembers: true,
    canAddAssociation: true,
    canUploadStudy: true,
  };
}

async function buildInvitePayload(user: any, invite: any): Promise<DashboardPayload> {
  const inviter = await prisma.user.findUnique({ where: { id: invite.invitedBy } });
  if (!inviter) {
    return {
      hero: { addressLine: '' },
      roleColumn: { profileImageFileId: null, roleLabel: 'Member', description: 'Organization unavailable.' },
      members: [],
      associations: [],
      studies: [],
      stats: { associations: 0, members: 0, studies: 0, versions: 0 },
      canInviteMembers: false,
      canAddAssociation: false,
      canUploadStudy: false,
    };
  }

  const chosenAssociationId = invite.chosenAssociationId || null;
  const association = chosenAssociationId
    ? await prisma.association.findUnique({ where: { id: chosenAssociationId } })
    : null;

  const [studies, peerInvites] = await Promise.all([
    chosenAssociationId
      ? prisma.study.findMany({
          where: { associationId: chosenAssociationId },
          orderBy: { createdAt: 'desc' },
        })
      : Promise.resolve([] as any[]),
    chosenAssociationId
      ? prisma.invite.findMany({
          where: {
            invitedBy: invite.invitedBy,
            chosenAssociationId,
            status: { in: ['accepted', 'linked'] },
          },
          orderBy: { updatedAt: 'desc' },
        })
      : Promise.resolve([] as any[]),
  ]);

  const peerUserIds = Array.from(
    new Set(
      peerInvites
        .map((p: any) => p.linkedUserId)
        .filter((id: string | null | undefined): id is string => !!id && id !== user.id)
    )
  );
  const peerUsers = peerUserIds.length
    ? await prisma.user.findMany({ where: { id: { in: peerUserIds } } })
    : [];
  const peerUserById = new Map(peerUsers.map((u) => [u.id, u]));

  const members: MemberRow[] = [
    {
      primary: fullName(inviter),
      secondary: inviter.email,
      status: 'Owner',
    },
    {
      primary: fullName(user),
      secondary: user.email,
      status: 'You',
    },
    ...peerInvites
      .filter((p: any) => p.linkedUserId && p.linkedUserId !== user.id)
      .map((p: any) => {
        const peer = peerUserById.get(p.linkedUserId);
        return peer
          ? {
              primary: fullName(peer),
              secondary: peer.email,
              status: 'Active',
            }
          : {
              primary: `${p.firstName} ${p.lastName}`.trim() || p.email,
              secondary: p.email,
              status: 'Active',
            };
      }),
  ];

  const associationRows: AssociationRow[] = association
    ? [
        {
          id: association.id,
          name: association.associationName,
          sub:
            [association.managerFirstName, association.managerLastName].filter(Boolean).join(' ') ||
            association.city ||
            '',
          status: association.published ? 'Active' : 'Pending',
        },
      ]
    : [];

  const studyRows: StudyRow[] = studies.map((s: any) => ({
    id: s.id,
    name: s.modelName,
    sub: association ? association.associationName : 'Unknown Association',
  }));

  let versionsCount = 0;
  studies.forEach((s: any) => {
    if (Array.isArray(s.items)) versionsCount += s.items.length;
  });

  return {
    hero: { addressLine: buildAddressLine(inviter) },
    roleColumn: {
      profileImageFileId: user.profileImageFileId || null,
      roleLabel: user.designation || ROLES[user.companyType] || 'Member',
      description: `You are a ${user.designation || 'member'} at ${inviter.companyName || fullName(inviter)}.`,
    },
    members,
    associations: associationRows,
    studies: studyRows,
    stats: {
      associations: associationRows.length,
      members: members.length,
      studies: studyRows.length,
      versions: versionsCount,
    },
    canInviteMembers: false,
    canAddAssociation: false,
    canUploadStudy: false,
  };
}
