# soundcloud-nextjs

A SoundCloud-style music app built with Next.js 15 (App Router), MUI, Redux Toolkit, NextAuth and wavesurfer.js.

## Features

- Sign in with username/password or GitHub (NextAuth)
- Home page with track sliders by category
- Track detail page with waveform player and comments (`/track/[slug]`)
- Bottom audio player bar with a playlist drawer (Redux)
- Profile page listing a user's tracks (`/profile/[slug]`)
- Upload tracks with progress bar (`/upload`)
- Playlists: create and add tracks (`/playlist`)
- Liked tracks (`/like`) and search (`/search`)
- Light/dark mode switch

## Tech stack

- Next.js 15, React 18, TypeScript
- MUI 5 + Emotion, Tailwind CSS 4
- Redux Toolkit, NextAuth 4, react-hook-form, axios
- wavesurfer.js, react-h5-audio-player, react-slick, react-dropzone

## Getting started

Requires Node.js 18+ and a running backend API.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` in the project root:

   ```bash
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   NEXTAUTH_URL=http://localhost:3000
   NO_SECRET=<random string used as the NextAuth secret>
   GITHUB_ID=<GitHub OAuth app client id>
   GITHUB_SECRET=<GitHub OAuth app client secret>
   ```

   The backend must serve `/api/v1/...` (auth, tracks, comments, likes, playlists, files), `/tracks/<file>` and `/images/<file>`.
   For GitHub login, set the OAuth callback URL to `http://localhost:3000/api/auth/callback/github`.

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
src/
├── app/
│   ├── (guest)/auth/signin/   # Sign-in page
│   ├── (user)/                # Pages behind the main layout
│   │   ├── like/              # Liked tracks
│   │   ├── playlist/          # Playlists
│   │   ├── profile/[slug]/    # User profile
│   │   ├── search/            # Search
│   │   ├── track/[slug]/      # Track detail
│   │   └── upload/            # Upload tracks
│   ├── api/                   # Request helpers, audio proxy, NextAuth route
│   ├── components/            # Header, footer player, slider, waveform, theme, popup
│   ├── lib/                   # NextAuth session provider
│   └── utils/                 # Constants, helpers, custom hooks, types
└── redux/                     # Store and slices (player playlist, popup)
```
