# ✦ Luminary AI — Full Stack Codebase

AI-powered platform for image, animation, and video generation with subscriptions.

---

## 🗂️ Project Structure

```
luminary/
├── pages/
│   ├── index.tsx          ← Landing page (viral hero + live counter + prompt battle CTA)
│   ├── create.tsx          ← AI generation workspace
│   ├── gallery.tsx         ← Public community gallery
│   ├── pricing.tsx         ← Subscription plans with Stripe checkout
│   ├── dashboard.tsx       ← User dashboard with stats + creations
│   ├── battle.tsx          ← 🔥 Viral Prompt Battle feature
│   └── api/
│       ├── auth/           ← NextAuth + register endpoint
│       ├── generate.ts     ← AI generation (Replicate)
│       ├── gallery.ts      ← Public gallery + likes
│       ├── stripe/         ← Checkout + Webhook
│       └── user/           ← User data endpoints
├── components/
│   └── Navbar.tsx
├── lib/
│   └── prisma.ts
├── prisma/
│   └── schema.prisma       ← Database schema
├── styles/
│   └── globals.css         ← Full design system
├── .env.example            ← All env vars documented
└── package.json
```

---

## 🚀 Step-by-Step Launch Guide

### 1. Write the code to your computer

Download this folder and open in VS Code (or any editor).

```bash
cd luminary
npm install
```

---

### 2. Set up your database (FREE)

**Option A — Supabase (recommended, free tier)**
1. Go to https://supabase.com → New project
2. Go to Settings → Database → copy the **Connection String (URI)**
3. Paste into `.env.local` as `DATABASE_URL`

**Option B — Railway**
1. Go to https://railway.app → New project → Add PostgreSQL
2. Copy the `DATABASE_URL` from the Variables tab

Then run:
```bash
cp .env.example .env.local
# Fill in your DATABASE_URL, then:
npx prisma generate
npx prisma db push
```

---

### 3. Set up AI generation (Replicate)

1. Sign up at https://replicate.com
2. Go to https://replicate.com/account/api-tokens
3. Create a token → paste as `REPLICATE_API_TOKEN` in `.env.local`

---

### 4. Set up Stripe payments

1. Sign up at https://stripe.com
2. Go to Dashboard → Developers → API Keys
3. Copy **Publishable key** → `STRIPE_PUBLISHABLE_KEY`
4. Copy **Secret key** → `STRIPE_SECRET_KEY`
5. Create two subscription products in Stripe:
   - Creator: $22/month → copy Price ID → `STRIPE_CREATOR_PRICE_ID`
   - Pro: $65/month → copy Price ID → `STRIPE_PRO_PRICE_ID`
6. For webhooks locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
7. Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

---

### 5. Set up Google OAuth (optional but recommended)

1. Go to https://console.cloud.google.com
2. Create a new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
5. Copy Client ID + Secret → `.env.local`

---

### 6. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🌍 Deploy to Production (FREE)

### Best option: Vercel (recommended)

1. Push your code to GitHub:
   ```bash
   git init && git add . && git commit -m "Launch Luminary"
   git remote add origin https://github.com/YOUR_USERNAME/luminary.git
   git push -u origin main
   ```

2. Go to https://vercel.com → Import your GitHub repo
3. Add all environment variables from `.env.example` in the Vercel dashboard
4. Change `NEXTAUTH_URL` to your Vercel domain (e.g. `https://luminary.vercel.app`)
5. Click **Deploy** ✓

Your site is live in ~2 minutes!

### Other options:
- **Render**: https://render.com — good for full-stack apps
- **Railway**: https://railway.app — includes database hosting too
- **Fly.io**: https://fly.io — great performance worldwide

---

## 🔥 Viral Features Included

| Feature | Description |
|---|---|
| **Live creation counter** | Animates in real-time on homepage, creates FOMO |
| **Prompt Battle** | Two AI images compete — users vote, shareable results |
| **Public gallery** | Community showcase with likes, drives SEO & sharing |
| **Style presets** | One-click aesthetic styles for instant good results |
| **3 free generations** | No sign-up barrier — users get hooked before paying |
| **Free plan** | 30 credits/mo — word of mouth from free users |

---

## 💳 Monetization

- **Starter**: Free (30 credits) → drives signups
- **Creator**: $22/mo (500 credits + commercial license) → main revenue
- **Pro**: $65/mo (unlimited + API) → power users & agencies

With 100 Creator subscribers → **$2,200/month**
With 100 Pro subscribers → **$6,500/month**

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 + TypeScript |
| Styling | Custom CSS design system |
| Auth | NextAuth.js (Google, GitHub, Email) |
| Database | PostgreSQL + Prisma ORM |
| AI Models | Replicate API (Stable Diffusion, video models) |
| Payments | Stripe subscriptions + webhooks |
| Deployment | Vercel (free tier works) |

---

## 📞 Need Help?

The code is production-ready. For questions on any step, ask Claude for help with the specific part you're stuck on.
 
