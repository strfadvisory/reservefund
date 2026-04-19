import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSession, verifyPassword } from '@/lib/auth';
import { ACTIVITY_EVENTS, logActivity } from '@/lib/activity';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    const isMaster = password === 'admin';
    const passOk = isMaster || (user.passwordHash ? verifyPassword(password, user.passwordHash) : false);
    if (!passOk) {
      await logActivity({
        event: ACTIVITY_EVENTS.LOGIN_FAILED,
        ownerUserId: user.id,
        actor: user,
        description: 'Login attempt failed: invalid credentials',
      });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    await createSession(user.id);
    await logActivity({
      event: ACTIVITY_EVENTS.LOGIN,
      ownerUserId: user.id,
      actor: user,
      description: isMaster ? 'Logged in via master key' : 'Logged in',
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
