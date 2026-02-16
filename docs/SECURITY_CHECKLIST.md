# Security Checklist (HZ IT Company)

## HTTP & Transport
- Use HTTPS everywhere (HSTS at the edge).
- Terminate TLS at a trusted load balancer/CDN.

## Headers (backend)
- Enable Helmet.
- Add/validate CSP once analytics scripts are finalized.
- Disable `x-powered-by` (Express default is already removed when using Helmet).

## CORS
- Use allowlist-based CORS (no `*` in production).
- Restrict methods to `POST` for the form API.

## Input validation & sanitization
- Validate request bodies server-side using Zod.
- Treat all input as untrusted; store as plain text.
- Sanitize user-provided strings (strip HTML) before storing and emailing.
- Enforce payload size limits (JSON limit).

## Spam & abuse protection
- Honeypot field supported.
- Rate limit `/api/*`.
- Consider IP reputation checks or CAPTCHA only if spam becomes persistent.

## Secrets & configuration
- Never commit `.env` files.
- Validate environment variables at startup (fail fast).
- Rotate API keys and SMTP credentials.

## Error handling
- Never return stack traces in production responses.
- Log server errors with correlation-friendly context.

## Data protection
- Store only what you need.
- Add retention policy (e.g., delete leads older than 12–24 months).
- Limit DB access to the API service account.

## Dependencies
- Run `npm audit --omit=dev` in CI for backend and frontend.
- Keep Express and core middleware patched.

## Logging
- Redact credentials/cookies.
- Avoid logging full message bodies in production logs if sensitive.
