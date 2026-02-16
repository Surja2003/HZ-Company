# Scalability Roadmap

## When to migrate to Next.js
Move from SPA (Vite) to Next.js when you need one or more of:
- Large SEO surface area (blog, many landing pages) where SSR/SSG materially improves crawl/indexing.
- Content-driven growth with frequent publishing.
- Personalization by geo/auth where server rendering helps.
- Significant performance needs on low-end mobile networks.

Suggested trigger: once the site grows beyond ~20–30 public pages or adds a blog with many posts, Next.js (SSG + ISR) becomes a strong fit.

## Adding a blog with a headless CMS
Options:
- Sanity / Contentful / Strapi / Directus

Approach:
- Define content models: Post, Author, Category, SEO fields, Open Graph image.
- Fetch content at build time (SSG) + incremental rebuilds.
- Keep design consistent with existing Tailwind system.

## Admin dashboard architecture
Goal: internal view of submissions and lead statuses.

Recommended architecture:
- Separate app: `admin/` (React/Next) behind auth.
- Backend: add auth (JWT + refresh tokens or session cookies).
- RBAC roles: Admin, Sales, Support.

Key features:
- Inbox-style submission list, filtering, status pipeline.
- Export CSV.
- Audit log for state changes.

## CRM integration options
- HubSpot, Zoho, Salesforce, Pipedrive.

Integration patterns:
- Sync on write: create lead/contact immediately on submission.
- Queue-based: push submission to a job queue (BullMQ/SQS) to retry on failure.
- Webhooks: send sanitized payload to an integration service.

## API scaling milestones
- Add structured logging + request IDs.
- Move email sending to async worker for reliability.
- Add queue + dead-letter handling.
- Add DB indexes based on query patterns.
- Add caching layer only if needed (most lead APIs don’t need it).
