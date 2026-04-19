# Dashboard Company Type Label & Decoupled Profile Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the company profile-type label beneath the company name in the dashboard header, and fully decouple the user's personal profile image (Role & Responsibility column) from the company logo (header + org switcher) by introducing a second image field on `User`.

**Architecture:**
- Add a new `User.profileImageFileId` field beside the existing `User.logoFileId`. Company logo stays on `logoFileId`; personal profile image moves to `profileImageFileId`.
- New endpoints `POST/DELETE /api/profile/image` and `GET /api/profile/image/[id]` mirror the existing logo endpoints but write/read the new field.
- Header reads `selectedOrg.companyType` (added to `/api/orgs/mine` + `OrgItem`) and renders a label from a shared `lib/company-types.ts` module (which the profile page also switches to).
- Dashboard payload renames `roleColumn.logoFileId` → `roleColumn.profileImageFileId` and, in invite mode, returns the logged-in user's own image instead of the inviter's.

**Tech Stack:** Next.js 16 App Router, Prisma 6 (MongoDB), React 19, TypeScript. No test framework — verification via `npm run lint`, `npm run build`, and manual browser/curl checks.

**Reference spec:** [docs/superpowers/specs/2026-04-19-dashboard-company-type-and-profile-image-design.md](../specs/2026-04-19-dashboard-company-type-and-profile-image-design.md)

---

## File Map

**Create:**
- `lib/company-types.ts` — shared `COMPANY_TYPE_LABELS` map
- `app/api/profile/image/route.ts` — POST (upload) + DELETE (remove) for `profileImageFileId`
- `app/api/profile/image/[id]/route.ts` — GET for serving image bytes

**Modify:**
- `prisma/schema.prisma` — add `profileImageFileId String?` to `User`
- `app/profile/page.tsx` — import `COMPANY_TYPE_LABELS` from the new module (remove local copy)
- `app/api/orgs/mine/route.ts` — include `companyType` on each org
- `components/org-context.tsx` — add `companyType: string` to `OrgItem`
- `components/dashboard-header.tsx` — render company type label below company name; drop unused `role` prop
- `app/api/dashboard/route.ts` — rename `roleColumn.logoFileId` → `profileImageFileId`; invite mode returns logged-in user's own image + designation-based role label
- `app/dashboard/page.tsx` — consume new field, hit new endpoints

---

### Task 1: Add `profileImageFileId` to Prisma schema

**Files:**
- Modify: `prisma/schema.prisma` (User model, after line 38)

- [ ] **Step 1: Read current User model to confirm insertion point**

Run: (verify line 38 has `logoFileId     String?`)

- [ ] **Step 2: Add the new field**

Edit `prisma/schema.prisma`. Find the line:

```prisma
  logoFileId     String?
```

Insert directly after it:

```prisma
  profileImageFileId String?
```

The final block should look like:

```prisma
  logoFileId         String?
  profileImageFileId String?
  website            String?
```

(Whitespace alignment is optional — Prisma formats on `generate`.)

- [ ] **Step 3: Regenerate Prisma client**

Run: `npx prisma generate`
Expected: `✔ Generated Prisma Client`

- [ ] **Step 4: Verify TypeScript picks up the new field**

