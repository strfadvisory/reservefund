import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, hashPassword, verifyPassword } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ACTIVITY_EVENTS, logActivity } from '@/lib/activity';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ error: 'No password set for this account' }, { status: 400 });
    }

    const isValid = verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(newPassword) },
    });

    await logActivity({
      event: ACTIVITY_EVENTS.PASSWORD_CHANGED,
      ownerUserId: user.id,
      actor: user,
      description: 'Changed account password',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to change password' }, { status: 500 });
  }
}
