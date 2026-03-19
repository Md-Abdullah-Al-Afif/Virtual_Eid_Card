# 🌙 ঈদ কার্ড Generator — Next.js

## Quick Start (Local)

```bash
npm install
npm run dev
```
Open http://localhost:3000

---

## 🚀 Step-by-Step Vercel Deployment

### Step 1 — Check Prerequisites

Open your terminal and verify these are installed:

```bash
node --version   # Need v18 or higher
npm --version    # Need v8 or higher
git --version    # Any version
```

Download Node.js from https://nodejs.org (choose LTS version)
Download Git from https://git-scm.com/downloads

---

### Step 2 — Install & Test Locally

```bash
# Inside the eid-card-generator folder:
npm install
npm run dev
```

Open http://localhost:3000 — you should see the Eid Card Generator.
Test creating a card. Press Ctrl+C to stop.

---

### Step 3 — Create a GitHub Account & Repository

1. Go to https://github.com and sign up (free)
2. Click the "+" icon → "New repository"
3. Name it: `eid-card-generator`
4. Set to **Private**
5. Click "Create repository"

---

### Step 4 — Push Your Code to GitHub

Run these commands inside your project folder:

```bash
git init
git add .
git commit -m "Initial commit: Eid Card Generator"

# Replace YOUR_USERNAME with your GitHub username:
git remote add origin https://github.com/YOUR_USERNAME/eid-card-generator.git
git branch -M main
git push -u origin main
```

If asked for a password, use a GitHub Personal Access Token:
→ https://github.com/settings/tokens → Generate new token (classic) → check "repo" scope

---

### Step 5 — Deploy to Vercel (FREE)

**Option A — Vercel Dashboard (Easiest, no terminal needed):**

1. Go to https://vercel.com and sign up with your GitHub account
2. Click **"Add New Project"**
3. Find `eid-card-generator` in the list → Click **Import**
4. Framework is auto-detected as **Next.js** — don't change anything
5. Click **Deploy**
6. Wait ~2 minutes
7. ✅ Your site is LIVE at something like `eid-card-generator-abc.vercel.app`

**Option B — Vercel CLI:**

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

### Step 6 — Your Live URL

Cards are shared as:
`https://YOUR-APP.vercel.app/card/[cardId]`

Example: `https://eid-card-generator.vercel.app/card/ab3f9c12`

---

### Step 7 — Custom Domain (Optional, Free)

In Vercel Dashboard → Your Project → Settings → Domains
→ Add your domain like `eidcard.com` → Follow DNS instructions

---

### Step 8 — Auto-Deploy on Updates

Every time you push to GitHub main branch, Vercel auto-redeploys:

```bash
# After making changes:
git add .
git commit -m "Update design"
git push
# Vercel deploys automatically in ~1 minute
```

---

## File Structure

```
eid-card-generator/
├── src/
│   ├── app/
│   │   ├── layout.tsx       ← Root HTML layout
│   │   ├── page.tsx         ← Home page (card creator)
│   │   ├── globals.css      ← All styles + animations
│   │   ├── CardCanvas.tsx   ← The 3 beautiful card designs
│   │   └── card/[id]/
│   │       ├── page.tsx     ← Card view route
│   │       └── CardView.tsx ← Full card view + sharing
│   └── lib/
│       └── storage.ts       ← localStorage card storage
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Notes

- Cards are saved in the user's browser (localStorage)
- No database needed — works 100% on Vercel free tier
- To share across devices, the recipient needs the link (cards are read from localStorage on the creator's device via the URL — for cross-device sharing, add Firebase as described below)

## Optional: Firebase for Cross-Device Cards

If you want cards to work across different devices/browsers:
1. Create project at https://console.firebase.google.com
2. Enable Firestore Database
3. Create `.env.local` with your Firebase config
4. Update `src/lib/storage.ts` to use Firestore instead of localStorage
