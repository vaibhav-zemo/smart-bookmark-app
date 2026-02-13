# Smart Bookmark App

A modern, real-time bookmark manager built with **Next.js 15 (App Router)**, **Supabase**, and **Tailwind CSS**.

This app allows users to sign up via Google, add bookmarks with titles and URLs, and see updates instantly across devices using Supabase Realtime. It features a responsive design and optimistic UI updates for a snappy experience.

## Live Demo (Vercel)
https://smart-bookmark-app-flame.vercel.app

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Icons**: Lucide React
- **Validation**: Zod
- **Language**: TypeScript

## Features

- 🔐 **Google OAuth Login**: Secure authentication flow with no passwords.
- ⚡ **Real-time Sync**: Bookmarks update instantly in other tabs/windows without refreshing.
- 🛡️ **Row Level Security (RLS)**: Users can only see and manage their own data.
- 🚀 **Server Actions**: Robust data mutations with backend validation.
- 📱 **Responsive Design**: Works great on mobile and desktop.

## Getting Started

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd bookmark
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## Challenges & Solutions

Building this app was a great learning experience. Here are some of the genuine problems I ran into and how I solved them:

### 1. Google OAuth Redirect Mismatch
**Problem:** After setting up Supabase Auth, I kept getting a `400: redirect_uri_mismatch` error from Google when trying to log in.
**Solution:** I realized that while I had added the redirect URL to Supabase, I hadn't added the *exact* Supabase callback URL (`https://<project-ref>.supabase.co/auth/v1/callback`) to the **Google Cloud Console**. Once I added that specific URL to the "Authorized redirect URIs" list in Google Console, it worked perfectly.

### 2. Duplicate Keys in Realtime List
**Problem:** I implemented optimistic updates (adding the bookmark locally immediately) AND subscribed to Supabase Realtime 'INSERT' events. This caused a race condition where the bookmark would be added twice—once by my local state update and once when the server confirmed it—resulting in a "Duplicate keys in React" warning and a flickering list.
**Solution:** I added a check inside the `useEffect` subscription in `BookmarkList`. Before adding a new item from a Realtime event, I check if an item with that ID already exists in the state. If it does, I ignore the event.

### 3. Middleware Infinite Redirects
**Problem:** Initially, my middleware was trying to protect every route, including the static files and the login page itself, causing the app to crash with "Too many redirects."
**Solution:** I updated the `matcher` config in `middleware.ts` to explicitly exclude `_next/static`, images, and the favicon. I also added logic to only redirect unauthenticated users if they aren't already on the `/login` page.

### 4. Input Visibility
**Problem:** The default styling for the input placeholders was too light against the white/gray background, making it hard to see what to type.
**Solution:** I customized the Tailwind classes for the inputs to specifically darken the placeholder text (`placeholder:text-gray-400`), making the form much more user-friendly.

## License
MIT