Run: `npx tsc --noEmit --pretty false 2>&1 | head -20`
Expected: No new errors (the field is not yet referenced anywhere).

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(schema): add User.profileImageFileId for personal profile image"
```

---

### Task 2: Create shared `COMPANY_TYPE_LABELS` module and refactor profile page

**Files:**
- Create: `lib/company-types.ts`
- Modify: `app/profile/page.tsx` (lines 33–40)

- [ ] **Step 1: Create the shared module**

Write `lib/company-types.ts`:

```ts
export const COMPANY_TYPE_LABELS: Record<string, string> = {
  management: 'Management Company',
  bank: 'Bank Office',
  reserve: 'Reserve Study Provider',
  advisor: 'Investor Advisor',
  board: 'Board Members',
  other: 'Other',
};
```

(Values match the existing labels in `app/profile/page.tsx` exactly — we are extracting, not changing copy.)

- [ ] **Step 2: Refactor `app/profile/page.tsx` to import from the module**

Locate the inline block at lines 33–40:

```tsx
const COMPANY_TYPE_LABELS: Record<string, string> = {
  management: 'Management Company',
  bank: 'Bank Office',
  reserve: 'Reserve Study Provider',
  advisor: 'Investor Advisor',
  board: 'Board Members',
  other: 'Other',
};
```

Delete that block and add this import near the top of the file (alongside the other `@/…` imports):

```tsx
import { COMPANY_TYPE_LABELS } from '@/lib/company-types';
```

- [ ] **Step 3: Verify the file still type-checks**

Run: `npx tsc --noEmit --pretty false 2>&1 | grep -E "app/profile/page\.tsx" | head -20`
Expected: No errors for that file.

- [ ] **Step 4: Commit**

```bash
git add lib/company-types.ts app/profile/page.tsx
git commit -m "refactor: extract COMPANY_TYPE_LABELS to lib/company-types"
```

---

### Task 3: Add `companyType` to `/api/orgs/mine` and `OrgItem`

**Files:**
- Modify: `components/org-context.tsx` (line 5–11)
- Modify: `app/api/orgs/mine/route.ts` (lines 14–20 and 40–47)

- [ ] **Step 1: Extend `OrgItem` type**

In `components/org-context.tsx`, find:

```ts
export type OrgItem = {
  id: string;
  name: string;
  roleLabel: string;
  kind: 'self' | 'invite';
  logoFileId: string | null;
};
```

Replace with:

```ts
export type OrgItem = {
  id: string;
  name: string;
  roleLabel: string;
  companyType: string;
  kind: 'self' | 'invite';
  logoFileId: string | null;
};
```

- [ ] **Step 2: Populate `companyType` in the self org**

In `app/api/orgs/mine/route.ts`, find the `selfOrg` object (lines 14–20):

```ts
  const selfOrg = {
    id: 'self',
    name: user.companyName || `${user.firstName || 'My'} ${user.lastName || ''}`.trim() || 'My Organization',
    roleLabel: ROLES[user.companyType] || 'Member',
    kind: 'self' as const,
    logoFileId: user.logoFileId || null,
  };
```

Add a `companyType` line so it becomes:

```ts
  const selfOrg = {
    id: 'self',
    name: user.companyName || `${user.firstName || 'My'} ${user.lastName || ''}`.trim() || 'My Organization',
    roleLabel: ROLES[user.companyType] || 'Member',
    companyType: user.companyType || '',
    kind: 'self' as const,
    logoFileId: user.logoFileId || null,
  };
```

- [ ] **Step 3: Populate `companyType` in each invite org**

In the same file, find the returned invite-org object (lines 40–47):

```ts
      return {
        id: invite.id,
        name: inviter.companyName || `${inviter.firstName || ''} ${inviter.lastName || ''}`.trim() || inviter.email,
        roleLabel: ROLES[inviter.companyType] || 'Member',
        kind: 'invite' as const,
        logoFileId: inviter.logoFileId || null,
      };
```

Add the `companyType` line:

```ts
      return {
        id: invite.id,
        name: inviter.companyName || `${inviter.firstName || ''} ${inviter.lastName || ''}`.trim() || inviter.email,
        roleLabel: ROLES[inviter.companyType] || 'Member',
        companyType: inviter.companyType || '',
        kind: 'invite' as const,
        logoFileId: inviter.logoFileId || null,
      };
```

- [ ] **Step 4: Verify no type errors**

Run: `npx tsc --noEmit --pretty false 2>&1 | head -30`
Expected: No errors (header still has the old label line but `OrgItem.companyType` is now a required field that the API does populate).

- [ ] **Step 5: Smoke-test the API (optional, requires running dev server)**

Run in a second terminal: `npm run dev`
Then: `curl -s -b "<session cookie>" http://localhost:3000/api/orgs/mine | jq`
Expected: Each org object includes `companyType`.

Skip this step if the dev server is awkward to set up — the type system is authoritative.

- [ ] **Step 6: Commit**

```bash
git add components/org-context.tsx app/api/orgs/mine/route.ts
git commit -m "feat(api): expose companyType on /api/orgs/mine"
```

---

### Task 4: Render company type label in the header

**Files:**
- Modify: `components/dashboard-header.tsx` (imports, props, line ~135)

- [ ] **Step 1: Add the import**

