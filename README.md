# 🌙 ঈদ কার্ড — Virtual Eid Card Generator

A beautifully designed virtual Eid card generator built with **Next.js 16**, **Firebase Firestore**, and deployed on **Vercel**.

Create a personalized Eid card, share the link with anyone — they can view it instantly on any device, anywhere.

---

## ✨ Features

- 3 hand-crafted card templates — Moonlit Night, Golden Lantern, Islamic Geometric
- Live preview as you type
- Eid Salami request (bKash, Nagad, Rocket)
- Shareable link — works across all devices and browsers
- View counter on each card
- Download card as PNG
- Fully responsive — mobile, tablet, desktop
- Hosted on Vercel, data stored in Firebase Firestore

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS + custom CSS |
| Database | Firebase Firestore |
| Hosting | Vercel |
| Language | TypeScript |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          ← Root HTML layout + fonts + viewport
│   ├── page.tsx            ← Home page (card creator form + live preview)
│   ├── globals.css         ← All styles, animations, responsive rules
│   ├── CardCanvas.tsx      ← 3 card template renderers
│   └── card/[id]/
│       ├── page.tsx        ← Dynamic card route (async params for Next.js 15+)
│       └── CardView.tsx    ← Card view page + share + download
└── lib/
    ├── firebase.ts         ← Firebase app init (single instance, long polling)
    └── storage.ts          ← Firestore read/write helpers with timeout
```

---

## 🔧 Local Development

### Prerequisites

```bash
node --version   # v18 or higher required
npm --version    # v8 or higher
```

### 1. Clone the repository

```bash
git clone https://github.com/Md-Abdullah-Al-Afif/Virtual_Eid_Card.git
cd eid-card-generator
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Find these values in **Firebase Console → Project Settings → Your apps → SDK setup → Config**.

> ⚠️ `.env.local` is gitignored and never committed. Never share or expose these values publicly.

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment (Vercel)

This project is deployed on Vercel. Every push to the `main` branch triggers an automatic redeploy.

### Environment Variables on Vercel

Since `.env.local` is never deployed, all 6 Firebase variables must be added in the Vercel dashboard:

1. Go to [vercel.com](https://vercel.com) → Your Project → **Settings** → **Environment Variables**
2. Add each `NEXT_PUBLIC_FIREBASE_*` variable with its value
3. Make sure **Production**, **Preview**, and **Development** are all checked
4. Go to **Deployments** → latest deployment → **⋯** → **Redeploy**

> ⚠️ After adding or changing env vars, you must redeploy. Next.js bakes `NEXT_PUBLIC_*` values into the JS bundle at build time.

### Deploying updates

```bash
git add .
git commit -m "your change description"
git push
# Vercel auto-deploys in ~1 minute
```

---

## 🔥 Firebase Setup

### Firestore Security Rules

In **Firebase Console → Firestore Database → Rules**, use these rules:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cards/{cardId} {
      // Anyone can read a card (required for shared links)
      allow read: if true;

      // Anyone can create a card
      allow create: if true;

      // Only the view count field can be updated
      allow update: if request.resource.data.diff(resource.data)
                        .affectedKeys().hasOnly(['vc']);
    }
  }
}
```

---

## 🃏 How Cards Work

1. User fills out the form on the home page and clicks **Generate**
2. A card document is written to Firestore with a random 8-character ID
3. User is redirected to `/card/[id]`
4. That page reads the card from Firestore and renders it
5. The shareable link (`/card/[id]`) works on any device and any browser
6. Each view increments the `vc` (view count) field in Firestore

---

## 📄 License

MIT — free to use and modify.