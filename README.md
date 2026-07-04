# MIRAGEA Next

MIRAGEA Next is a mobile-first Next.js demo for an AI short-drama product. It combines a Douyin-style discovery feed, story voting, and a simplified prediction market experience.

## Features

- Discovery feed with mixed growth dramas and finished dramas.
- Story voting panel with option percentages and vote-access flow.
- Prediction market list with search, genre tags, market cards, favorites, and market detail pages.
- Market detail view with live vote trend lines, deadline countdown, buy drawer, rules, market background, comments, positions, and trading activity.
- Wallet connection demo flow for Base Sepolia.
- Static export deployment through Vercel.

## Project Structure

- `app/` - Next.js app routes, layout, API demo endpoints, and global styles.
- `components/` - Main app views: discovery feed, theater, prediction market, messages, profile, and shell.
- `lib/` - Demo data and i18n dictionaries.
- `docs/` - Product, market, wallet, and ecosystem notes.
- `public/assets/posters/` - Poster assets used by the mobile demo.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm run build
```

During active local development, stop `npm run dev` before running `npm run build`, because Next.js can mix dev and production `.next` artifacts if both are used at the same time.

## Deployment

The app is configured for static export in `next.config.mjs` and is deployed on Vercel.

Production:

https://miragea-next.vercel.app