Near the existing `@/components/org-context` import (line 8), add:

```tsx
import { COMPANY_TYPE_LABELS } from '@/lib/company-types';
```

- [ ] **Step 2: Remove the now-unused `role` prop**

Find the props type and signature (lines 19–27):

```tsx
export type DashboardHeaderProps = {
  company?: string;
  role?: string;
};

export function DashboardHeader({
  company = 'Apex Global Assoc...',
  role = 'Super Admin',
}: DashboardHeaderProps) {
```

Replace with:

```tsx
export type DashboardHeaderProps = {
  company?: string;
};

export function DashboardHeader({
  company = 'Apex Global Assoc...',
}: DashboardHeaderProps) {
```

- [ ] **Step 3: Swap the secondary line to render the company type label**

Find the div at roughly line 135:

```tsx
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{selectedOrg?.roleLabel || role}</div>
```

Replace with:

```tsx
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
            {COMPANY_TYPE_LABELS[selectedOrg?.companyType ?? ''] || selectedOrg?.companyType || ''}
          </div>
```

- [ ] **Step 4: Verify no type errors and find any `role` prop callers**

Run: `npx tsc --noEmit --pretty false 2>&1 | head -30`
Expected: No errors.

Run: `grep -rn "DashboardHeader.*role=" /Users/anupammac/Documents/atul/reservefund/app /Users/anupammac/Documents/atul/reservefund/components 2>/dev/null`
Expected: No matches. If any callers pass `role=`, delete that prop at each call site.

- [ ] **Step 5: Commit**

```bash
git add components/dashboard-header.tsx
git commit -m "feat(header): show company type label below company name"
```

---

### Task 5: Create `POST`/`DELETE /api/profile/image` endpoint

**Files:**
- Create: `app/api/profile/image/route.ts`

- [ ] **Step 1: Create the route file**

Write `app/api/profile/image/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { uploadLogo, deleteLogo } from '@/lib/gridfs';

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
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
```

