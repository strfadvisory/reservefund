import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET() {
  const admin = await getAdminFromSession();
  if (!admin) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      companyType: true,
      companyName: true,
      firstName: true,
      lastName: true,
      designation: true,
      phone: true,
      logoFileId: true,
      zipCode: true,
      state: true,
      city: true,
      address1: true,
      address2: true,
      createdAt: true,
    },
  });

  const counts: Record<string, number> = {
    management: 0,
    bank: 0,
    reserve: 0,
    advisor: 0,
    board: 0,
  };
  for (const u of users) {
    if (u.companyType && counts[u.companyType] !== undefined) {
      counts[u.companyType] += 1;
    }
  }

  return NextResponse.json({ users, counts });
}
