import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { uploadLogo, deleteLogo } from '@/lib/gridfs';
import { ACTIVITY_EVENTS, logActivity } from '@/lib/activity';

export const runtime = 'nodejs';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ['image/png', 'image/jpeg', 'image/jpg'];

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'Only PNG or JPG allowed' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File exceeds 2 MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileId = await uploadLogo(buffer, file.name || 'profile-image', file.type, {
      userId: user.id,
      kind: 'profile-image',
    });

    if (user.profileImageFileId) {
      await deleteLogo(user.profileImageFileId);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { profileImageFileId: fileId },
    });

    await logActivity({
      event: ACTIVITY_EVENTS.PROFILE_IMAGE_UPLOADED,
      ownerUserId: user.id,
      actor: user,
      description: 'Uploaded profile image',
      metadata: { fileId },
    });

    return NextResponse.json({ profileImageFileId: fileId }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (!user.profileImageFileId) {
      return NextResponse.json({ error: 'No profile image to delete' }, { status: 400 });
    }
    await deleteLogo(user.profileImageFileId);
    await prisma.user.update({
      where: { id: user.id },
      data: { profileImageFileId: null },
    });
    await logActivity({
      event: ACTIVITY_EVENTS.PROFILE_IMAGE_DELETED,
      ownerUserId: user.id,
      actor: user,
      description: 'Removed profile image',
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
