import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOtp, hashOtp, OTP_TTL_MS } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/mailer';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !/\S+@\S+\.\S+/.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.trim() } });

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
    }

    const otp = generateOtp();
    await prisma.user.update({
      where: { id: user.id },
      data: { otpHash: hashOtp(otp), otpExpiresAt: new Date(Date.now() + OTP_TTL_MS) },
    });

    try {
      await sendOtpEmail(user.email, otp);
    } catch (mailErr) {
      console.error('[forgot-password] Failed to send OTP email:', mailErr?.message || mailErr);
      return NextResponse.json({ error: 'Could not send reset email. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, email: user.email });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
