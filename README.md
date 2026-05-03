# 📡 HotConnect – Hotspot Payment Portal

A reactive WiFi captive portal with M-Pesa Daraja payment integration built with Node.js, Express, and MongoDB.

---

## 🗂 Project Structure

```
hotspot-portal/
├── config/
│   └── mpesa.js          # M-Pesa Daraja API integration
├── models/
│   ├── User.js           # User model
│   ├── Transaction.js    # Transaction model
│   └── Package.js        # WiFi package model
├── routes/
│   ├── auth.js           # Admin authentication
│   ├── payment.js        # M-Pesa payment routes
│   ├── packages.js       # Package management
│   └── admin.js          # Admin dashboard API
├── public/
│   ├── index.html        # Captive portal landing page
│   ├── success.html      # Post-payment success page
│   └── admin.html        # Admin dashboard
├── server.js             # Main entry point
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/hotspot-portal.git
cd hotspot-portal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your credentials
nano .env
```

### 4. Start MongoDB (if running locally)
```bash
sudo systemctl start mongod
```

### 5. Start the server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 6. Seed packages & create admin
```bash
# Seed default WiFi packages
curl -X POST http://localhost:3000/api/packages/seed

# Create admin account
curl -X POST http://localhost:3000/api/auth/setup
```

---

## 🐳 Docker Setup

### Run with Docker Compose (easiest)
```bash
# Copy and fill environment variables
cp .env.example .env

# Build and run everything (app + MongoDB)
docker-compose up --build

# Run in background
docker-compose up -d --build
```

### Export Docker image (to move to Windows)
```bash
docker build -t hotspot-portal .
docker save -o hotspot-portal.tar hotspot-portal
```

### Import on Windows
```powershell
docker load -i hotspot-portal.tar
docker run -p 3000:3000 --env-file .env hotspot-portal
```

---

## 📱 M-Pesa Daraja Setup

### Step 1: Register on Daraja
1. Go to https://developer.safaricom.co.ke
2. Sign up for a free account
3. Go to **My Apps** → **Create New App**
4. Select: Lipa Na M-Pesa Sandbox
5. Copy your **Consumer Key** and **Consumer Secret**

### Step 2: Get Sandbox Credentials
- **Shortcode**: 174379 (sandbox default)
- **Passkey**: Get from the Daraja portal under test credentials
- **Test Phone**: Use 254708374149 for sandbox testing

### Step 3: Set Callback URL
Your callback URL must be publicly accessible. Use your Render/Railway URL:
```
MPESA_CALLBACK_URL=https://your-app.onrender.com/api/payment/mpesa/callback
```

For local testing, use ngrok:
```bash
ngrok http 3000
# Copy the https URL and set as MPESA_CALLBACK_URL
```

### Step 4: Go Live
1. Apply for production access on Daraja portal
2. Update .env:
   ```
   MPESA_ENV=production
   MPESA_SHORTCODE=your_real_shortcode
   ```

---

## ☁️ Deploy to Render (Free Hosting)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/hotspot-portal.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to https://render.com and sign up
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: hotspot-portal
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add environment variables (from your .env file)
6. For MongoDB, use **MongoDB Atlas** free tier (https://cloud.mongodb.com)
7. Click **Deploy**

### Step 3: Free MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com
2. Create free M0 cluster
3. Create database user
4. Get connection string
5. Set as MONGO_URI in Render environment variables

---

## 🔗 Pages

| Page | URL | Description |
|------|-----|-------------|
| Portal | `/` | Main captive portal |
| Success | `/success` | Post-payment page |
| Admin | `/admin` | Admin dashboard |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/packages` | Get all packages |
| POST | `/api/packages/seed` | Seed default packages |
| POST | `/api/auth/setup` | Create admin account |
| POST | `/api/auth/login` | Admin login |
| POST | `/api/payment/initiate` | Start M-Pesa payment |
| POST | `/api/payment/mpesa/callback` | M-Pesa callback |
| GET | `/api/payment/status/:id` | Check payment status |
| GET | `/api/admin/stats` | Admin dashboard stats |

---

## 📞 Support

For issues with M-Pesa integration, refer to the [Safaricom Daraja Documentation](https://developer.safaricom.co.ke/Documentation).
