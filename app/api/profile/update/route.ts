import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { ACTIVITY_EVENTS, logActivity } from '@/lib/activity';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      console.error('[profile/update] User not authenticated - getSessionUser returned null');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('[profile/update] User authenticated:', user.email);

    const body = await request.json();
    const {
      companyName,
      website,
      linkedin,
      telephone,
      cellPhone,
      zipCode,
      state,
      city,
      address1,
      address2,
    } = body;

    if (!zipCode || !state || !city || !address1) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const data: Record<string, any> = {
      zipCode: String(zipCode).trim(),
      state: String(state).trim(),
      city: String(city).trim(),
      address1: String(address1).trim(),
      address2: address2 ? String(address2).trim() : null,
      telephone: telephone ? String(telephone).trim() : null,
      phone: cellPhone ? String(cellPhone).trim() : null,
    };

    if (companyName !== undefined) data.companyName = companyName ? String(companyName).trim() : null;
    if (website !== undefined) data.website = website ? String(website).trim() : null;
    if (linkedin !== undefined) data.linkedin = linkedin ? String(linkedin).trim() : null;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
    });

    await logActivity({
      event: ACTIVITY_EVENTS.PROFILE_UPDATED,
      ownerUserId: user.id,
      actor: user,
      description: 'Updated profile details',
      metadata: { fields: Object.keys(data) },
    });

    return NextResponse.json({ ok: true, userId: updated.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save profile' }, { status: 500 });
  }
}
