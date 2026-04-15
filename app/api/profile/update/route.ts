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
      companyName,
      website,
      linkedin,
      zipCode,
      state,
      city,
      address1,
      address2,
    } = body;

    if (!companyName || !zipCode || !state || !city || !address1) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        companyName: String(companyName).trim(),
        website: website ? String(website).trim() : null,
        linkedin: linkedin ? String(linkedin).trim() : null,
        zipCode: String(zipCode).trim(),
        state: String(state).trim(),
        city: String(city).trim(),
        address1: String(address1).trim(),
        address2: address2 ? String(address2).trim() : null,
      },
    });

    return NextResponse.json({ ok: true, userId: updated.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save profile' }, { status: 500 });
  }
}
