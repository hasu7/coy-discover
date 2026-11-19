# Coy — Discover Tab

A mobile-first, swipe-based **Discover** tab built as a standalone Next.js + SQLite app for the Coy SDE Intern Assignment.

## Features
- **Mobile-first UI** matching Coy's design language, with a blank **Home** tab and functional **Discover** tab.
- **32 seeded profiles** (auto-seeded into SQLite on first run), with 10 profiles pre-configured to have liked the current user for demoing matches.
- **Swipe experience:** Drag gestures on mobile, Like/Pass buttons on desktop, smooth Framer Motion animations, and an empty state when the feed is exhausted.
- **Privacy-first matching:** The `liked_me` flag is strictly server-side and never returned by `/api/feed` or `/api/swipe` on a pass/one-sided like. Mutual interest is only revealed when both users like each other.
- **Full persistence:** Swipes and matches persist across page reloads via SQLite (`better-sqlite3`), with database-level uniqueness preventing duplicate swipes.

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend:** Next.js API Routes (`GET /api/feed`, `POST /api/swipe`, `GET /api/matches`)
- **Database:** SQLite (`better-sqlite3`)

## Getting Started

```bash
npm install
npm run dev
