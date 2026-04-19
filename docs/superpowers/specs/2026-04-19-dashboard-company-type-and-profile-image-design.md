---
date: 2026-04-19
topic: Dashboard header company type label & decoupled user profile image
status: draft
---

# Dashboard header company type label & decoupled user profile image

## Summary

Two related changes to the dashboard:

1. **Header — below company name:** always show the company *profile type* label (e.g. "Management Company", "Bank Office"), not the user's role. Works identically when an invited member switches to the inviter's org.
2. **Role & Responsibility column (dashboard first column):** show the logged-in user's **personal profile image**, decoupled from the company logo. Today the same `User.logoFileId` backs both — uploads from the column update the header logo as a side effect. Split into two fields so each surface has its own image.

## Motivation

- The header's secondary line currently shows the user's role (e.g. "Property Manager") — the product wants the company type label there instead so invited members see a clear identifier of which company they're currently working inside.
- The Role & Responsibility column's "profile image" and the header's company logo are conceptually different things, but share the same DB field. Editing the avatar in the column unintentionally replaces the company logo in the header and the org switcher thumbnails. Users expect these to be independent.
- Invite mode currently shows the *inviter's* logo in the Role & Responsibility column, which is wrong — this column should represent the logged-in user, not the org they're viewing.

## Scope

### In scope
- Schema change adding `User.profileImageFileId`.
- New endpoints for reading/writing the user's profile image.
- Dashboard payload and UI wire-up to the new field/endpoints.
- Header secondary line switches from role label to company type label.
- Org API includes `companyType` per org so the header can render without additional fetches.

### Out of scope (explicitly unchanged)
- Header 36×36 logo (left of company name) — keeps reading `user.logoFileId` via `/api/auth/me`.
- Right-side user menu / bell icon.
- Org switcher modal thumbnails — still read the selected org's `logoFileId`.
- Association logos (separate `Association.logoFileId` field, unrelated).
- Invited members editing their profile image from the invite-org view — remains disabled (edit gate stays `isSelfOrg`).

## Design

### 1. Schema

`prisma/schema.prisma` — add one nullable field to `User`:

```prisma
model User {
  // ...existing fields...
  logoFileId         String?   // company logo (unchanged)
  profileImageFileId String?   // personal profile image (NEW)
  // ...
}
```

Existing users have `profileImageFileId = null` until they upload one from the Role & Responsibility column.

### 2. Company-type label module

New file `lib/company-types.ts`:

```ts
export const COMPANY_TYPE_LABELS: Record<string, string> = {
  management: 'Management Company',
  bank: 'Bank Office',
  reserve: 'Reserve Study Provider',
  advisor: 'Investment Advisor',
  board: 'Board / Association',
};
```

Refactor the existing inline copy at `app/profile/page.tsx:34` to import from this module.

### 3. Org API returns `companyType`

`app/api/orgs/mine/route.ts` — include `companyType` in both the self org and each invite org:

- Self: `companyType: user.companyType`
- Invite: `companyType: inviter.companyType`

`components/org-context.tsx` — extend `OrgItem`:

```ts
export type OrgItem = {
  id: string;
  name: string;
  roleLabel: string;
  companyType: string;      // NEW
  kind: 'self' | 'invite';
  logoFileId: string | null;
};
```

### 4. Header renders company type below company name

`components/dashboard-header.tsx` — replace the secondary line currently showing `selectedOrg?.roleLabel || role` with:

```tsx
<div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
  {COMPANY_TYPE_LABELS[selectedOrg?.companyType ?? ''] || selectedOrg?.companyType || ''}
</div>
```

The `company` and `role` props on `DashboardHeader` become unused for this line; `role` prop is removed from the component signature and all call sites.

### 5. New profile-image endpoints

Mirror the existing `/api/profile/logo` layout exactly.

**`app/api/profile/image/route.ts`** (new):
- `POST` — accepts `multipart/form-data` with `file`, uploads via `saveLogo`, deletes the previous `profileImageFileId` if present, writes the new id to `user.profileImageFileId`, returns `{ profileImageFileId }`.
- `DELETE` — deletes the stored file if any and clears `user.profileImageFileId`.

**`app/api/profile/image/[id]/route.ts`** (new):
- `GET` — streams the image bytes for the given file id (same implementation as the corresponding logo route).

