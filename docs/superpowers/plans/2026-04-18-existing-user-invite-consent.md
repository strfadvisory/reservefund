# Existing-User Invite Consent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When an existing user is invited from the dashboard, they must explicitly accept (picking one of the inviter's associations) or deny the invite — with email notifications to both parties.

**Architecture:** Reuses the existing `Invite` Prisma model with new status values (`awaiting_response`, `denied`) and a new `chosenAssociationId` field. Three API endpoints: modified `POST /api/invite`, new `GET /api/invite/pending`, new `POST /api/invite/[id]/respond`. Dashboard gets a blocking two-phase modal that runs before the existing invite-intro popup.

**Tech Stack:** Next.js 16 App Router, Prisma (MongoDB), React 19, Nodemailer, TypeScript. No test framework is configured — verification is manual via the dev server and DB inspection.

**Spec:** [docs/superpowers/specs/2026-04-18-existing-user-invite-consent-design.md](../specs/2026-04-18-existing-user-invite-consent-design.md)

---

## File Structure

**Create:**
- `app/api/invite/pending/route.ts` — list current user's `awaiting_response` invites, hydrated with inviter info + inviter's associations
- `app/api/invite/[id]/respond/route.ts` — accept/deny endpoint
- `components/pending-invite-modal.tsx` — two-phase blocking modal (choose → pick association)

**Modify:**
- `prisma/schema.prisma` — add `chosenAssociationId` to `Invite`
- `lib/mailer.ts` — add `sendExistingUserInviteNotification`, `sendInviteDeniedNotification`
- `app/api/invite/route.ts` — use `awaiting_response` for existing users, send notification email, block self-invite
- `app/dashboard/page.tsx` — fetch pending invites, render new modal before intro popup, extend status mapping

---

## Task 1: Schema — add `chosenAssociationId` to Invite

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Edit schema to add the new field**

Open `prisma/schema.prisma` and find the `Invite` model. Add `chosenAssociationId` immediately after `linkedUserId`:

```prisma
model Invite {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  invitedBy  String   @db.ObjectId
  associationId String? @db.ObjectId
  firstName  String
  lastName   String
  email      String
  token      String?  @unique
  status     String   @default("pending")
  linkedUserId String? @db.ObjectId
  chosenAssociationId String? @db.ObjectId
  designation String?
  permissions Json?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

- [ ] **Step 2: Push schema to MongoDB and regenerate client**

Run:

```bash
npx prisma db push
npx prisma generate
```

Expected output: `The database is already in sync with the Prisma schema.` (field is optional so no data migration needed), then `Generated Prisma Client`.

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(invite): add chosenAssociationId field to Invite"
```

---

## Task 2: Mailer — new email functions

**Files:**
- Modify: `lib/mailer.ts`

- [ ] **Step 1: Add `sendExistingUserInviteNotification` and `sendInviteDeniedNotification`**

Open `lib/mailer.ts`. Append these two exports after `sendOtpEmail`:

```typescript
export async function sendExistingUserInviteNotification(
  to: string,
  opts: {
    inviteeFirstName: string;
    inviterName: string;
    companyName: string;
    roleLabel: string;
    loginUrl: string;
  }
) {
  const from = `"${process.env.MAIL_FROM_NAME || 'Reserve Fund Advisors'}" <${
    process.env.MAIL_FROM_ADDRESS || process.env.EMAIL_USER
  }>`;
  const subject = `${opts.inviterName} invited you to join ${opts.companyName}`;
  const text = `${opts.inviterName} (${opts.companyName}) has invited you to join as ${opts.roleLabel}. Log in to respond: ${opts.loginUrl}`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#102C4A;padding:24px;">
      <h2 style="color:#0E519B;margin:0 0 12px;">Hi ${opts.inviteeFirstName},</h2>
      <p style="font-size:16px;line-height:1.5;">${opts.inviterName} (${opts.companyName}) has invited you to join as <strong>${opts.roleLabel}</strong>.</p>
      <p style="font-size:16px;line-height:1.5;">Log in to your account to accept or decline this request.</p>
      <p><a href="${opts.loginUrl}" style="display:inline-block;background:#0E519B;color:#fff;text-decoration:none;padding:12px 24px;border-radius:7px;font-weight:600;">Log in</a></p>
      <p style="font-size:14px;color:#66717D;">Or copy this link into your browser:<br/>${opts.loginUrl}</p>
    </div>
  `;
  await getTransporter().sendMail({ from, to, subject, text, html });
}

