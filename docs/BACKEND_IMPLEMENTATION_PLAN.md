# Backend Implementation Plan (Express.js)

This repo now includes a backend scaffold under `server/` designed for real-world deployment (validation, rate limiting, spam protection, email delivery, and persistence).

## 1) Backend folder structure

```
server/
  README.md
  .env.example
  package.json
  tsconfig.json
  db/
    schema.sql
  src/
    index.ts
    app.ts
    lib/
      env.ts
      logger.ts
      db.ts
      sanitize.ts
      email.ts
    middleware/
      rateLimit.ts
      requestContext.ts
      errorHandler.ts
    routes/
      schemas.ts
      contact.ts
      hireUs.ts
```

## 2) Endpoints

- `POST /api/contact`
- `POST /api/hire-us`

Both endpoints:
- Validate input using Zod (`src/routes/schemas.ts`).
- Apply rate limiting via `express-rate-limit` (`src/middleware/rateLimit.ts`).
- Support honeypot spam protection via `honeypot` field.
- Persist submissions to Postgres (see `db/schema.sql`).
- Send lead emails via Resend (`src/lib/email.ts`).

## 3) Server-side validation (Zod)

Validation is performed using `safeParse` and returns:
- `400` with `{ ok: false, error: "Invalid request", details: <flattened zod errors> }`

## 4) Rate limiting

Configured for `/api/*` routes in `src/app.ts`.

Env:
- `RATE_LIMIT_WINDOW_MS` (default `60000`)
- `RATE_LIMIT_MAX` (default `20`)

## 5) Honeypot spam protection

The frontend submits a `honeypot` field.

Server behavior:
- If `honeypot` is non-empty → immediately returns `{ ok: true }` without saving or emailing.

This avoids giving bots a signal while protecting your inbox and DB.

## 6) Email delivery integration

Current implementation uses Resend:
- Env: `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO`

If you later prefer SMTP, you can swap `src/lib/email.ts` with a Nodemailer transport.

## 7) Database schema

See `server/db/schema.sql`.

Tables:
- `contact_submissions`
- `hire_us_submissions`

Each stores:
- The submitted fields
- `created_at`
- `ip`, `user_agent`, `referer` (useful for debugging and spam analysis)

## 8) Running locally

From the `server/` folder:
- `npm install`
- Create `.env` based on `.env.example`
- Apply `db/schema.sql` to your Postgres database
- `npm run dev`

Health check:
- `GET /health`
