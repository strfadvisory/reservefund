import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const VALID_TYPES = ['management', 'bank', 'reserve', 'advisor', 'board', 'other'];

export async function POST(request: NextRequest) {
  try {
    const { companyType } = await request.json();
    if (!companyType || !VALID_TYPES.includes(companyType)) {
      return NextResponse.json({ error: 'Invalid company type' }, { status: 400 });
    }
    const draftEmail = `draft_${Date.now()}_${Math.random().toString(36).slice(2, 10)}@pending.local`;
    const user = await prisma.user.create({
      data: { email: draftEmail, companyType },
    });
    return NextResponse.json({ userId: user.id, companyType: user.companyType }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to register' }, { status: 500 });
  }
}