export async function sendInviteDeniedNotification(
  to: string,
  opts: {
    inviterFirstName: string;
    inviteeName: string;
    inviteeEmail: string;
    companyName: string;
  }
) {
  const from = `"${process.env.MAIL_FROM_NAME || 'Reserve Fund Advisors'}" <${
    process.env.MAIL_FROM_ADDRESS || process.env.EMAIL_USER
  }>`;
  const subject = `${opts.inviteeName} declined your invitation`;
  const text = `${opts.inviteeName} (${opts.inviteeEmail}) has declined your invitation to join ${opts.companyName}. You can invite them again from your dashboard if needed.`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#102C4A;padding:24px;">
      <h2 style="color:#0E519B;margin:0 0 12px;">Hi ${opts.inviterFirstName},</h2>
      <p style="font-size:16px;line-height:1.5;"><strong>${opts.inviteeName}</strong> (${opts.inviteeEmail}) has declined your invitation to join <strong>${opts.companyName}</strong>.</p>
      <p style="font-size:16px;line-height:1.5;">You can invite them again from your dashboard if needed.</p>
    </div>
  `;
  await getTransporter().sendMail({ from, to, subject, text, html });
}
```

- [ ] **Step 2: Type-check compiles**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors related to `lib/mailer.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/mailer.ts
git commit -m "feat(mailer): add existing-user invite and denial notification emails"
```

---

## Task 3: Modify `POST /api/invite` — existing-user flow uses `awaiting_response`

**Files:**
- Modify: `app/api/invite/route.ts`

- [ ] **Step 1: Replace the POST handler**

Replace the entire `POST` function (lines 12-78) with this version. Key changes:
- Self-invite guard.
- Existing-user branch sets `status: 'awaiting_response'` and sends the new notification email.

```typescript
export async function POST(request: NextRequest) {
  try {
    const inviter = await getSessionUser();
    if (!inviter) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { firstName, lastName, email, associationId, designation, permissions } = await request.json();
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'First name, last name and email are required' }, { status: 400 });
    }
    const normalizedEmail = String(email).trim().toLowerCase();

    if (inviter.email.toLowerCase() === normalizedEmail) {
      return NextResponse.json({ error: 'You cannot invite yourself.' }, { status: 400 });
    }

    const designationValue = designation ? String(designation).trim() || null : null;
    const permissionsValue =
      permissions && typeof permissions === 'object' && !Array.isArray(permissions) ? permissions : null;

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    const origin = request.headers.get('origin') || `http://${request.headers.get('host')}`;
    const inviterName = [inviter.firstName, inviter.lastName].filter(Boolean).join(' ') || inviter.email;
    const roleLabel = ROLES[inviter.companyType] || 'team member';
    const companyName = inviter.companyName || 'our organization';

    if (existingUser) {
      const invite = await prisma.invite.create({
        data: {
          invitedBy: inviter.id,
          associationId: associationId || null,
          firstName: String(firstName).trim(),
          lastName: String(lastName).trim(),
          email: normalizedEmail,
          status: 'awaiting_response',
          linkedUserId: existingUser.id,
          designation: designationValue,
          permissions: permissionsValue ?? undefined,
        },
      });

      try {
        await sendExistingUserInviteNotification(normalizedEmail, {
          inviteeFirstName: existingUser.firstName || String(firstName).trim(),
          inviterName,
          companyName,
          roleLabel,
          loginUrl: `${origin}/login`,
        });
      } catch (e: any) {
        return NextResponse.json({ error: `Failed to send notification email: ${e.message}` }, { status: 502 });
      }

      return NextResponse.json({ invite, linked: false, awaitingResponse: true });
    }

    const token = randomBytes(32).toString('hex');
    const invite = await prisma.invite.create({
      data: {
        invitedBy: inviter.id,
        associationId: associationId || null,
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        email: normalizedEmail,
        token,
        status: 'pending',
        designation: designationValue,
        permissions: permissionsValue ?? undefined,
      },
    });

    const link = `${origin}/invite/accept?token=${token}`;
    try {
      await sendInviteEmail(normalizedEmail, {
        firstName: String(firstName).trim(),
        inviterName,
        roleLabel,
        link,
      });
    } catch (e: any) {
      return NextResponse.json({ error: `Failed to send invite email: ${e.message}` }, { status: 502 });
    }

    return NextResponse.json({ invite, linked: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to invite' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Update imports at the top of the file**

At the top of `app/api/invite/route.ts`, replace the existing mailer import:

```typescript
import { sendInviteEmail, sendExistingUserInviteNotification } from '@/lib/mailer';
```

- [ ] **Step 3: Verify the file compiles**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors from `app/api/invite/route.ts`.

- [ ] **Step 4: Commit**

```bash
git add app/api/invite/route.ts
git commit -m "feat(invite): require existing-user consent via awaiting_response status"
```

---

## Task 4: New `GET /api/invite/pending` endpoint

**Files:**
- Create: `app/api/invite/pending/route.ts`

- [ ] **Step 1: Create the file**

Write this entire file:

```typescript
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import config from '@/config.json';

export const runtime = 'nodejs';

const ROLES = (config as any).roles as Record<string, string>;

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const invites = await prisma.invite.findMany({
    where: { linkedUserId: user.id, status: 'awaiting_response' },
    orderBy: { createdAt: 'asc' },
  });

  const inviterIds = Array.from(new Set(invites.map((i) => i.invitedBy)));
  const inviters = await prisma.user.findMany({
    where: { id: { in: inviterIds } },
  });
  const invitersById = new Map(inviters.map((u) => [u.id, u]));

  const associations = await prisma.association.findMany({
    where: { userId: { in: inviterIds } },
    orderBy: { createdAt: 'desc' },
  });
  const associationsByInviter = new Map<string, typeof associations>();
  for (const a of associations) {
    const list = associationsByInviter.get(a.userId) || [];
    list.push(a);
    associationsByInviter.set(a.userId, list);
  }

  const hydrated = invites.map((invite) => {
    const inviter = invitersById.get(invite.invitedBy);
    const inviterAssociations = (associationsByInviter.get(invite.invitedBy) || []).map((a) => ({
      id: a.id,
      associationName: a.associationName,
      city: a.city,
      managerFirstName: a.managerFirstName,
      managerLastName: a.managerLastName,
    }));
    return {
      id: invite.id,
      createdAt: invite.createdAt,
      inviter: inviter
        ? {
            firstName: inviter.firstName,
            lastName: inviter.lastName,
            email: inviter.email,
            companyName: inviter.companyName,
            roleLabel: ROLES[inviter.companyType] || 'team member',
          }
        : null,
      inviterAssociations,
    };
  });

  return NextResponse.json({ invites: hydrated });
}
```

- [ ] **Step 2: Verify the endpoint works via dev server**

Start the dev server (if not already running):

```bash
npm run dev
```

In another terminal, hit the endpoint while logged in (replace `<SESSION>` with the `rf_session` cookie from your browser's devtools):

```bash
curl -s -H "Cookie: rf_session=<SESSION>" http://localhost:3000/api/invite/pending
```

Expected: `{"invites":[]}` for a user with no pending invites. Unauthenticated request should return `{"error":"Not authenticated"}` with status 401.

- [ ] **Step 3: Commit**

```bash
git add app/api/invite/pending/route.ts
git commit -m "feat(invite): add GET /api/invite/pending endpoint"
```

---

## Task 5: New `POST /api/invite/[id]/respond` endpoint

**Files:**
- Create: `app/api/invite/[id]/respond/route.ts`

- [ ] **Step 1: Create the file**

Write this entire file:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { sendInviteDeniedNotification } from '@/lib/mailer';

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const invite = await prisma.invite.findUnique({ where: { id } });
    if (!invite) return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    if (invite.linkedUserId !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
    if (invite.status !== 'awaiting_response') {
      return NextResponse.json({ error: 'Invite has already been responded to' }, { status: 409 });
    }

    const body = await request.json();
    const action = body?.action;
    if (action !== 'accept' && action !== 'deny') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (action === 'accept') {
      const associationId = body?.associationId;
      if (!associationId || typeof associationId !== 'string') {
        return NextResponse.json({ error: 'associationId is required' }, { status: 400 });
      }
      const association = await prisma.association.findUnique({ where: { id: associationId } });
      if (!association || association.userId !== invite.invitedBy) {
        return NextResponse.json({ error: 'Invalid association' }, { status: 400 });
      }
      await prisma.invite.update({
        where: { id: invite.id },
        data: { status: 'accepted', chosenAssociationId: associationId },
      });
      return NextResponse.json({ ok: true });
    }

    // deny
    await prisma.invite.update({
      where: { id: invite.id },
      data: { status: 'denied' },
    });

    const inviter = await prisma.user.findUnique({ where: { id: invite.invitedBy } });
    if (inviter) {
      const inviteeFirstName = user.firstName || invite.firstName;
      const inviteeLastName = user.lastName || invite.lastName;
      const inviteeName = [inviteeFirstName, inviteeLastName].filter(Boolean).join(' ') || user.email;
      try {
        await sendInviteDeniedNotification(inviter.email, {
          inviterFirstName: inviter.firstName || 'there',
          inviteeName,
          inviteeEmail: user.email,
          companyName: inviter.companyName || 'your organization',
        });
      } catch (e) {
        console.error('Failed to send denial email:', e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to respond' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify the file compiles**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors from `app/api/invite/[id]/respond/route.ts`.

- [ ] **Step 3: Commit**

```bash
git add app/api/invite/\[id\]/respond/route.ts
git commit -m "feat(invite): add POST /api/invite/[id]/respond endpoint"
```

---

## Task 6: Pending-invite modal component

**Files:**
- Create: `components/pending-invite-modal.tsx`

- [ ] **Step 1: Create the component**

Write this entire file:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type PendingInviteAssociation = {
  id: string;
  associationName: string;
  city: string | null;
  managerFirstName: string | null;
  managerLastName: string | null;
};

export type PendingInvite = {
  id: string;
  createdAt: string;
  inviter: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    companyName: string | null;
    roleLabel: string;
  } | null;
  inviterAssociations: PendingInviteAssociation[];
};

type Phase = 'choose' | 'pickAssociation';

export function PendingInviteModal({
  invites,
  onAllResolved,
}: {
  invites: PendingInvite[];
  onAllResolved: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('choose');
  const [selectedAssociationId, setSelectedAssociationId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const current = invites[index];

  if (!mounted || !current) return null;

  const advance = () => {
    setPhase('choose');
    setSelectedAssociationId(null);
    setError('');
    if (index + 1 >= invites.length) {
      onAllResolved();
    } else {
      setIndex(index + 1);
    }
  };

  const submitResponse = async (body: { action: 'accept' | 'deny'; associationId?: string }) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/invite/${current.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      advance();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = () => setPhase('pickAssociation');
  const handleDeny = () => submitResponse({ action: 'deny' });
  const handleConfirmAssociation = () => {
    if (!selectedAssociationId) return;
    submitResponse({ action: 'accept', associationId: selectedAssociationId });
  };

  const inviterFullName = current.inviter
    ? [current.inviter.firstName, current.inviter.lastName].filter(Boolean).join(' ') || current.inviter.email
    : 'Someone';
  const companyName = current.inviter?.companyName || 'their organization';
  const roleLabel = current.inviter?.roleLabel || 'team member';
  const counter = invites.length > 1 ? `${index + 1} of ${invites.length}` : null;
  const hasAssociations = current.inviterAssociations.length > 0;

  return createPortal(
    <div
      className="flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(16, 44, 74, 0.55)',
        backdropFilter: 'blur(2px)',
        zIndex: 1100,
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        className="bg-white"
        style={{
          width: '643px',
          maxWidth: '100%',
          border: '1px solid #D7D7D7',
          borderRadius: '7px',
          boxShadow: '0 20px 60px rgba(16, 44, 74, 0.25)',
          margin: 'auto',
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: '24px 32px', borderBottom: '1px solid #D7D7D7' }}
        >
          <h2 className="font-semibold" style={{ color: '#102C4A', fontSize: '24px', lineHeight: 1.3 }}>
            {phase === 'choose' ? 'Invitation Request' : 'Choose Association'}
          </h2>
          {counter && (
            <span style={{ color: '#66717D', fontSize: '14px' }}>{counter}</span>
          )}
        </div>

        {phase === 'choose' && (
          <div style={{ padding: '28px 32px' }}>
            <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.5, marginBottom: '24px' }}>
              <strong>{inviterFullName}</strong> from <strong>{companyName}</strong> has invited you to join as{' '}
              <strong>{roleLabel}</strong>.
            </p>
            {error && (
              <p style={{ color: '#DC2626', fontSize: '14px', marginBottom: '12px' }}>{error}</p>
            )}
            <div className="grid grid-cols-2" style={{ gap: '12px' }}>
              <button
                type="button"
                onClick={handleDeny}
                disabled={submitting}
                className="font-semibold transition-all duration-200 hover:bg-gray-50"
                style={{
                  background: '#fff',
                  border: '1px solid #D7D7D7',
                  borderRadius: '7px',
                  padding: '14px',
                  fontSize: '16px',
                  color: '#102C4A',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                Deny
              </button>
              <button
                type="button"
                onClick={handleAccept}
                disabled={submitting}
                className="font-semibold text-white transition-all duration-200 hover:opacity-95"
                style={{
                  backgroundColor: submitting ? '#9CA3AF' : '#0E519B',
                  borderRadius: '7px',
                  padding: '14px',
                  fontSize: '16px',
                  border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                Accept
              </button>
            </div>
          </div>
        )}

        {phase === 'pickAssociation' && (
          <div style={{ padding: '28px 32px' }}>
            {!hasAssociations ? (
              <>
                <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.5, marginBottom: '24px' }}>
                  This user has no associations yet. You can respond to this invitation later.
                </p>
                <button
                  type="button"
                  onClick={advance}
                  className="w-full font-semibold text-white"
                  style={{
                    backgroundColor: '#0E519B',
                    borderRadius: '7px',
                    padding: '14px',
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <p style={{ color: '#102C4A', fontSize: '16px', lineHeight: 1.5, marginBottom: '16px' }}>
                  Select which association you'd like to join.
                </p>
                <div
                  style={{
                    border: '1px solid #D7D7D7',
                    borderRadius: '7px',
                    marginBottom: '24px',
                    maxHeight: '280px',
                    overflowY: 'auto',
                  }}
                >
                  {current.inviterAssociations.map((a, i, arr) => {
                    const selected = selectedAssociationId === a.id;
                    const subtitle =
                      [a.managerFirstName, a.managerLastName].filter(Boolean).join(' ') || a.city || '';
                    return (
                      <label
                        key={a.id}
                        className="flex items-start"
                        style={{
                          padding: '14px 20px',
                          gap: '12px',
                          borderBottom: i === arr.length - 1 ? 'none' : '1px solid #D7D7D7',
                          cursor: 'pointer',
                          background: selected ? '#F4F6F9' : '#fff',
                        }}
                      >
                        <input
                          type="radio"
                          name="pending-invite-association"
                          value={a.id}
                          checked={selected}
                          onChange={() => setSelectedAssociationId(a.id)}
                          style={{ marginTop: '4px' }}
                        />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ color: '#102C4A', fontSize: '16px', fontWeight: 500 }}>
                            {a.associationName}
                          </div>
                          {subtitle && (
                            <div style={{ color: '#66717D', fontSize: '14px' }}>{subtitle}</div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                {error && (
                  <p style={{ color: '#DC2626', fontSize: '14px', marginBottom: '12px' }}>{error}</p>
                )}
                <button
                  type="button"
                  onClick={handleConfirmAssociation}
                  disabled={!selectedAssociationId || submitting}
                  className="w-full font-semibold text-white"
                  style={{
                    backgroundColor: !selectedAssociationId || submitting ? '#9CA3AF' : '#0E519B',
                    borderRadius: '7px',
                    padding: '14px',
                    fontSize: '16px',
                    border: 'none',
                    cursor: !selectedAssociationId || submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Saving…' : 'Confirm'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
```

- [ ] **Step 2: Verify the component compiles**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors from `components/pending-invite-modal.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/pending-invite-modal.tsx
git commit -m "feat(invite): add PendingInviteModal component"
```

---

## Task 7: Dashboard integration — fetch pending invites, render modal, update status mapping

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Add the import for the new modal**

Near the other component imports at the top of `app/dashboard/page.tsx` (after the `TabSwitcher` import on line 10), add:

```typescript
import { PendingInviteModal, type PendingInvite } from '@/components/pending-invite-modal';
```

- [ ] **Step 2: Add pending-invite state inside the component**

Inside `DashboardPage()`, after the existing `const [invites, setInvites] = useState<...>([]);` block (around line 93), add:

```typescript
const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
const [pendingLoaded, setPendingLoaded] = useState(false);
```

- [ ] **Step 3: Add a fetcher and call it on mount**

Add this function alongside `refreshInvites`, `fetchStudies`, `fetchStats` (around line 107):

```typescript
const fetchPendingInvites = async () => {
  try {
    const res = await fetch('/api/invite/pending');
    const data = await res.json();
    if (Array.isArray(data?.invites)) {
      setPendingInvites(data.invites);
    }
  } catch {}
  setPendingLoaded(true);
};
```

Then update the first `useEffect` (currently calls `refreshInvites(); fetchStudies(); fetchStats();`) to also call `fetchPendingInvites`:

```typescript
useEffect(() => {
  refreshInvites();
  fetchStudies();
  fetchStats();
  fetchPendingInvites();
}, []);
```

- [ ] **Step 4: Update `refreshInvites` status mapping**

Find the `refreshInvites` function (around line 107). Replace the `.map((i: any) => ({ ... }))` body so the status logic is:

```typescript
setInvites(
  data.invites.map((i: any) => {
    let status = 'Pending';
    if (i.status === 'accepted' || i.status === 'linked') status = 'Active';
    else if (i.status === 'denied') status = 'Denied';
    else if (i.status === 'awaiting_response' || i.status === 'pending') status = 'Pending';
    return {
      id: i.id,
      name: `${i.firstName} ${i.lastName}`.trim(),
      email: i.email,
      status,
    };
  })
);
```

- [ ] **Step 5: Suppress the intro popup while a pending invite is showing**

Find the block that sets `introOpen` from localStorage (around line 265-272). Replace it with a version that waits for `pendingLoaded`:

```typescript
useEffect(() => {
  setMounted(true);
}, []);

useEffect(() => {
  if (!pendingLoaded) return;
  if (pendingInvites.length > 0) {
    setIntroOpen(false);
    return;
  }
  if (typeof window !== 'undefined') {
    const isHidden = window.localStorage.getItem('dashboard-invite-intro-hidden');
    setIntroOpen(!isHidden);
  } else {
    setIntroOpen(true);
  }
}, [pendingLoaded, pendingInvites.length]);
```

Note: remove the old `setMounted(true) + setIntroOpen` body and let it be split into the two effects above.

- [ ] **Step 6: Render the pending-invite modal**

Just before the `{/* Invite Intro Popup */}` comment (around line 787), add:

```tsx
{pendingLoaded && pendingInvites.length > 0 && (
  <PendingInviteModal
    invites={pendingInvites}
    onAllResolved={() => {
      setPendingInvites([]);
      // Re-run intro logic now that the pending queue is empty
      if (typeof window !== 'undefined') {
        const isHidden = window.localStorage.getItem('dashboard-invite-intro-hidden');
        setIntroOpen(!isHidden);
      }
    }}
  />
)}
```

- [ ] **Step 7: Update color for the Denied status pill**

Find the status `span` inside `ListColumn` (around line 1388-1398). Replace its color expression so "Denied" uses red:

```tsx
{item.status && (
  <span
    style={{
      color:
        item.status === 'Active'
          ? '#12B76A'
          : item.status === 'Denied'
          ? '#DC2626'
          : '#98A2B3',
      fontSize: '13px',
      fontWeight: 500,
      flexShrink: 0,
    }}
  >
    {item.status}
  </span>
)}
```

- [ ] **Step 8: Type-check compiles**

Run:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat(dashboard): show pending invite modal and denied status"
```

---

## Task 8: End-to-end manual QA

**Files:** none (verification only)

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Visit `http://localhost:3000`. Log in as **Inviter A** and keep this browser window open.

- [ ] **Step 2: Scenario 1 — self-invite blocked**

On A's dashboard, click "Invite New" and enter A's own email. Submit. Expected: red error "You cannot invite yourself."

- [ ] **Step 3: Scenario 2 — existing-user invite flow (deny path)**

Use a second browser profile (or incognito) logged in as **Invitee B** — an existing user with an account. From A's dashboard, invite B by email. Expected: B's dashboard list shows B with status "Pending". B receives a notification email with "Log in" button. A's API response includes `awaitingResponse: true`.

In B's browser, reload the dashboard. Expected: blocking modal "Invitation Request" appears with A's name and role. Click **Deny**. Expected: modal closes. A receives a denial email. On A's dashboard (after a reload), B now shows status "Denied" in red.

- [ ] **Step 4: Scenario 3 — accept path with no associations**

Before A creates any associations, invite B again. In B's dashboard, open the modal, click **Accept**. Expected: Phase 2 shows "This user has no associations yet." with a `Close` button. Click Close. DB check: invite status is still `awaiting_response`. (Verify by running `npx prisma studio` in another terminal and opening the Invite collection.)

- [ ] **Step 5: Scenario 4 — accept path with associations**

In A's dashboard, create one or two associations via "Add Associations". In B's browser, reload the dashboard. Expected: modal reappears, Phase 1 → Accept → Phase 2 now lists A's associations as radio buttons. Select one, click **Confirm**. Expected: modal closes. DB check: invite `status` = `accepted`, `chosenAssociationId` = the selected association's id. On A's dashboard (after reload), B shows status "Active" in green.

- [ ] **Step 6: Scenario 5 — multiple pending invites sequentially**

From A, invite B twice in a row (two different submissions). In B's browser, reload. Expected: modal shows "1 of 2" counter. Deny the first. Expected: modal advances to "2 of 2". Accept and pick an association. Expected: modal closes.

- [ ] **Step 7: Scenario 6 — stale modal conflict**

Send one invite from A to B. In B's browser, open the dashboard (modal appears) but don't click anything. In a second tab also logged in as B, open `/dashboard` and respond to the invite there. Return to the first tab and click Accept (or Deny). Expected: inline error "Invite has already been responded to". Clicking again should advance past the stale entry (since the queue was built from the first tab's snapshot — a reload would clear it).

- [ ] **Step 8: Scenario 7 — legacy `linked` records still render as Active**

If the DB has any invite records with `status: 'linked'` from before this change, they should still show as "Active" (green) on A's dashboard. If none exist, insert one manually via `npx prisma studio` to verify.

- [ ] **Step 9: Record QA outcome**

If all scenarios pass, the feature is done. If any fail, open a follow-up task documenting the failure before shipping.

---

## Self-Review Summary

- **Spec coverage:** All sections (lifecycle, API, UI, emails, error handling) are implemented across Tasks 1-7. Manual QA in Task 8 mirrors the verification scenarios from the spec.
- **Placeholder scan:** No TBDs. All code blocks contain full implementations.
- **Type consistency:** `PendingInvite` exported from `components/pending-invite-modal.tsx` and imported in `app/dashboard/page.tsx`. Status strings (`awaiting_response`, `accepted`, `denied`, `linked`, `pending`) are spelled consistently across API, modal, and status mapping.
- **No test framework:** Acknowledged explicitly — verification is manual.
