# Production Hardening Guide

## 2) Performance hardening

### Responsive images (srcset)
You already use an image component that forwards native `<img>` attributes.

Use:
- `srcSet` with multiple widths
- `sizes` matching layout breakpoints

Example:
- `srcSet="/img/hero-640.webp 640w, /img/hero-1024.webp 1024w, /img/hero-1600.webp 1600w"`
- `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"`

### WebP conversion strategy
- Export originals as PNG/JPG.
- Produce WebP variants for each key breakpoint width.
- Keep originals for fallback if needed.

Recommended automation:
- CI step using `sharp` to generate WebP + resized outputs.
- Commit generated assets or publish as build artifacts.

### CDN deployment suggestions
- Serve `dist/` via CDN (Cloudflare Pages, Netlify, Vercel static, S3+CloudFront).
- Enable Brotli and HTTP/2.
- Use image optimization at the edge if available.

### Caching headers
At the edge (CDN or reverse proxy):
- `index.html`: `Cache-Control: no-store` (or short TTL)
- `/assets/*`: `Cache-Control: public, max-age=31536000, immutable`

## 3) Analytics & tracking

### Google Analytics (gtag)
- Add GA script to `index.html`.
- Confirm `window.gtag` exists.
- Events are fired from:
  - WhatsApp button clicks (`whatsapp_click`)
  - Contact form submits (`contact_submit`)
  - Hire Us submits (`hire_us_submit`)

### Plausible
- Add Plausible script.
- Confirm `window.plausible` exists.

### WhatsApp click tracking
Already wired on the floating CTA.

### Form conversion tracking
Already fires events on success/error/honeypot.

## 4) Security hardening (backend)

- Helmet enabled.
- Allowlist CORS.
- Rate limiting on `/api/*`.
- Zod validation + sanitization.
- Production-safe error responses.

## 5) Trust & conversion enhancements (implementation suggestions)

### Founder section with structured data
Add JSON-LD `Person` embedded on About page and link it from `Organization`.

### Testimonials with review schema
Use JSON-LD `Review` or `AggregateRating` only if:
- Reviews are real and attributable
- You can provide required properties (author, item reviewed)

### Business address schema
Already supported via LocalBusiness schema pattern; ensure NAP is accurate:
- Name
- Address
- Phone
- Opening hours
- SameAs social URLs
