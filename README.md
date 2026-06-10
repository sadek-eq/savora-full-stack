# Savora — Cook Smarter, Savor More

Savora is an AI-powered recipe card SaaS platform designed for the modern cook. Extract recipes from any video, photo, or dish name, and cook them with a voice-guided assistant that watches your progress in real-time.

## Features
- **AI Recipe Extraction:** Extract full recipes from YouTube/TikTok/Instagram URLs or photos.
- **AI Chef Chat:** A friendly culinary assistant powered by Gemini 2.0 Flash.
- **Smart Cooking Mode:** Voice-guided instructions with built-in timers.
- **Live Camera AI:** Get real-time feedback on your cooking via your smartphone camera.
- **Pinterest-style Discover:** Browse a beautiful feed of community-created recipes.
- **Pantry Suggestions:** Tell the AI what you have, and it will suggest what to cook.
- **Cross-Platform:** Shared backend serving both Web (Next.js) and Mobile (Expo).

## Tech Stack
- **Frontend:** Next.js 14 (Web), Expo React Native (Mobile)
- **Backend:** Next.js API Routes (Serverless)
- **Database:** Neon PostgreSQL with Drizzle ORM
- **Auth & Billing:** Clerk
- **AI:** Google Gemini 2.0 Flash
- **Images:** Vercel Blob & Unsplash API

## Setup Instructions

### Prerequisites
- Node.js 18+
- Neon.tech account
- Clerk.com account
- Google AI Studio (Gemini) API Key
- Unsplash API Access Key

### 1. Clone & Install
```bash
git clone https://github.com/your-username/savora.git
cd savora
npm install
```

### 2. Environment Variables
Copy `web/.env.local.example` to `web/.env.local` and fill in your keys:
- `DATABASE_URL`: Your Neon connection string.
- `GEMINI_API_KEY`: Your Google AI API key.
- `CLERK_SECRET_KEY` & `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: From Clerk dashboard.
- `UNSPLASH_ACCESS_KEY`: From Unsplash developer dashboard.

### 3. Database Setup
```bash
cd web
npx drizzle-kit push
npm run seed
```

### 4. Start Development
- **Web:** `npm run web:dev` (Runs on localhost:3000)
- **Mobile:** `npm run mobile:start` (Open with Expo Go)

## Deployment
- **Web:** Deploy to Vercel. Connect your Neon and Clerk accounts.
- **Mobile:** Build with EAS: `cd mobile && eas build`.

## License
MIT
