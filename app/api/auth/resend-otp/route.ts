import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOtp, hashOtp, OTP_TTL_MS } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const otp = generateOtp();
    await prisma.user.update({
      where: { id: user.id },
      data: { otpHash: hashOtp(otp), otpExpiresAt: new Date(Date.now() + OTP_TTL_MS) },
    });
    try {
      await sendOtpEmail(user.email, otp);
    } catch (mailErr: any) {
      console.error('[auth] Failed to resend OTP email:', mailErr?.message || mailErr);
      return NextResponse.json(
        { error: 'Could not send verification email. Please try again.' },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to resend' }, { status: 500 });
  }
}
