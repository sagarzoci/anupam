# ImageKit Setup Guide

All uploaded images (hero slides, news, gallery, popup, principal) are stored on **ImageKit CDN**.
Only the image URL is saved in MongoDB.

---

## Step 1 — Create a free ImageKit account

Go to → https://imagekit.io/registration

Free plan includes:
- 20 GB storage
- 20 GB bandwidth/month
- Unlimited image transformations

---

## Step 2 — Get your API keys

1. Log in to your ImageKit dashboard
2. Go to **Developer Options** → **API Keys**
3. Copy:
   - `Public Key`   (starts with `public_...`)
   - `Private Key`  (starts with `private_...`)
   - `URL Endpoint` (looks like `https://ik.imagekit.io/your_id`)

---

## Step 3 — Add keys to `.env.local`

Open `.env.local` and replace the placeholder values:

```env
IMAGEKIT_PUBLIC_KEY=public_XXXXXXXXXXXXXXXXXX
IMAGEKIT_PRIVATE_KEY=private_XXXXXXXXXXXXXXXXXX
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

---

## Step 4 — Restart the dev server

```bash
npm run dev
```

---

## How uploads work

```
Admin uploads image in dashboard
        ↓
POST /api/upload  (server-side, requires admin JWT cookie)
        ↓
ImageKit SDK uploads the file to ImageKit CDN
        ↓
ImageKit returns a full CDN URL:
  https://ik.imagekit.io/your_id/anupam-vidya-sadan/filename.jpg
        ↓
That URL is stored in MongoDB (not the file itself)
        ↓
Frontend renders the image using next/image with the ImageKit URL
```

---

## Folder structure in ImageKit

All school website images are stored under:
```
/anupam-vidya-sadan/
  ├── hero-slide-1234567.jpg
  ├── news-image-7654321.png
  └── gallery-photo-9876543.webp
```

You can view and manage all uploaded files in the **ImageKit Media Library**.

---

## Production (Vercel / any host)

Add the same environment variables in your deployment platform:

| Variable | Value |
|---|---|
| `IMAGEKIT_PUBLIC_KEY` | Your ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | Your ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | `https://ik.imagekit.io/your_id` |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | Same as above |

---

## Deleting images from ImageKit

Currently, deleting a gallery item or news post from the dashboard **removes the URL from MongoDB** but does **not** delete the file from ImageKit.

To manually delete files:
1. Go to ImageKit → Media Library
2. Find the file
3. Right-click → Delete

To add automatic deletion in the future, use the ImageKit `deleteFile(fileId)` method in your delete API routes (the `fileId` returned from upload is what you need).
