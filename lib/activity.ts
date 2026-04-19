import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export const ACTIVITY_EVENTS = {
  // auth
  LOGIN: 'login',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  OTP_VERIFIED: 'otp_verified',
  REGISTER_STARTED: 'register_started',
  PASSWORD_CHANGED: 'password_changed',
  PASSWORD_RESET: 'password_reset',
  // membership
  INVITE_SENT: 'invite_sent',
  INVITE_ACCEPTED: 'invite_accepted',
  INVITE_DECISION: 'invite_decision',
  ASSOCIATION_CREATED: 'association_created',
  ASSOCIATION_UPDATED: 'association_updated',
  ASSOCIATION_PUBLISHED: 'association_published',
  // content
  STUDY_CREATED: 'study_created',
  STUDY_DELETED: 'study_deleted',
  STUDY_BLOCK_CHANGED: 'study_block_changed',
  RESERVE_STUDY_UPLOADED: 'reserve_study_uploaded',
  RESERVE_STUDY_DELETED: 'reserve_study_deleted',
  POST_CREATED: 'post_created',
  PROFILE_UPDATED: 'profile_updated',
  LOGO_UPLOADED: 'logo_uploaded',
  LOGO_DELETED: 'logo_deleted',
  PROFILE_IMAGE_UPLOADED: 'profile_image_uploaded',
  PROFILE_IMAGE_DELETED: 'profile_image_deleted',
} as const;

export type ActivityEvent = (typeof ACTIVITY_EVENTS)[keyof typeof ACTIVITY_EVENTS];

type ActorInput = {
  id?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

type LogOptions = {
  event: ActivityEvent | string;
  ownerUserId: string;
  actor?: ActorInput | null;
  orgScope?: string;
  description?: string;
  metadata?: Record<string, unknown> | null;
};

function isTrue(value: string | undefined): boolean {
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

export function isActivityEnabled(): boolean {
  return isTrue(process.env.ACTIVITY_TRACKING_ENABLED ?? 'true');
}

function parseAllowedEvents(): Set<string> | '*' {
  const raw = process.env.ACTIVITY_LOG_EVENTS?.trim();
  if (!raw || raw === '*') return '*';
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

export function isEventAllowed(event: string): boolean {
  if (!isActivityEnabled()) return false;
  const allowed = parseAllowedEvents();
  if (allowed === '*') return true;
  return allowed.has(event);
}

export function getRetentionDays(): number {
  const n = Number(process.env.ACTIVITY_RETENTION_DAYS);
  if (!Number.isFinite(n) || n <= 0) return 90;
  return Math.floor(n);
}

function formatActorName(actor: ActorInput | null | undefined): string | null {
  if (!actor) return null;
  const full = [actor.firstName, actor.lastName].filter(Boolean).join(' ').trim();
  return full || actor.email || null;
}

async function readRequestContext(): Promise<{ ipAddress: string | null; userAgent: string | null }> {
  try {
    const h = await headers();
    const captureIp = isTrue(process.env.ACTIVITY_CAPTURE_IP ?? 'true');
    const captureUa = isTrue(process.env.ACTIVITY_CAPTURE_USER_AGENT ?? 'true');
    const forwarded = h.get('x-forwarded-for');
    const ip = captureIp ? (forwarded ? forwarded.split(',')[0].trim() : h.get('x-real-ip')) : null;
    const ua = captureUa ? h.get('user-agent') : null;
    return { ipAddress: ip || null, userAgent: ua || null };
  } catch {
    return { ipAddress: null, userAgent: null };
  }
}

export async function logActivity(opts: LogOptions): Promise<void> {
  try {
    if (!isEventAllowed(opts.event)) return;
    if (!opts.ownerUserId) return;
    const { ipAddress, userAgent } = await readRequestContext();
    await prisma.activityLog.create({
      data: {
        ownerUserId: opts.ownerUserId,
        actorUserId: opts.actor?.id ?? null,
        actorEmail: opts.actor?.email ?? null,
        actorName: formatActorName(opts.actor ?? null),
        orgScope: opts.orgScope ?? 'self',
        event: opts.event,
        description: opts.description ?? null,
        metadata: (opts.metadata ?? null) as any,
        ipAddress,
        userAgent,
      },
    });
  } catch (err) {
    console.warn('[activity] failed to record event', opts.event, err);
  }
}

export async function pruneExpiredActivity(): Promise<number> {
  const days = getRetentionDays();
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const result = await prisma.activityLog.deleteMany({ where: { createdAt: { lt: cutoff } } });
  return result.count;
}

export type ActivityRange = 'today' | 'yesterday' | 'last7' | 'month' | 'all';

export function rangeToDates(range: ActivityRange): { from: Date | null; to: Date | null } {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (range) {
    case 'today':
      return { from: startOfToday, to: null };
    case 'yesterday': {
      const y = new Date(startOfToday);
      y.setDate(y.getDate() - 1);
      return { from: y, to: startOfToday };
    }
    case 'last7': {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - 6);
      return { from: d, to: null };
    }
    case 'month': {
      const d = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: d, to: null };
    }
    default:
      return { from: null, to: null };
  }
}

const EVENT_LABELS: Record<string, string> = {
  login: 'logged in',
  login_failed: 'failed to log in',
  logout: 'logged out',
  otp_verified: 'verified OTP',
  register_started: 'started registration',
  password_changed: 'changed their password',
  password_reset: 'reset their password',
  invite_sent: 'sent an invitation',
  invite_accepted: 'accepted an invitation',
  invite_decision: 'responded to an invitation',
  association_created: 'created an association',
  association_updated: 'updated an association',
  association_published: 'published an association',
  study_created: 'created a study',
  study_deleted: 'deleted a study',
  study_block_changed: 'changed study block status',
  reserve_study_uploaded: 'uploaded a reserve study',
  reserve_study_deleted: 'deleted a reserve study',
  post_created: 'created a post',
  profile_updated: 'updated profile',
  logo_uploaded: 'uploaded a logo',
  logo_deleted: 'deleted a logo',
  profile_image_uploaded: 'uploaded a profile image',
  profile_image_deleted: 'deleted a profile image',
};

export function describeEvent(event: string): string {
  return EVENT_LABELS[event] || event.replace(/_/g, ' ');
}