Both routes copy the existing logo routes' auth, error handling, and storage helpers. No logic changes.

### 6. Dashboard payload field rename

`app/api/dashboard/route.ts`:

```ts
type DashboardPayload = {
  // ...
  roleColumn: {
    profileImageFileId: string | null;   // renamed from logoFileId
    roleLabel: string;
    description: string;
  };
  // ...
};
```

- **`buildSelfPayload`:** `profileImageFileId: user.profileImageFileId ?? null`. `roleLabel` unchanged.
- **`buildInvitePayload`:** `profileImageFileId: user.profileImageFileId ?? null` (logged-in user's own — *not* the inviter's). `roleLabel: user.designation || ROLES[user.companyType] || 'Member'`. Description: `You are a ${user.designation || 'member'} at ${inviter.companyName || fullName(inviter)}.`
- The "organization unavailable" fallback branch also returns `profileImageFileId: null`.

### 7. Dashboard page rewires to the new field/endpoint

`app/dashboard/page.tsx`:

- `DashboardData` type → `roleColumn.profileImageFileId: string | null`
- Local var: `const profileImageFileId = data?.roleColumn.profileImageFileId || null;`
- `<img src={/api/profile/image/${profileImageFileId}} />` in the 56×56 avatar.
- `UploadLogoModal.onApply` → `POST /api/profile/image`.
- Hover delete button → `DELETE /api/profile/image`.
- Upload/delete only enabled when `isSelfOrg` is true (unchanged gate).

### 8. Data flow verification

| User action | `logoFileId` | `profileImageFileId` | Header 36×36 | Org switcher | Role col 56×56 |
|---|---|---|---|---|---|
| Role & Responsibility upload | unchanged | updated | unchanged | unchanged | updated |
| Onboarding company logo upload | updated | unchanged | updated | updated | unchanged |
| Invited member views invite dashboard | inviter's logo (in header/switcher) | their own | inviter's | inviter's thumb for that row | their own |

No read or write path is shared between the two images.

## Testing plan

Manual verification (no test framework currently in the repo for these flows):

1. **Fresh user, self mode**
   - Register, complete profile, upload company logo during onboarding → header 36×36 and org switcher show it; Role & Responsibility 56×56 shows the empty placeholder.
   - Upload image from Role & Responsibility column → only the 56×56 changes; header and org switcher remain the company logo.
   - Delete the Role & Responsibility image → 56×56 reverts to placeholder; header unchanged.

2. **Invited member, invite mode**
   - Log in as an invited member who accepted an invite.
   - Switch to the inviter's org in the header switcher.
   - Header shows the inviter's company name + `COMPANY_TYPE_LABELS[inviter.companyType]` below.
   - Role & Responsibility column shows the logged-in user's own `profileImageFileId` image (or placeholder if not set), role label from their own `designation`, and description "You are a {designation} at {inviter.companyName}."
   - Clicking the avatar in the column does **not** open the upload modal (edit gate disabled in invite mode).

3. **Header label across company types**
   - For each `companyType` in `COMPANY_TYPE_LABELS` (`management`, `bank`, `reserve`, `advisor`, `board`), confirm the correct label renders.
   - Unknown `companyType` (edge case) falls back to the raw string — no crash.

4. **Migration / existing data**
   - Existing users retain their `logoFileId`. `profileImageFileId` starts null. Role & Responsibility column shows placeholder until the user uploads one.

## Risks & trade-offs

- **Existing users lose the image that was previously in the Role & Responsibility column.** Because today's `logoFileId` is being used as both company logo and profile image, we cannot auto-migrate — we don't know which existing users intended it as one vs the other. Existing `logoFileId` stays as the company logo (header/switcher), and `profileImageFileId` starts empty. Users will see a placeholder in the Role column and can re-upload.
  - Alternative considered: auto-copy `logoFileId` to `profileImageFileId` for existing users during migration. Rejected because it would duplicate files and users may want a different personal image than their company logo going forward.
- **Endpoint duplication.** `/api/profile/logo` and `/api/profile/image` are near-identical. A shared helper could collapse them, but the two concepts may diverge (different auth rules, different validation) so we keep them separate for now.

## Out of scope for follow-ups

- Allowing invited members to upload their profile image from the invite-org view (currently gated by `isSelfOrg`).
- A unified profile-settings page that shows both images side by side.
- Admin UI exposure of `profileImageFileId`.
