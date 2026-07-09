# MIRAGEA Next

MIRAGEA Next is a mobile-first Next.js demo for an AI short-drama product. It combines a Douyin-style discovery feed, story voting, and a market experience for story prediction, HTX payment, and drama IP coins.

## Features

- Discovery feed with mixed growth dramas and finished dramas.
- Story voting panel with option percentages and vote-access flow.
- Market list with search, genre tags, prediction cards, IP coin issuance, favorites, and market detail pages.
- Market detail view with live vote trend lines, deadline countdown, buy drawer, HTX / U / fiat / IP coin payment options, rules, market background, comments, positions, and trading activity.
- Drama detail IP coin view with price trend, trading data, holders, issuance rules, and B.AI valuation signals.
- Creator tool entry under Profile / My.
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

## B.AI / GLM Provider

The product calls `/api/bai/valuation` for B.AI valuation and branch generation. For the demo, this can run on GLM first and later swap to a real B.AI provider without changing the UI.

```bash
cp .env.example .env.local
```

Set:

```bash
BAI_PROVIDER=glm
GLM_API_KEY=your_glm_key
GLM_MODEL=glm-4-flash
```

Without a key, the API falls back to local mock data so the demo still works.

## Checks

```bash
npm run build
```

During active local development, stop `npm run dev` before running `npm run build`, because Next.js can mix dev and production `.next` artifacts if both are used at the same time.

## Deployment

The app is configured for static export in `next.config.mjs` and is deployed on Vercel.

Production:

https://miragea-next.vercel.app
