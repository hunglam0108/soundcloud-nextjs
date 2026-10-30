# soundcloud-nextjs

A custom SoundCloud-style music app built with Next.js 15 (App Router), MUI and wavesurfer.js.

## Features

- Home page with top tracks slider
- Track detail page with waveform player and comments (`/track/[slug]`)
- Profile, playlist and liked tracks pages
- Bottom audio player bar
- Light/dark mode switch

## Tech stack

- Next.js 15, React 18, TypeScript
- MUI 5 + Emotion, Tailwind CSS 4
- wavesurfer.js, react-h5-audio-player, react-slick

## Getting started

Requires Node.js 18+ and a running backend API.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root:

   ```bash
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

   The backend must serve `/api/v1/tracks/...`, `/tracks/<file>` and `/images/<file>`.

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | Lint code |

## Project structure

```
src/app/
├── api/             # Route handler proxying audio files from the backend
├── components/      # Header, footer player, slider, waveform track, theme
├── like/            # Liked tracks page
├── playlist/        # Playlist page
├── profile/         # Profile page + request helper
├── track/[slug]/    # Track detail page
└── utils/           # Constants, custom hooks, global types
```
