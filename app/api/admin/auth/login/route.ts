import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminSession,
  ensureDefaultSuperAdmin,
  verifyAdminCredentials,
} from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 },
      );
    }
    await ensureDefaultSuperAdmin();
    const admin = await verifyAdminCredentials(
      String(username).trim(),
      String(password),
    );
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 },
      );
    }
    await createAdminSession(admin.id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 },
    );
  }
}
