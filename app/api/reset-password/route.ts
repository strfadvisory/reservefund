import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashOtp, hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password required' }, { status: 400 });
    }

    const hashed = hashOtp(token);
    const user = await prisma.user.findFirst({ where: { otpHash: hashed } });

    if (!user || !user.otpExpiresAt) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    if (user.otpExpiresAt < new Date()) {
      return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 410 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(password), otpHash: null, otpExpiresAt: null },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
