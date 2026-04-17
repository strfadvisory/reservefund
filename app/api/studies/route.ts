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
        items: items,
      },
    });

    return NextResponse.json({ success: true, study }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving study:', error);
    return NextResponse.json({ error: error.message || 'Failed to save study' }, { status: 500 });
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
