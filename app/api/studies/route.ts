import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { ACTIVITY_EVENTS, logActivity } from '@/lib/activity';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { modelName, formData, items, associationId } = body;

    if (!modelName || !String(modelName).trim()) {
      return NextResponse.json({ error: 'Model name is required' }, { status: 400 });
    }

    const study = await prisma.study.create({
      data: {
        userId: user.id,
        associationId: associationId || null,
        modelName: String(modelName).trim(),
        housingUnits: formData.housingUnits || null,
        beginningReserveFunds: formData.beginningReserveFunds || null,
        sirsReserveFunds: formData.sirsReserveFunds || null,
        inflationRate: formData.inflationRate || null,
        averageMonthlyFee: formData.averageMonthlyFee || null,
        beginningFiscalYear: formData.beginningFiscalYear || null,
        yearsCovered: formData.yearsCovered || null,
        rateOfReturn: formData.rateOfReturn || null,
        annualReserveBudget: formData.annualReserveBudget || null,
        annualOperatingBudget: formData.annualOperatingBudget || null,
        items: items,
      },
    });

    await logActivity({
      event: ACTIVITY_EVENTS.STUDY_CREATED,
      ownerUserId: user.id,
      actor: user,
      description: `Created study "${study.modelName}"`,
      metadata: { studyId: study.id, associationId: study.associationId },
    });

    return NextResponse.json({ success: true, study }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving study:', error);
    return NextResponse.json({ error: error.message || 'Failed to save study' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const study = await prisma.study.findUnique({ where: { id } });
    if (!study || study.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    await prisma.study.delete({ where: { id } });
    await logActivity({
      event: ACTIVITY_EVENTS.STUDY_DELETED,
      ownerUserId: user.id,
      actor: user,
      description: `Deleted study "${study.modelName}"`,
      metadata: { studyId: id },
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const list = await prisma.study.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ studies: list });
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { id, isBlocked } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const study = await prisma.study.findUnique({ where: { id } });
    if (!study || study.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const updated = await prisma.study.update({
      where: { id },
      data: { isBlocked: typeof isBlocked === 'boolean' ? isBlocked : !study.isBlocked },
    });
    await logActivity({
      event: ACTIVITY_EVENTS.STUDY_BLOCK_CHANGED,
      ownerUserId: user.id,
      actor: user,
      description: `${updated.isBlocked ? 'Blocked' : 'Unblocked'} study "${updated.modelName}"`,
      metadata: { studyId: updated.id, isBlocked: updated.isBlocked },
    });
    return NextResponse.json({ success: true, study: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
