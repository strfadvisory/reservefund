import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { uploadLogo, deleteLogo } from '@/lib/gridfs';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const form = await request.formData();
    const associationId = String(form.get('associationId') || '');
    const file = form.get('file') as File | null;

    if (!associationId) return NextResponse.json({ error: 'Missing associationId' }, { status: 400 });
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 });

    const assoc = await prisma.association.findUnique({ where: { id: associationId } });
    if (!assoc || assoc.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (assoc.logoFileId) {
      await deleteLogo(assoc.logoFileId);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileId = await uploadLogo(buffer, file.name, file.type || 'image/png', {
      userId: user.id,
      associationId,
    });

    const updated = await prisma.association.update({
      where: { id: associationId },
      data: { logoFileId: fileId },
    });

    return NextResponse.json({ association: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