(This is a direct clone of `app/api/profile/logo/route.ts` with `logoFileId` → `profileImageFileId` and a `kind: 'profile-image'` tag in the GridFS metadata for observability.)

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit --pretty false 2>&1 | grep -E "profile/image" | head -20`
Expected: No errors. (If you see "Property 'profileImageFileId' does not exist on type …", Task 1 didn't run `prisma generate`; re-run it.)

- [ ] **Step 3: Commit**

```bash
git add app/api/profile/image/route.ts
git commit -m "feat(api): add POST/DELETE /api/profile/image for profile image"
```

---

### Task 6: Create `GET /api/profile/image/[id]` endpoint

**Files:**
- Create: `app/api/profile/image/[id]/route.ts`

- [ ] **Step 1: Create the route file**

Write `app/api/profile/image/[id]/route.ts`:

```ts
import { NextRequest } from 'next/server';
import { getLogo } from '@/lib/gridfs';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const image = await getLogo(id);
    if (!image) return new Response('Not found', { status: 404 });
    return new Response(new Uint8Array(image.buffer), {
      status: 200,
      headers: {
        'Content-Type': image.contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: any) {
    return new Response(err.message || 'Failed to load profile image', { status: 500 });
  }
}
```

(Same GridFS bucket as logos — only the write paths differ. `getLogo` reads by file id regardless of which user field stored it.)

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit --pretty false 2>&1 | grep -E "profile/image" | head -20`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/profile/image/[id]/route.ts
git commit -m "feat(api): add GET /api/profile/image/[id] to serve profile images"
```

---

### Task 7: Update `/api/dashboard` payload to use `profileImageFileId`

**Files:**
- Modify: `app/api/dashboard/route.ts` (type at line 16, payload at 106–126 and 128–253)

- [ ] **Step 1: Rename the payload field in the type**

Find (line 16):

```ts
  roleColumn: { logoFileId: string | null; roleLabel: string; description: string };
```

Replace with:

```ts
  roleColumn: { profileImageFileId: string | null; roleLabel: string; description: string };
```

- [ ] **Step 2: Update `buildSelfPayload` return value**

Find in `buildSelfPayload` (lines 107–111):

```ts
    roleColumn: {
      logoFileId: user.logoFileId || null,
      roleLabel: ROLES[user.companyType] || 'Member',
      description: 'You can manage associations, members and study data behalf of your company',
    },
```

Replace with:

```ts
    roleColumn: {
      profileImageFileId: user.profileImageFileId || null,
      roleLabel: ROLES[user.companyType] || 'Member',
      description: 'You can manage associations, members and study data behalf of your company',
    },
```

- [ ] **Step 3: Update `buildInvitePayload` — unavailable-inviter fallback**

Find (line 133):

```ts
      roleColumn: { logoFileId: null, roleLabel: 'Member', description: 'Organization unavailable.' },
```

Replace with:

```ts
      roleColumn: { profileImageFileId: null, roleLabel: 'Member', description: 'Organization unavailable.' },
```

- [ ] **Step 4: Update `buildInvitePayload` — main return**

Find (lines 235–240):

```ts
    hero: { addressLine: buildAddressLine(inviter) },
    roleColumn: {
      logoFileId: inviter.logoFileId || null,
      roleLabel: ROLES[inviter.companyType] || 'Member',
      description: `You are a member of ${inviter.companyName || fullName(inviter)}.`,
    },
```

Replace with:

```ts
    hero: { addressLine: buildAddressLine(inviter) },
    roleColumn: {
      profileImageFileId: user.profileImageFileId || null,
      roleLabel: user.designation || ROLES[user.companyType] || 'Member',
      description: `You are a ${user.designation || 'member'} at ${inviter.companyName || fullName(inviter)}.`,
    },
```

**Key change:** the invite payload now returns the **logged-in user's** own image + designation-based role, not the inviter's. This fixes the bug where invited members saw the inviter's image in the Role & Responsibility column.

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit --pretty false 2>&1 | grep -E "api/dashboard" | head -20`
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add app/api/dashboard/route.ts
git commit -m "feat(api): dashboard role column returns user's own profile image"
```

---

### Task 8: Wire `app/dashboard/page.tsx` to the new field and endpoints

**Files:**
- Modify: `app/dashboard/page.tsx` (type at line 23, local var at 226, image tag at 379–392, delete handler at 398, upload modal at 1117–1127)

- [ ] **Step 1: Rename the `DashboardData` field**

Find (line 23):

```tsx
  roleColumn: { logoFileId: string | null; roleLabel: string; description: string };
```

Replace with:

```tsx
  roleColumn: { profileImageFileId: string | null; roleLabel: string; description: string };
```

- [ ] **Step 2: Rename the local var**

Find (line 226):

```tsx
  const logoFileId = data?.roleColumn.logoFileId || null;
```

Replace with:

```tsx
  const profileImageFileId = data?.roleColumn.profileImageFileId || null;
```

- [ ] **Step 3: Update the `<img>` and empty-state inside the 56×56 slot**

Find the block (lines 379–392):

```tsx
                {logoFileId ? (
                  <img
                    src={`/api/profile/logo/${logoFileId}`}
                    alt="Profile"
                    style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center"
                    style={{ width: '56px', height: '56px', borderRadius: '10px', background: '#F1F4F9' }}
                  >
                    <UserCircle2 className="w-7 h-7" style={{ color: '#66717D' }} />
                  </div>
                )}
```

Replace with:

```tsx
                {profileImageFileId ? (
                  <img
                    src={`/api/profile/image/${profileImageFileId}`}
                    alt="Profile"
                    style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center"
                    style={{ width: '56px', height: '56px', borderRadius: '10px', background: '#F1F4F9' }}
                  >
                    <UserCircle2 className="w-7 h-7" style={{ color: '#66717D' }} />
                  </div>
                )}
```

- [ ] **Step 4: Update the hover-delete condition and its fetch URL**

Find (lines 393–400):

```tsx
                {isSelfOrg && logoFileId && avatarHovered && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetch('/api/profile/logo', { method: 'DELETE' }).then((r) => {
                        if (r.ok) fetchDashboard();
                      });
                    }}
```

Replace with:

```tsx
                {isSelfOrg && profileImageFileId && avatarHovered && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetch('/api/profile/image', { method: 'DELETE' }).then((r) => {
                        if (r.ok) fetchDashboard();
                      });
                    }}
