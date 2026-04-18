import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { hashOtp } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/mailer';

const RESET_TTL_MS = 1000 * 60 * 60; // 1 hour

export async function POST(request: NextRequest) {
  try {
    const { email: rawEmail } = await request.json();
    const email = rawEmail?.trim();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ ok: true }); // don't reveal if email exists

    const token = randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { otpHash: hashOtp(token), otpExpiresAt: new Date(Date.now() + RESET_TTL_MS) },
    });

    const origin =
      request.headers.get('origin') ||
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      `http://${request.headers.get('host')}`;
    const resetLink = `${origin}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail(user.email, resetLink);
    } catch (mailErr: any) {
      console.error('[auth] Failed to send password reset email:', mailErr?.message || mailErr);
      return NextResponse.json({ error: 'Could not send reset email. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
