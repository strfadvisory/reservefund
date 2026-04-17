import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const admin = await getAdminFromSession();
  if (!admin) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
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
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const [associations, invites] = await Promise.all([
    prisma.association.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.invite.findMany({
      where: { invitedBy: userId },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return NextResponse.json({ user, associations, invites });
}
