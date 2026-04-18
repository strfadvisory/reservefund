# Existing-User Invite Consent Flow

**Date:** 2026-04-18
**Status:** Design approved, ready for implementation plan

## Problem

Today, when a user invites someone via the dashboard ([app/dashboard/page.tsx](../../../app/dashboard/page.tsx)) and the invitee's email **already exists** in the `User` table, the invite is silently created with `status: 'linked'` — no email, no consent from the invitee ([app/api/invite/route.ts:26-42](../../../app/api/invite/route.ts#L26-L42)). The existing user has no say in whether they want to be associated with the inviter.

The non-existent-user flow (email → signup → `/invite/accept?token=...`) already works correctly and is not changed.

## Goal

When an invitee already exists in the database:

1. Send them a notification email that they've been invited.
2. On their next dashboard load, show a blocking **Choose for next step** popup with **Accept** / **Deny** options.
3. On **Deny**: email the inviter ("{invitee} declined your invitation"), mark invite `denied`.
4. On **Accept**: show a follow-up list of the inviter's associations; invitee picks one (single-select). Mark invite `accepted` with the chosen association.

## Non-Goals

- No changes to the non-existent-user signup flow.
- No changes to `/app/invitemember/page.tsx` (separate flow, hardcoded data).
- No notification/inbox abstraction — this is invite-specific.
- No test framework — manual QA only (none is set up in this repo).
- No invite deduplication (two invites from same inviter → two separate decisions).

## Data Model Changes

Extend `Invite` in [prisma/schema.prisma](../../../prisma/schema.prisma):

```prisma
model Invite {
  // ... existing fields ...
  chosenAssociationId String? @db.ObjectId  // NEW: association selected by invitee on accept
}
```

Status vocabulary (documented in code comment):

| Status | Meaning | Set when |
|---|---|---|
| `pending` | Non-existent user, email sent with signup token | Inviter invites a new email (unchanged) |
| `awaiting_response` | Existing user, awaiting in-app accept/deny | Inviter invites an existing email (replaces `linked`) |
| `accepted` | Existing user accepted and chose an association | Invitee clicks Accept + picks association |
| `denied` | Existing user declined | Invitee clicks Deny |
| `linked` | **Legacy only** — retained for backward compat with records created before this change. UI treats as `Active`. |

The existing `accepted` status used by the new-user signup flow (`/api/invite/accept`) continues to work — no conflict.

## API Changes

### Modified: `POST /api/invite`

When the invitee's email matches an existing `User`:

- Create invite with `status: 'awaiting_response'` (instead of `'linked'`).
- Send notification email to invitee (see Emails below).
- Return `{ invite, linked: false, awaitingResponse: true }`.

Additionally: reject self-invites — compare `inviter.email.toLowerCase()` with the request's `normalizedEmail`. Return 400 "You cannot invite yourself."

### New: `GET /api/invite/pending`

- Auth: session required.
- Returns invites where `linkedUserId == currentUser.id && status == 'awaiting_response'`.
- Each invite is hydrated with:
  - `inviter`: `{ firstName, lastName, email, companyName }`
  - `inviterAssociations`: `[{ id, associationName, city?, managerFirstName?, managerLastName? }]` (from `Association` table where `userId == invite.invitedBy`)
- Sorted oldest first (so invitee handles them in order received).

### New: `POST /api/invite/[id]/respond`

- Auth: session user must equal `invite.linkedUserId`.
- Body: `{ action: 'accept' | 'deny', associationId?: string }`
- Status guard: if invite is not `awaiting_response`, return 409 Conflict.
- On `accept`:
  - Require `associationId`.
  - Validate the association exists and `association.userId == invite.invitedBy`. If not, 400.
  - Update invite: `status: 'accepted'`, `chosenAssociationId: <id>`.
  - Return `{ ok: true }`.
- On `deny`:
  - Update invite: `status: 'denied'`.
  - Send denial email to inviter (failure logged but not blocking).
  - Return `{ ok: true }`.

### Unchanged

- `GET /api/invite` — inviter's list. Naturally returns new statuses; UI maps them in `refreshInvites`.
- `GET /api/invite/accept`, `POST /api/invite/accept` — new-user signup flow, untouched.

## UI Changes

### Dashboard ([app/dashboard/page.tsx](../../../app/dashboard/page.tsx))

**On mount:** fetch `/api/invite/pending` alongside existing calls. Store the list as `pendingInvites` state.

**Pending-invite modal:** new blocking modal (portal, z-index above existing intro). Priority:

1. If `pendingInvites.length > 0`: show this modal first (suppress the invite-intro).
2. Otherwise: existing intro popup behavior unchanged.

