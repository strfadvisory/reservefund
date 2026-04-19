import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { sendInviteDeniedNotification } from '@/lib/mailer';
import { ACTIVITY_EVENTS, logActivity } from '@/lib/activity';

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const invite = await prisma.invite.findUnique({ where: { id } });
    if (!invite) return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    if (invite.linkedUserId !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
    if (invite.status !== 'awaiting_response') {
      return NextResponse.json({ error: 'Invite has already been responded to' }, { status: 409 });
    }

    const body = await request.json();
    const action = body?.action;
    if (action !== 'accept' && action !== 'deny') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (action === 'accept') {
      const associationId = body?.associationId;
      if (!associationId || typeof associationId !== 'string') {
        return NextResponse.json({ error: 'associationId is required' }, { status: 400 });
      }
      const association = await prisma.association.findUnique({ where: { id: associationId } });
      if (!association || association.userId !== invite.invitedBy) {
        return NextResponse.json({ error: 'Invalid association' }, { status: 400 });
      }
      await prisma.invite.update({
        where: { id: invite.id },
        data: { status: 'accepted', chosenAssociationId: associationId },
      });
      await logActivity({
        event: ACTIVITY_EVENTS.INVITE_ACCEPTED,
        ownerUserId: invite.invitedBy,
        actor: user,
        description: `Accepted invitation and joined association`,
        metadata: { inviteId: invite.id, associationId },
      });
      return NextResponse.json({ ok: true });
    }

    await prisma.invite.update({
      where: { id: invite.id },
      data: { status: 'denied' },
    });
    await logActivity({
      event: ACTIVITY_EVENTS.INVITE_DECISION,
      ownerUserId: invite.invitedBy,
      actor: user,
      description: 'Declined invitation',
      metadata: { inviteId: invite.id, decision: 'denied' },
    });

    const inviter = await prisma.user.findUnique({ where: { id: invite.invitedBy } });
    if (inviter) {
      const inviteeFirstName = user.firstName || invite.firstName;
      const inviteeLastName = user.lastName || invite.lastName;
      const inviteeName = [inviteeFirstName, inviteeLastName].filter(Boolean).join(' ') || user.email;
      try {
        await sendInviteDeniedNotification(inviter.email, {
          inviterFirstName: inviter.firstName || 'there',
          inviteeName,
          inviteeEmail: user.email,
          companyName: inviter.companyName || 'your organization',
        });
      } catch (e) {
        console.error('Failed to send denial email:', e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to respond' }, { status: 500 });
  }
}
