# Deployment Guide — Anupam Vidya Sadan

This is a **unified Next.js app** (frontend + backend API routes in one project).
You do **not** need a separate backend server. Everything runs inside Next.js.

---

## 📦 What you are deploying

```
anupam-vidya-sadan/        ← single Next.js project
├── app/                   ← pages + API routes (both frontend and backend)
│   ├── page.tsx           ← homepage
│   ├── about/             ← about page
│   ├── gallery/           ← gallery page
│   ├── notices/           ← news/notices pages
│   ├── contact/           ← contact form page
│   ├── admin/             ← admin panel pages (protected by JWT middleware)
│   └── api/               ← ALL backend endpoints live here
│       ├── auth/          ← login / logout
│       ├── contact/       ← contact form submission + admin message management
│       ├── admin/         ← admin credentials change
│       ├── content/       ← CRUD for hero, news, gallery, settings, etc.
│       └── upload/        ← ImageKit file upload
├── lib/                   ← shared utilities (DB, auth, storage, email)
├── components/            ← React components
└── public/                ← static assets
```

---

## 🚀 Option A — Deploy on Vercel (Recommended)

Vercel is the official deployment platform for Next.js. Easiest setup.

### Step 1 — Push to GitHub

```bash
cd anupam-vidya-sadan

# Initialise git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/anupam-vidya-sadan.git
git push -u origin main
```

### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Click **Import Git Repository** → select your GitHub repo
3. Vercel auto-detects Next.js — no changes needed to build settings
4. Click **Deploy** (it will fail the first time because env vars are missing — that is expected)

### Step 3 — Add Environment Variables

In your Vercel project → **Settings → Environment Variables**, add all variables from `.env.local`:

| Variable | Value |
|---|---|
| `ADMIN_EMAIL` | your admin email |
| `ADMIN_PASSWORD` | your admin password |
| `JWT_SECRET` | long random string (use: `openssl rand -base64 32`) |
| `MONGODB_URI` | your Atlas connection string |
| `IMAGEKIT_PUBLIC_KEY` | from imagekit.io |
| `IMAGEKIT_PRIVATE_KEY` | from imagekit.io |
| `IMAGEKIT_URL_ENDPOINT` | from imagekit.io |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | same as above |
| `RESEND_API_KEY` | from resend.com |
| `CONTACT_RECEIVER_EMAIL` | school email that gets contact form emails |
| `RESEND_FROM_EMAIL` | `School Name <noreply@yourdomain.com>` |
| `NEXT_PUBLIC_APP_URL` | `https://your-vercel-domain.vercel.app` |

### Step 4 — Redeploy

After adding env vars: **Deployments → Redeploy** (or push a new commit).

### Step 5 — Custom Domain (optional)

Vercel → **Settings → Domains** → add your domain (e.g. `anupamvidyasadan.edu.np`).
Follow Vercel's DNS instructions.

---

## 🚀 Option B — Deploy on Render

Render supports Node.js web services. Use this if you prefer Render.

### Step 1 — Push to GitHub

Same as Vercel Step 1 above.

### Step 2 — Create a Web Service on Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Configure:

| Setting | Value |
|---|---|
| **Name** | `anupam-vidya-sadan` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Node version** | `20` |

### Step 3 — Add Environment Variables

In Render → **Environment** tab, add all the same variables listed above.

> ⚠️ Set `NEXT_PUBLIC_APP_URL` to your Render URL: `https://anupam-vidya-sadan.onrender.com`

### Step 4 — Deploy

Click **Create Web Service**. Render will build and deploy automatically.

---

## 🔧 Local Development

```bash
cd anupam-vidya-sadan

# Install all packages (including new ones: resend)
npm install

# Create your env file
cp .env.local .env.local.backup   # if you have one already
# Edit .env.local and fill in all values

# Start dev server
npm run dev

# Open browser
open http://localhost:3000
open http://localhost:3000/admin
```

---

## 📧 Setting Up Resend (Email)

1. Go to [resend.com](https://resend.com) → Sign up free
2. **API Keys** → Create a new API key → copy it → paste as `RESEND_API_KEY`
3. **Domains** → Add your school domain → follow DNS verification steps
4. Set `RESEND_FROM_EMAIL` to: `Anupam Vidya Sadan <noreply@yourdomain.com>`

> **For local testing without domain verification:**
> Set `RESEND_FROM_EMAIL=onboarding@resend.dev`
> And set `CONTACT_RECEIVER_EMAIL` to your own email address.
> Resend's sandbox only sends to the verified owner email.

---

## 🧪 Testing the Contact Form Locally

1. Start the dev server: `npm run dev`
2. Open `http://localhost:3000/contact`
3. Fill in all fields and submit
4. Check:
   - Your terminal logs (should show no errors)
   - Your `CONTACT_RECEIVER_EMAIL` inbox (the admin notification)
   - The sender's inbox (the auto-reply)
   - Admin dashboard → Contact Messages section

---

## 🔐 Updating Admin Credentials After Deployment

1. Log in to `/admin`
2. Go to **Admin Credentials** in the sidebar
3. Enter new email + new password + confirm password
4. Click **Update Credentials & Log Out**
5. Log in with the new credentials

Credentials are stored securely in MongoDB (hashed with scrypt). They override the `.env.local` values at runtime.

---

## 🗄️ MongoDB Atlas — Quick Setup

See `MONGODB_SETUP.md` for the full guide. Short version:

1. [mongodb.com/cloud/atlas/register](https://mongodb.com/cloud/atlas/register) — free account
2. Create a free M0 cluster
3. Database Access → Create user (username + password)
4. Network Access → Add `0.0.0.0/0` (allow all IPs)
5. Connect → Drivers → copy the URI
6. Replace `<password>` with your actual password
7. Paste as `MONGODB_URI` in env vars

---

## 🧹 What packages did this project add?

Run after pulling the latest version:

```bash
npm install
```

New packages added in this version:
- `resend` — email delivery for the contact form

---

## 📂 Folder structure for future updates

| Folder | What to edit when... |
|---|---|
| `app/` | Adding new pages or API routes |
| `app/api/contact/` | Changing email templates or form validation |
| `components/` | Updating UI components |
| `lib/models/` | Adding new database collections |
| `lib/storage.ts` | Adding new database functions |
| `lib/auth.ts` | Changing authentication logic |
| `.env.local` | Adding new environment variables |

---

## ✅ Production Checklist

Before going live:

- [ ] `MONGODB_URI` points to a real Atlas cluster (not localhost)
- [ ] `JWT_SECRET` is a long random string (not the default)
- [ ] `ADMIN_PASSWORD` has been changed in the dashboard
- [ ] `RESEND_API_KEY` is set and domain is verified
- [ ] `IMAGEKIT_*` keys are set
- [ ] `NEXT_PUBLIC_APP_URL` matches your production domain
- [ ] `.env.local` is in `.gitignore` (it should be by default)
- [ ] MongoDB Network Access allows connections from your host (or `0.0.0.0/0`)
