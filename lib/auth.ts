import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'crypto';
import { cookies, headers } from 'next/headers';
import prisma from '@/lib/prisma';

export const SESSION_COOKIE = 'rf_session';
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
export const OTP_TTL_MS = 1000 * 60 * 10;
export const OTP_LENGTH = 5;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, derived] = stored.split(':');
  if (!salt || !derived) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(derived, 'hex');
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

export function generateOtp(): string {
  const max = 10 ** OTP_LENGTH;
  const n = parseInt(randomBytes(4).toString('hex'), 16) % max;
  return n.toString().padStart(OTP_LENGTH, '0');
}

export function hashOtp(otp: string): string {
  return createHash('sha256').update(otp).digest('hex');
}

async function isRequestHttps(): Promise<boolean> {
  const hdrs = await headers();
  const proto = hdrs.get('x-forwarded-proto');
  if (proto) return proto.split(',')[0].trim().toLowerCase() === 'https';
  return false;
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.session.create({ data: { token, userId, expiresAt } });
  const jar = await cookies();
  const secure = await isRequestHttps();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    expires: expiresAt,
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (!token) {
    console.warn('No session cookie found');
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    console.warn('No session found for token');
    return null;
  }

  if (session.expiresAt < new Date()) {
    console.warn('Session expired');
    return null;
  }

  return session.user;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  jar.delete(SESSION_COOKIE);
}
