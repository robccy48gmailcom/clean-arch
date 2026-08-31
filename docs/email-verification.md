# Email verification on register

Registration currently creates the user and lets them log in immediately. There is no mailer, no `emailVerified` flag, and login only checks email + password.

A verification email is a second step: create the account as **unverified**, send a time-limited link, then mark the user verified when they click it. Login should reject unverified users.

## Flow

```
Register → create user (emailVerified = false)
        → send email with link:  https://your-app/verify-email?token=...

User clicks link → frontend page calls POST /api/auth/verify-email
                 → backend marks emailVerified = true

Login → if emailVerified is false → reject
```

Also add **resend verification** so they can request a new email.

---

## 1. Database

Add a column on `users`. This repo already uses `db-migrate`:

```sql
ALTER TABLE `users`
  ADD COLUMN `emailVerified` TINYINT(1) NOT NULL DEFAULT 0;
```

You do **not** need to store the token in the DB if you use a short-lived JWT (this project already has `issueToken` / `verifyToken`). Store a hashed token in the DB only if you want one-time use and easy invalidation.

---

## 2. Backend (`clean-arch`) — layer by layer

This matches how register already works: route → controller → use case → DAO.

### Entity

Add `emailVerified` on `User` in `src/entities/user.ts`.

### Token

Reuse JWT, but with a **different purpose** so a verify token cannot be used as a login token.

On register, issue something like:

```ts
this.issueToken(
  { id: user.id, email: user.email, purpose: 'email-verify' },
  '1d', // 24 hours
);
```

On verify, decode the token and **require** `purpose === 'email-verify'`. Current `issueToken` / `verifyToken` only sign/verify the payload — they do not check purpose, so that check belongs in the verify use case.

### Email sender (infrastructure)

There is no mailer yet. Add one under `src/infrastructure/` (for example `utils/email/sendMail.ts`) and inject it like `encryptPassword`.

Use Nodemailer (or Resend/SendGrid). Config in `src/config/app.ts`:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `FRONTEND_URL` (e.g. `http://localhost:5173`) so the link points at the React app

The email body is a link:

```
${FRONTEND_URL}/verify-email?token=${token}
```

For local testing you can log the link instead of sending, or use [Ethereal](https://ethereal.email) / Mailhog.

### Register use case

`RegisterUser` currently creates the user and stops. After `userDAO.create`:

1. Set `emailVerified: false` (or rely on the DB default).
2. Issue the verify JWT.
3. Send the email.
4. Still return `{ success: true }` — do **not** return a login token.

Keep sending the email **after** the user row exists. If mail fails, the account is still there; they can use resend.

### New use case: `VerifyEmail`

```
token → verify JWT → check purpose === 'email-verify'
     → find user by id
     → if already verified, succeed (idempotent)
     → userDAO.update(id, { emailVerified: true })
```

Do not log the user in here unless you want auto-login after verify. Simpler: show “email verified, please log in”.

### New use case: `ResendVerification`

```
email → find user
     → if missing or already verified: still return { success: true }
        (do not reveal whether the email exists)
     → issue new token + send email
```

### Login use case

In `src/use-cases/user/login.ts`, after passwords match:

```ts
if (!user.emailVerified) {
  throw new UnauthorizedError('Please verify your email before logging in');
}
```

`findForAuth` already does `SELECT *`, so `emailVerified` will be on the row once the column exists. Add it to `AuthUser` as well.

### Routes

In `src/infrastructure/api/express/routes/auth.ts`:

| Method | Path | Body |
|---|---|---|
| existing | `POST /auth/register` | unchanged |
| new | `POST /auth/verify-email` | `{ token }` |
| new | `POST /auth/resend-verification` | `{ email }` |

Wire them the same way as register: thin route → `AuthController` method → use case.

`IUserDAO` already has `update`, so you may not need a new DAO method.

---

## 3. Frontend (`react-app`)

### Register success copy

`Register.tsx` currently says “go to Login”. Change it to:

> Check your email and click the verification link.

Optional: a “Resend email” button that POSTs `/api/auth/resend-verification`.

### New page: `/verify-email`

The link in the email hits this page, not the API directly.

1. Read `token` from `useSearchParams()`.
2. On mount, `POST /api/auth/verify-email` with `{ token }`.
3. Show success or “invalid/expired link”.
4. Link to `/login`.

Add the route next to register in `src/router.tsx`:

```tsx
<Route path="/verify-email" element={<VerifyEmailPage />} />
```

### Login

If the API returns “verify your email”, show that instead of a generic “incorrect password”. You can also offer resend on that screen.

---

## 4. Security notes

- **Purpose claim** — a verify JWT must not work as a session token.
- **Expiry** — keep it short (24h is typical).
- **Resend** — always return success; do not say “email not found”.
- **Rate-limit** register and resend so the mailer cannot be abused.
- **Do not auto-login** from the verify link unless the token is one-time (JWT alone is not one-time; anyone with the link can use it until it expires).

If you want one-time links: generate `crypto.randomBytes(32)`, store `sha256(token)` + expiry on the user (or a `email_verification_tokens` table), send the raw token in the URL, and clear it after a successful verify.

---

## 5. Suggested file map

### clean-arch

- migration: add `emailVerified`
- `src/entities/user.ts` — field
- `src/use-cases/user/register.ts` — send mail after create
- `src/use-cases/user/verifyEmail.ts` — **new**
- `src/use-cases/user/resendVerification.ts` — **new**
- `src/use-cases/user/login.ts` — block unverified
- `src/controllers/auth.ts` — `verifyEmail` / `resendVerification`
- `src/infrastructure/api/express/routes/auth.ts` — two routes
- `src/infrastructure/utils/email/` — mailer
- `src/config/services.ts` — register the mailer like other utils

### react-app

- `src/pages/VerifyEmail.tsx` — **new**
- `src/router.tsx` — `/verify-email`
- `src/pages/Register.tsx` — “check your email”
- `src/pages/Login.tsx` — unverified message + optional resend

---

## 6. Minimal path vs full path

**Minimum that works:** `emailVerified` column + JWT verify link + block login + verify page.

**Worth adding next:** resend, rate limits, and (if you care about one-click reuse) a hashed token in the DB.
