import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSession, hashPassword } from '@/lib/auth';
import config from '@/config.json';
import { ACTIVITY_EVENTS, logActivity } from '@/lib/activity';

export const runtime = 'nodejs';

const ROLES = (config as any).roles as Record<string, string>;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  const invite = await prisma.invite.findUnique({ where: { token } });
  if (!invite || invite.status !== 'pending') {
    return NextResponse.json({ error: 'Invalid or already used invitation' }, { status: 404 });
  }
  const inviter = await prisma.user.findUnique({ where: { id: invite.invitedBy } });
  return NextResponse.json({
    invite: {
      firstName: invite.firstName,
      lastName: invite.lastName,
      email: invite.email,
    },
    inviter: inviter
      ? {
          companyName: inviter.companyName,
          roleLabel: ROLES[inviter.companyType] || 'team member',
        }
      : null,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { token, phone, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }
    const invite = await prisma.invite.findUnique({ where: { token } });
    if (!invite || invite.status !== 'pending') {
      return NextResponse.json({ error: 'Invalid or already used invitation' }, { status: 404 });
    }

    const inviter = await prisma.user.findUnique({ where: { id: invite.invitedBy } });

    const existing = await prisma.user.findUnique({ where: { email: invite.email } });
    let user;
    if (existing) {
      user = await prisma.user.update({
        where: { id: existing.id },
        data: {
          firstName: existing.firstName || invite.firstName,
          lastName: existing.lastName || invite.lastName,
          phone: phone || existing.phone,
          passwordHash: hashPassword(password),
          verified: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: invite.email,
          companyType: inviter?.companyType || 'other',
          companyName: inviter?.companyName || null,
          firstName: invite.firstName,
          lastName: invite.lastName,
          phone: phone || null,
          passwordHash: hashPassword(password),
          verified: true,
        },
      });
    }

    await prisma.invite.update({
      where: { id: invite.id },
      data: { status: 'accepted', linkedUserId: user.id, token: null },
    });

    await createSession(user.id);
    await logActivity({
      event: ACTIVITY_EVENTS.INVITE_ACCEPTED,
      ownerUserId: invite.invitedBy,
      actor: user,
      description: `Accepted invitation from ${inviter?.email || 'owner'}`,
      metadata: { inviteId: invite.id },
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to accept invite' }, { status: 500 });
  }
}
