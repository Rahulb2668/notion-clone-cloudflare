# notion-clone-cloudflare

Personal AI Notion Space with cloudflare worker ai backend

## Overview

A modern note-taking application built with Next.js and Cloudflare Workers, featuring real-time collaboration and AI capabilities.

## Features

- Real-time collaboration powered by Liveblocks
- Authentication via Clerk
- Data persistence using Firebase
- AI text processing with Cloudflare Workers AI
- Markdown support
- Real-time cursors and presence

## Tech Stack

- Frontend: Next.js
- Backend: Cloudflare Workers
- Database: Firebase
- Authentication: Clerk
- Real-time: Liveblocks
- AI: Cloudflare Workers AI

## Getting Started

1. Clone the repository
2. Set up environment variables
3. Install dependencies with `npm install`
4. Run development server with `npm run dev`

## Configuration

Configure your environment variables in `.env`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_LIVEBLOCKS_KEY=
FIREBASE_CONFIG=
CLOUDFLARE_API_TOKEN=
```
