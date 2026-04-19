import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const study = await prisma.study.findUnique({ where: { id } });
  if (!study || study.userId !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ study });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const existing = await prisma.study.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { modelName, formData, items, associationId } = await request.json();
    if (!modelName?.trim()) {
      return NextResponse.json({ error: 'Model name is required' }, { status: 400 });
    }

    const study = await prisma.study.update({
      where: { id },
      data: {
        modelName: String(modelName).trim(),
        associationId: associationId || null,
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
        items,
      },
    });

    return NextResponse.json({ success: true, study });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}
