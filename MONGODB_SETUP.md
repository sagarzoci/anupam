# MongoDB Atlas Setup (Free Cloud Database)

You don't need to install MongoDB. Use **MongoDB Atlas** — it's free and takes 5 minutes.

---

## Step 1 — Create a free account

Go to → **https://www.mongodb.com/cloud/atlas/register**

Sign up with Google or email. No credit card required.

---

## Step 2 — Create a free cluster

1. After signing in, click **"Build a Database"**
2. Choose **"M0 Free"** (the free tier)
3. Select any cloud provider (AWS is fine) and region closest to you
4. Click **"Create"**

---

## Step 3 — Create a database user

1. You will see **"Security Quickstart"**
2. Under **"How would you like to authenticate?"** → choose **"Username and Password"**
3. Enter a username (e.g. `admin`) and a strong password (e.g. `MySchool2081!`)
4. Click **"Create User"**
5. ⚠️ **Copy this password — you will need it in Step 5**

---

## Step 4 — Allow all IP addresses

1. Under **"Where would you like to connect from?"**
2. Click **"Add My Current IP Address"** — OR —
3. Click **"Add Entry"** and type `0.0.0.0/0` to allow all IPs (easier for development)
4. Click **"Finish and Close"**

---

## Step 5 — Get your connection string

1. On the **Database** page, click **"Connect"** on your cluster
2. Choose **"Drivers"**
3. Select **Driver: Node.js**, **Version: 5.5 or later**
4. Copy the connection string. It looks like this:

```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

5. Replace `<password>` with your actual password from Step 3
6. Add your database name (`anupam-vidya-sadan`) before the `?`:

```
mongodb+srv://admin:MySchool2081!@cluster0.xxxxx.mongodb.net/anupam-vidya-sadan?retryWrites=true&w=majority
```

---

## Step 6 — Update .env.local

Open `.env.local` in your project and replace:

```env
# DELETE this line:
MONGODB_URI=mongodb://localhost:27017/anupam-vidya-sadan

# ADD this line (with your real URI):
MONGODB_URI=mongodb+srv://admin:MySchool2081!@cluster0.xxxxx.mongodb.net/anupam-vidya-sadan?retryWrites=true&w=majority
```

---

## Step 7 — Restart the dev server

Stop the server with `Ctrl+C`, then run again:

```bash
npm run dev
```

Open **http://localhost:3000** — it will auto-create all the database collections on first visit.

---

## ✅ Done!

Your database is now hosted on MongoDB Atlas. Data persists in the cloud — no local MongoDB needed.

---

## Common errors

| Error | Fix |
|---|---|
| `bad auth` | Wrong password in the URI — re-check Step 5 |
| `ECONNREFUSED 127.0.0.1:27017` | Still using localhost URI — make sure you replaced it in `.env.local` |
| `IP not whitelisted` | Go to Atlas → Network Access → Add `0.0.0.0/0` |
| `MongoParseError` | Invalid URI format — ensure `<password>` is replaced and no `<>` remain |
