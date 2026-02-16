# HZ IT Company API (Express)

This folder contains the production-ready backend skeleton for the website forms.

## Quick start

1) Copy env file:

- `cp .env.example .env` (or create `.env` on Windows)

2) Install dependencies:

- `npm install`

3) Run in dev:

- `npm run dev`

The server listens on `PORT` (default `8080`).

## API

- `POST /api/contact`
- `POST /api/hire-us`

## Database

The Postgres schema is in `db/schema.sql`.

## Notes

- Server validates requests using Zod.
- Honeypot is supported via `honeypot` field.
- Rate limiting is enabled on `/api/*`.
- Errors return safe messages in production.
