import { NextResponse } from 'next/server';
import { destroySession, getSessionUser } from '@/lib/auth';
import { ACTIVITY_EVENTS, logActivity } from '@/lib/activity';

export const runtime = 'nodejs';

export async function POST() {
  const user = await getSessionUser();
  if (user) {
    await logActivity({
      event: ACTIVITY_EVENTS.LOGOUT,
      ownerUserId: user.id,
      actor: user,
      description: 'Logged out',
    });
  }
  await destroySession();
  return NextResponse.json({ ok: true });
}
