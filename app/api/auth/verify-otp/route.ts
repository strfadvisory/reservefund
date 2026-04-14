import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSession, hashOtp } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.otpHash || !user.otpExpiresAt) {
      return NextResponse.json({ error: 'No OTP pending for this email' }, { status: 404 });
    }
    if (user.otpExpiresAt < new Date()) {
      return NextResponse.json({ error: 'OTP expired, please resend' }, { status: 410 });
    }
    if (user.otpHash !== hashOtp(String(otp))) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true, otpHash: null, otpExpiresAt: null },
    });
    await createSession(user.id);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
