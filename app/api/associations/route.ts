import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      associationName,
      managerFirstName,
      managerLastName,
      managerEmail,
      associationEmail,
      cellPhone,
      telephone,
      zipCode,
      state,
      city,
      address1,
      address2,
      published,
    } = body;

    if (!associationName || !String(associationName).trim()) {
      return NextResponse.json({ error: 'Association name is required' }, { status: 400 });
    }

    const data = {
      associationName: String(associationName).trim(),
      managerFirstName: managerFirstName ? String(managerFirstName).trim() : null,
      managerLastName: managerLastName ? String(managerLastName).trim() : null,
      managerEmail: managerEmail ? String(managerEmail).trim() : null,
      associationEmail: associationEmail ? String(associationEmail).trim() : null,
      cellPhone: cellPhone ? String(cellPhone).trim() : null,
      telephone: telephone ? String(telephone).trim() : null,
      zipCode: zipCode ? String(zipCode).trim() : null,
      state: state ? String(state).trim() : null,
      city: city ? String(city).trim() : null,
      address1: address1 ? String(address1).trim() : null,
      address2: address2 ? String(address2).trim() : null,
      published: Boolean(published),
    };

    if (id) {
      const existing = await prisma.association.findUnique({ where: { id } });
      if (!existing || existing.userId !== user.id) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      const updated = await prisma.association.update({ where: { id }, data });
      return NextResponse.json({ association: updated });
    }

    const created = await prisma.association.create({
      data: { ...data, userId: user.id },
    });
    return NextResponse.json({ association: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save association' }, { status: 500 });
  }
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const list = await prisma.association.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ associations: list });
}

export async function PATCH() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Count associations
    const associationsCount = await prisma.association.count({
      where: { userId: user.id },
    });

    // Count invites (members)
    const membersCount = await prisma.invite.count({
      where: { invitedBy: user.id },
    });

    // Count studies
    const studiesCount = await prisma.study.count({
      where: { userId: user.id },
    });

    // For versions, count total items across all studies
    const studies = await prisma.study.findMany({
      where: { userId: user.id },
      select: { items: true },
    });

    let versionsCount = 0;
    studies.forEach((study: any) => {
      if (Array.isArray(study.items)) {
        versionsCount += study.items.length;
      }
    });

    return NextResponse.json({
      associations: associationsCount,
      members: membersCount,
      studies: studiesCount,
      versions: versionsCount,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch stats' }, { status: 500 });
  }
}