```

- [ ] **Step 5: Update the `UploadLogoModal` upload handler URL**

Find (lines 1117–1127):

```tsx
      <UploadLogoModal
        open={avatarUploadOpen}
        title="Upload your profile image"
        onClose={() => setAvatarUploadOpen(false)}
        onApply={async ({ file }) => {
          const form = new FormData();
          form.append('file', file);
          const res = await fetch('/api/profile/logo', { method: 'POST', credentials: 'include', body: form });
          if (res.ok) await fetchDashboard();
        }}
      />
```

Replace with:

```tsx
      <UploadLogoModal
        open={avatarUploadOpen}
        title="Upload your profile image"
        onClose={() => setAvatarUploadOpen(false)}
        onApply={async ({ file }) => {
          const form = new FormData();
          form.append('file', file);
          const res = await fetch('/api/profile/image', { method: 'POST', credentials: 'include', body: form });
          if (res.ok) await fetchDashboard();
        }}
      />
```

- [ ] **Step 6: Verify no remaining references to the old field name inside this file**

Run: `grep -n "logoFileId" /Users/anupammac/Documents/atul/reservefund/app/dashboard/page.tsx`
Expected: No matches.

Run: `grep -n "/api/profile/logo" /Users/anupammac/Documents/atul/reservefund/app/dashboard/page.tsx`
Expected: No matches. (The profile page at `app/profile/page.tsx` intentionally still uses `/api/profile/logo` for the onboarding company-logo upload — that's correct.)

- [ ] **Step 7: Type-check**

Run: `npx tsc --noEmit --pretty false 2>&1 | grep -E "app/dashboard/page" | head -20`
Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat(dashboard): wire Role & Responsibility to /api/profile/image"
```

---

### Task 9: Full-project verification

**Files:** (none modified)

- [ ] **Step 1: Full type-check**

Run: `npx tsc --noEmit --pretty false 2>&1 | head -40`
Expected: No errors.

- [ ] **Step 2: Lint**

Run: `npm run lint 2>&1 | tail -20`
Expected: No new errors introduced by these changes. (Pre-existing warnings are acceptable.)

- [ ] **Step 3: Build**

Run: `npm run build 2>&1 | tail -40`
Expected: Build succeeds. The new routes `app/api/profile/image/route.ts` and `app/api/profile/image/[id]/route.ts` should appear in the route list output.

- [ ] **Step 4: Manual smoke test — self mode**

Start the dev server: `npm run dev`

In a browser:
1. Log in as a user who has `logoFileId` already set (existing user).
2. Open `/dashboard` — the header's left 36×36 shows the company logo as before. The text below the company name shows the company type label (e.g., "Management Company" for `companyType=management`). The Role & Responsibility column shows the placeholder `UserCircle2` icon (since `profileImageFileId` is null for all existing users).
3. Click the 56×56 slot in the Role & Responsibility column → `UploadLogoModal` opens.
4. Upload a small PNG → the 56×56 updates; **the header 36×36 and org switcher thumbnails do not change**.
5. Hover the 56×56 → delete button appears → click → 56×56 reverts to placeholder; header unchanged.

- [ ] **Step 5: Manual smoke test — invite mode**

Prerequisite: a second user who has accepted an invite from the first user.

1. Log in as the invited user.
2. Open the org switcher in the header → select the inviter's org.
3. The header shows the inviter's company name and below it the inviter's company type label.
4. The Role & Responsibility column shows the **logged-in invited user's** own `profileImageFileId` image (placeholder if not uploaded) and their own designation as the role label, with description `You are a {designation} at {inviter.companyName}.`
5. Clicking the 56×56 in this mode does **not** open the upload modal (edit gate is `isSelfOrg`).

- [ ] **Step 6: Commit any follow-up cleanup (if needed)**

If any stray references to the old field were found during manual testing, fix them now and commit:

```bash
git add <files>
git commit -m "fix: clean up post-decoupling references"
```

Otherwise no commit is needed for this step.

---

## Out of Scope (tracked here for clarity)

- Data migration of existing `logoFileId` into `profileImageFileId`. Per the spec, existing users keep their company logo where it is; their Role & Responsibility column starts empty until they upload a personal image.
- Shared upload/delete helper collapsing `/api/profile/logo` and `/api/profile/image` (duplication is tolerated for now — see Risks section in spec).
- Allowing invited members to upload their profile image from the invite-org view.
