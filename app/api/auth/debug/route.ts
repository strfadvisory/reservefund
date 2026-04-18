import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  const jar = await cookies();
  const allCookies = jar.getAll();
  const user = await getSessionUser();

  return NextResponse.json({
    allCookies: allCookies.map((c) => ({
      name: c.name,
      value: c.value ? `${c.value.substring(0, 10)}...` : null,
      httpOnly: c.httpOnly,
      secure: c.secure,
      sameSite: c.sameSite,
      path: c.path,
    })),
    user: user ? { id: user.id, email: user.email } : null,
    nodeEnv: process.env.NODE_ENV,
  });
}
