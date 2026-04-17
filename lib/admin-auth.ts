import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth';

export const ADMIN_SESSION_COOKIE = 'rf_admin_session';
export const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin';

export async function ensureDefaultSuperAdmin() {
  const existing = await prisma.superAdmin.findUnique({
    where: { username: DEFAULT_ADMIN_USERNAME },
  });
  if (existing) return existing;
  return await prisma.superAdmin.create({
    data: {
      username: DEFAULT_ADMIN_USERNAME,
      passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
    },
  });
}

export async function verifyAdminCredentials(username: string, password: string) {
  const admin = await prisma.superAdmin.findUnique({ where: { username } });
  if (!admin) return null;
  const ok = verifyPassword(password, admin.passwordHash);
  return ok ? admin : null;
}

export async function createAdminSession(adminId: string) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_MS);
  await prisma.adminSession.create({ data: { token, adminId, expiresAt } });
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/',
  });
}

export async function getAdminFromSession() {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { admin: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.admin;
}

export async function destroyAdminSession() {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    await prisma.adminSession.deleteMany({ where: { token } });
  }
  jar.delete(ADMIN_SESSION_COOKIE);
}
