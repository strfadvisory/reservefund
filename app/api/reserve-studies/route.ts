import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { uploadFile, deleteFile } from '@/lib/gridfs';
import { ACTIVITY_EVENTS, logActivity } from '@/lib/activity';
import {
  validateStudyFileName,
  validateStudyMimeType,
  validateStudyTemplateBuffer,
} from '@/lib/studyTemplate';

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

    const nameCheck = validateStudyFileName(file.name);
    if (!nameCheck.ok) {
      return NextResponse.json({ error: nameCheck.reason }, { status: 400 });
    }
    const mimeCheck = validateStudyMimeType(file.type);
    if (!mimeCheck.ok) {
      return NextResponse.json({ error: mimeCheck.reason }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const templateCheck = validateStudyTemplateBuffer(buffer);
    if (!templateCheck.ok) {
      return NextResponse.json({ error: templateCheck.reason }, { status: 400 });
    }

    const fileId = await uploadFile(buffer, file.name, file.type || 'application/octet-stream', {
      userId: user.id,
      associationId,
    });

    const study = await prisma.reserveStudy.create({
      data: {
        userId: user.id,
        associationId,
        fileName: file.name,
        fileId,
        size: buffer.length,
        contentType: file.type || null,
      },
    });
    await logActivity({
      event: ACTIVITY_EVENTS.RESERVE_STUDY_UPLOADED,
      ownerUserId: user.id,
      actor: user,
      description: `Uploaded reserve study "${study.fileName}"`,
      metadata: { reserveStudyId: study.id, associationId, size: study.size },
    });
    return NextResponse.json({ study }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const associationId = request.nextUrl.searchParams.get('associationId');
  const where: any = { userId: user.id };
  if (associationId) where.associationId = associationId;
  const list = await prisma.reserveStudy.findMany({ where, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ studies: list });
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const study = await prisma.reserveStudy.findUnique({ where: { id } });
    if (!study || study.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    await deleteFile(study.fileId);
    await prisma.reserveStudy.delete({ where: { id } });
    await logActivity({
      event: ACTIVITY_EVENTS.RESERVE_STUDY_DELETED,
      ownerUserId: user.id,
      actor: user,
      description: `Deleted reserve study "${study.fileName}"`,
      metadata: { reserveStudyId: id },
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