Styled per master layout: `643px` card, `#D7D7D7` border, `7px` radius, `#102C4A` text, `#0E519B` primary. Same overlay/backdrop as existing modals.

Two phases driven by local state (`phase: 'choose' | 'pickAssociation'`):

**Phase 1 — Choose next step:**
- Header: "Invitation Request" + "1 of N" counter if multiple.
- Body: "{inviterFullName} from {companyName} has invited you to join as {roleLabel}."
- Actions row: `Accept` (primary `#0E519B`) and `Deny` (outlined, `#D7D7D7` border).

**Phase 2 — Choose association (after Accept):**
- Header: "Choose Association".
- Body: radio-group list of `inviterAssociations`, each row shows `associationName` (primary) and `city` or manager name (secondary), styled like existing `ListColumn` items.
- Empty state (no associations): "This user has no associations yet." + `Close` button (leaves invite `awaiting_response`).
- Action: `Confirm` button, disabled until one is selected. On click, POST `/api/invite/{id}/respond` with `{ action: 'accept', associationId }`.

**After each response:** advance to next pending invite. When exhausted, close modal and call `refreshInvites()` (no-op for the invitee; ensures consistency if they're also an inviter).

### Inviter's dashboard list ([app/dashboard/page.tsx:117](../../../app/dashboard/page.tsx#L117))

Extend status mapping in `refreshInvites`:

| Server status | UI status | Color |
|---|---|---|
| `awaiting_response` | "Pending" | `#98A2B3` (grey) |
| `accepted` | "Active" | `#12B76A` (green) |
| `linked` (legacy) | "Active" | `#12B76A` (green) |
| `denied` | "Denied" | `#DC2626` (red) |
| `pending` | "Pending" | `#98A2B3` (grey) |

### Not changed

- [app/invitemember/page.tsx](../../../app/invitemember/page.tsx) — separate flow, hardcoded data.
- [app/invite/accept/page.tsx](../../../app/invite/accept/page.tsx) — new-user signup page, untouched.

## Emails

Two new exported functions in [lib/mailer.ts](../../../lib/mailer.ts), matching `sendInviteEmail`'s style.

### `sendExistingUserInviteNotification`

Sent from `POST /api/invite` when invitee exists.

- Subject: `{inviterName} invited you to join {companyName}`
- Body: "Hi {inviteeFirstName}, {inviterName} ({companyName}) has invited you to join as {roleLabel}. Log in to your account to accept or decline this request."
- CTA: `[Log in]` button → `{origin}/login`.
- Failure returns 502 from the API (same as current new-user invite flow).

### `sendInviteDeniedNotification`

Sent from `POST /api/invite/[id]/respond` on deny.

- Recipient: inviter's email.
- Subject: `{inviteeName} declined your invitation`
- Body: "Hi {inviterFirstName}, {inviteeName} ({inviteeEmail}) has declined your invitation to join {companyName}. You can invite them again from your dashboard if needed."
- **Name source:** `inviteeName` uses the `User` record's `firstName`/`lastName` if set, else falls back to the `Invite` record's `firstName`/`lastName` (which was entered by the inviter).
- Failure logged (console.error) but does not block the invite status update.

## Error Handling

| Scenario | Behavior |
|---|---|
| Self-invite | `POST /api/invite` returns 400 "You cannot invite yourself." |
| Invitee has no associations from inviter | Phase 2 shows empty state, invite left `awaiting_response` |
| Invite already responded (stale modal) | `respond` endpoint returns 409; UI shows inline error, advances to next |
| Association deleted between invite and response | `respond` returns 400 "Invalid association" |
| Denial email fails | Logged; status update still persists |
| Notification email fails on invite | API returns 502 (same as current behavior) |
| Multiple pending invites | Shown sequentially with "1 of N" counter |
| Duplicate invites from same inviter | Not deduplicated — each is a separate decision |

## Verification (Manual QA)

No test framework is configured in this repo. The implementation plan will include explicit manual steps:

1. Inviter A invites existing user B → B receives email, invite shows "Pending" on A's dashboard.
2. B logs in → blocking modal appears.
3. B clicks Deny → modal closes, A receives denial email, A's dashboard shows "Denied".
4. A re-invites B → new invite created, B sees modal again.
5. B clicks Accept, no associations available → empty state appears, invite stays `awaiting_response`.
6. A creates an association, B reloads → modal reappears, B sees association in Phase 2.
7. B selects association, clicks Confirm → invite `accepted`, A's dashboard shows "Active".
8. A sends two invites in rapid succession → B sees both sequentially, 1 of 2 → 2 of 2.
9. Self-invite attempt by A → 400 error surfaces on A's dashboard.
10. Existing `linked` records in DB (pre-migration) still show "Active" on A's dashboard.
