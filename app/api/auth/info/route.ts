import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOtp, hashOtp, hashPassword, OTP_TTL_MS } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      companyName,
      firstName,
      lastName,
      designation,
      phone,
      email,
      password,
    } = body;

    if (!userId || !email || !password || !companyName || !firstName || !lastName || !designation || !phone) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        companyName,
        firstName,
        lastName,
        designation,
        phone,
        passwordHash: hashPassword(password),
        otpHash,
        otpExpiresAt,
        verified: false,
      },
    });

    try {
      await sendOtpEmail(user.email, otp);
    } catch (mailErr: any) {
      console.error('[auth] Failed to send OTP email:', mailErr?.message || mailErr);
      return NextResponse.json(
        { error: 'Could not send verification email. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ email: user.email }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save info' }, { status: 500 });
  }
}
