import { NextResponse } from 'next/server';
import { getAdminFromSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET() {
  const admin = await getAdminFromSession();
  if (!admin) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.json({
    admin: {
      id: admin.id,
      username: admin.username,
      createdAt: admin.createdAt,
    },
  });
}
