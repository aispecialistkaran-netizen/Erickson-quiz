# Erickson Coaching International India - Professional Coaching Readiness Assessment

A production-ready, highly immersive, interactive lead-generation digital assessment web application built for **Erickson Coaching International India**.

---

## Key Features

- **High-End Interactive UX**: Custom Apple/SaaS-level visual aesthetics featuring ambient constellation parallax, dynamic journey progress line, smooth spring question transitions, and glassmorphism.
- **Strategic 12-Question Assessment**: Evaluates prospective coaches across 5 core dimensions:
  1. Purpose & Motivation (20%)
  2. Coaching Mindset (25%)
  3. People & Development Orientation (15%)
  4. Learning & Commitment Readiness (20%)
  5. Professional Intent (20%)
- **Micro-Gamification & Milestone Feedback**: Non-distracting progress feedback at questions 3, 6, and 9.
- **Score Teaser & Configurable Lead Gate**: Renders immediate score/band teaser while locking detailed analysis behind a validated lead form with `REQUIRE_PHONE` configuration toggle.
- **Personalised Results Engine**: Generates deterministic custom report copy, radial score counter, strongest signal, positive growth opportunity framing, and suggested career path (*Professional Coach*, *Portfolio Career*, *Leader-as-Coach*, *HR / People Development*, *Exploration*).
- **Shareable Result Card**: Generates a 1080x1080 social share card without exposing PII (Download, Copy Summary, LinkedIn Share).
- **Dynamic Conversion Engine**: Tailors primary CTAs based on lead intent (*Speak to a Coaching Advisor*, *Explore The Art & Science of Coaching*, *Join an Information Session*) using configurable URLs (`config/ctaLinks.ts`).
- **Protected Admin Dashboard**: Firebase Auth-secured portal featuring real-time conversion metrics, lead temperature flags (`hot`, `warm`, `nurture`), interactive filtering, searchable leads table, detailed response inspector, and CSV export.
- **Firebase Security & Analytics**: Firestore security rules preventing unauthorized lead enumeration, composite indexes, and Firebase Analytics wrapper tracking 15+ funnel events.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Animations**: Framer Motion
- **Database & Auth**: Firebase (Cloud Firestore, Authentication, App Check, Analytics)
- **Charts & Share Card**: Recharts & html2canvas

---

## Getting Started Locally

### 1. Prerequisites
- Node.js v20.15+
- npm v10+

### 2. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Ensure your Firebase credentials are populated:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAP4kg-QIqQa7iRsK5coHaydqqGoEJm7Pg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=quiz-59d18.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=quiz-59d18
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=quiz-59d18.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=238609850541
NEXT_PUBLIC_FIREBASE_APP_ID=1:238609850541:web:72b1769dfc2ca866c56624
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-YDKX587Y46
NEXT_PUBLIC_REQUIRE_PHONE=true
```

### 3. Install Dependencies & Run Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Firebase Architecture & Setup Guide

### 1. Cloud Firestore Setup
1. In the Firebase Console, navigate to **Firestore Database** and click **Create database**.
2. Select your location and start in **Production mode**.
3. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
4. Deploy compound indexes:
   ```bash
   firebase deploy --only firestore:indexes
   ```

### 2. Firebase Authentication (Admin Portal)
1. Go to **Authentication** in Firebase Console -> **Sign-in method**.
2. Enable **Email/Password**.
3. Create an authorized admin user:
   - Email: `admin@erickson.co.in`
   - Password: `[YOUR_SECURE_PASSWORD]`

### 3. Firebase Cloud Functions & CRM Integration
1. Scaffolding is located in `/functions`.
2. Install dependencies:
   ```bash
   cd functions && npm install
   ```
3. Deploy functions:
   ```bash
   firebase deploy --only functions
   ```

---

## Testing & Demo Mode

### Demo Mode URL
Developers can instantly auto-fill and test the lead gate & results experience by visiting:
```
http://localhost:3000/assessment?demo=true
```

### Run Scoring Unit Tests
```bash
node scratch/run-tests.js
```

---

## Admin Portal
Access the admin dashboard at:
```
http://localhost:3000/admin
```
Log in with your Firebase Auth admin credentials (`admin@erickson.co.in`).
