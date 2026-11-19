# Coy Discover — SDE Intern Assignment

> A modern, mobile-first swipe-based discovery and mutual matching experience built for the Coy SDE Intern Take-Home Assignment.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.19-gray?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-green?logo=mongodb)](https://mongoosejs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Tested%20with-Jest%20%26%20Supertest-red?logo=jest)](https://jestjs.io/)

---

## 📑 Table of Contents

1. [Overview & Core Philosophy](#overview--core-philosophy)
2. [Part A: Product Analysis & Feature Proposals](#part-a-product-analysis--feature-proposals)
3. [Key Features](#key-features)
4. [Strict Privacy Guarantee](#strict-privacy-guarantee)
5. [Architecture & Design](#architecture--design)
6. [Database Schema & Indexing](#database-schema--indexing)
7. [API Documentation](#api-documentation)
8. [Getting Started & Local Setup](#getting-started--local-setup)
9. [Running Tests](#running-tests)
10. [Interview Preparation Guide](#interview-preparation-guide)
11. [Deployment Guide](#deployment-guide)

---

## 1. Overview & Core Philosophy

This application implements the **Discover** tab take-home assignment for Coy. It provides a fluid, mobile-first card swiping experience inspired by modern consumer dating platforms, backed by a clean, robust, monolithic Node/Express backend with MongoDB persistence.

### Engineering Principles Followed
- **Simplicity over Overengineering**: No microservices, complex design patterns, or unnecessary abstractions.
- **Strict Separation of Concerns**: Clear, linear architecture (`Routes → Middleware → Controllers → Services → Mongoose Models`).
- **Minimal Dependencies**: Zero bloated animation libraries (strictly native CSS transforms, transitions, and pointer events; no Framer Motion).
- **Backend as Source of Truth**: Frontend never determines matches; matching and privacy are enforced at the database and service levels.
- **Interview-Friendly**: Clean, readable JavaScript code with clear comments that an intern can confidently explain.

---

## 2. Part A: Product Analysis & Feature Proposals

Based on the exploration of Coy's core premise (secret crushes and privacy-first matching):

### Feature 1: Verified Campus / Organization Micro-Circles
* **What it is**: An opt-in micro-community ring verified via `.edu` email or organizational domain. Users can toggle discovering candidates from their specific university or alumni group.
* **Why it is required**: Coy's biggest psychological hurdle is fear of social exposure when inviting a crush out-of-the-blue. By anchoring discovery within a verified campus circle, users gain confidence that candidates actually belong to their real-world environment. This lowers invitation friction, boosts organic user acquisition through word-of-mouth campus networks, and preserves Coy's zero-knowledge privacy until a mutual match occurs.

### Feature 2: Shared Interest Icebreakers (Zero-Pressure Match Activation)
* **What it is**: Upon a mutual match, the app presents a contextual conversation starter based on common tags selected by both users during onboarding (e.g., *"You both love late-night matcha and bouldering"*).
* **Why it is required**: After the initial excitement of *"It's a Match!"*, users often face high conversational anxiety (*"What do I say first?"*), causing many matches to sit inactive. Pre-computed mutual interest prompts eliminate the cold-start texting awkwardness, dramatically increasing match-to-message conversion rates.

---

## 3. Key Features

- **Discover Feed**: Fluid Tinder/Bumble-style card deck showing one profile at a time with layered depth.
- **Gesture-Driven Swiping**: Smooth pointer drag physics (rotation, translation) with responsive **LIKE** (green) and **NOPE** (rose) opacity stamps.
- **Tactile Desktop Controls**: Large Pass and Like buttons with keyboard accessibility (← Left Arrow to Pass, Right Arrow → to Like).
- **Mutual Matching Logic**: A match is created **only** when both individuals like each other. Unilateral likes produce no match.
- **"It's a Match!" Celebration**: An animated celebration modal showing both avatars, celebration sparks, and direct navigation options.
- **Matches Tab**: Dedicated screen showcasing confirmed mutual matches with full details, expandable profile drawers, and empty states.
- **Guaranteed Persistence**: Swipes and matches persist in MongoDB across reloads; swiped profiles **never** reappear.
- **Polished Empty States**: Engaging empty states for both an exhausted feed and an empty matches list.
- **Interactive "Reset Demo"**: Built-in one-click demo reset endpoint (`POST /reset`) in the UI header to easily replay the entire evaluation flow without touching the terminal.

---

## 4. Strict Privacy Guarantee

> **"Never reveal who has liked the current user unless a mutual match has occurred."**

This privacy requirement is enforced through **multi-layered backend defense**:

1. **Database Schema Isolation**:
   The internal flag (`hasLikedDemoUser`) on the `Profile` model is defined with `select: false`:
   ```javascript
   hasLikedDemoUser: {
     type: Boolean,
     default: false,
     select: false // Never included in Mongoose queries by default
   }
   ```
2. **Explicit Query Projection**:
   The `/feed` API explicitly projects only public fields (`_id, name, age, photo, bio, cityOrCollege, interests, createdAt`). It is structurally impossible for client requests to inspect or infer inbound likes.
3. **Internal-Only Mutual Verification**:
   The `+hasLikedDemoUser` field is only queried during the `POST /swipe` handler inside the secure server boundary to evaluate match conditions.
4. **Matches API Isolation**:
   `GET /matches` queries the `Match` collection exclusively. Unilateral likes are never stored in `Match` and can never be retrieved by the client.

---

## 5. Architecture & Design

```
coy-discover/
├── backend/
│   ├── src/
│   │   ├── controllers/    # HTTP request/response handlers (discoverController.js)
│   │   ├── middleware/     # Error handlers & demo user attachment
│   │   ├── models/         # Mongoose schemas: User, Profile, Swipe, Match
│   │   ├── routes/         # Express router definitions (discoverRoutes.js)
│   │   ├── seed/           # 32 curated mock profiles & idempotent seed script
│   │   ├── services/       # Core business logic (feed filtering, mutual match check)
│   │   ├── utils/          # MongoDB connection helper (with in-memory fallback)
│   │   ├── app.js          # Express app configuration & middleware
│   │   └── server.js       # Server entry point
│   ├── tests/              # Jest + Supertest suite (feed, swipe, matching, privacy)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── app/                # Next.js App Router (layout.js, page.js, globals.css)
│   ├── components/         # ProfileCard, SwipeControls, DiscoverTab, MatchesTab, MatchModal, Navbar, HomeTab, EmptyFeed
│   ├── lib/                # api.js client fetch wrapper
│   ├── .env.example
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
├── package.json            # Root workspace convenience scripts
└── README.md
```

---

## 6. Database Schema & Indexing

### 1. User Model
Represents the current user account (`demo_user` for this single-user take-home).
```javascript
{
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  avatar: { type: String },
  bio: { type: String }
}
```

### 2. Profile Model
Represents candidate profiles in Discover.
```javascript
{
  name: { type: String, required: true },
  age: { type: Number, required: true },
  photo: { type: String, required: true },
  bio: { type: String, required: true },
  cityOrCollege: { type: String, required: true },
  interests: [String],
  hasLikedDemoUser: { type: Boolean, default: false, select: false } // Privacy protected
}
```
*Index*: `{ createdAt: -1 }` for fast feed ordering.

### 3. Swipe Model
Records every LIKE or PASS action.
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true },
  profileId: { type: ObjectId, ref: 'Profile', required: true },
  action: { type: String, enum: ['LIKE', 'PASS'], required: true },
  createdAt: { type: Date, default: Date.now }
}
```
*Compound Unique Index*: `{ userId: 1, profileId: 1 }` prevents duplicate swipes on the database level.

### 4. Match Model
Records confirmed mutual matches.
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true },
  matchedProfileId: { type: ObjectId, ref: 'Profile', required: true },
  createdAt: { type: Date, default: Date.now }
}
```
*Compound Unique Index*: `{ userId: 1, matchedProfileId: 1 }` guarantees idempotent match storage.

---

## 7. API Documentation

Base URL: `http://localhost:5000`

### 1. `GET /feed`
Returns candidate profiles that the current user has not yet swiped on.

* **Response (200 OK)**:
```json
{
  "success": true,
  "count": 32,
  "profiles": [
    {
      "_id": "664c123...",
      "name": "Maya Lin",
      "age": 21,
      "photo": "https://images.unsplash.com/...",
      "bio": "Architecture student at Columbia...",
      "cityOrCollege": "Columbia University, NYC",
      "interests": ["Architecture", "Film Photography", "Matcha"]
    }
  ]
}
```

### 2. `POST /swipe`
Records a swipe decision and checks for mutual matching.

* **Request Body**:
```json
{
  "profileId": "664c123...",
  "action": "LIKE" // or "PASS"
}
```
* **Response — Mutual Match (200 OK)**:
```json
{
  "success": true,
  "matched": true,
  "match": {
    "id": "664c999...",
    "profile": {
      "id": "664c123...",
      "name": "Maya Lin",
      "age": 21,
      "photo": "https://images.unsplash.com/...",
      "bio": "Architecture student at Columbia...",
      "cityOrCollege": "Columbia University, NYC",
      "interests": ["Architecture", "Film Photography", "Matcha"]
    }
  }
}
```
* **Response — No Match / Pass (200 OK)**:
```json
{
  "success": true,
  "matched": false
}
```
* **Errors**:
  - `400 Bad Request`: Missing fields or invalid action.
  - `404 Not Found`: Profile does not exist.
  - `409 Conflict`: User has already swiped on this profile.

### 3. `GET /matches`
Returns all confirmed mutual matches for the user.

* **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "matches": [
    {
      "matchId": "664c999...",
      "matchedAt": "2026-11-19T14:00:00.000Z",
      "profile": {
        "_id": "664c123...",
        "name": "Maya Lin",
        "age": 21,
        "photo": "https://images.unsplash.com/...",
        "bio": "Architecture student at Columbia...",
        "cityOrCollege": "Columbia University, NYC",
        "interests": ["Architecture", "Film Photography", "Matcha"]
      }
    }
  ]
}
```

### 4. `POST /reset`
Clears swipes and matches for the demo user (resets feed to pristine state).

* **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Demo swipes and matches reset successfully."
}
```

---

## 8. Getting Started & Local Setup

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)
- *(Optional)* Local MongoDB or MongoDB Atlas URI. **Note: If no MongoDB URI is provided, the backend automatically uses an embedded in-memory MongoDB instance for zero-setup local evaluation!**

### Step 1: Clone Repository
```bash
git clone <your-repo-url>
cd coy-discover
```

### Step 2: Configure Environment Variables
Copy example files:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

### Step 3: Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### Step 4: Seed Database
Populates 32 realistic mock profiles with ~16 mutual match candidates:
```bash
npm run seed --prefix backend
# OR from root:
npm run seed
```

### Step 5: Start Development Servers
Run backend:
```bash
npm run dev --prefix backend
# Server runs on http://localhost:5000
```
Run frontend (in a separate terminal):
```bash
npm run dev --prefix frontend
# Next.js app runs on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 9. Running Tests

The backend includes a comprehensive Jest test suite using Supertest and in-memory MongoDB:

```bash
npm test --prefix backend
# OR from root:
npm test
```

### Test Coverage Highlights:
1. **Privacy & Inbound Likes**: Verifies that `hasLikedDemoUser` is never exposed in `GET /feed` or `GET /matches`.
2. **Feed Exclusion**: Verifies that swiped profiles are excluded and never reappear.
3. **Empty Feed**: Verifies correct handling when all profiles are swiped.
4. **Swipe Persistence & Idempotency**: Verifies swipes are recorded and duplicates are rejected with `409 Conflict`.
5. **Matching Logic**: Verifies that a match is created **only** for mutual likes and **never** for unilateral likes.

---

## 10. Interview Preparation Guide

When explaining this project during an interview, here are the key technical points:

1. **Why not Framer Motion?**
   * *Answer*: "The prompt asked to avoid Framer Motion and minimize dependencies. I built the card swiping using native CSS transforms (`translate3d`, `rotate`) coupled with HTML5 Pointer Events (`onPointerDown`, `onPointerMove`, `onPointerUp`). This avoids bundle bloat, runs at 60 FPS via GPU acceleration, and gave me full control over gesture math and boundary thresholds."
2. **How is privacy enforced?**
   * *Answer*: "Privacy is enforced by architecture rather than just UI filtering. At the schema level, `hasLikedDemoUser` uses Mongoose's `select: false`. In `/feed`, we explicitly project only public fields. Mutual verification happens exclusively inside `discoverService.js` on the server during a LIKE swipe. An end-user inspecting network payloads in DevTools can never see who has liked them."
3. **How are duplicate swipes prevented?**
   * *Answer*: "We enforce this at two layers: first in the application service by querying `Swipe.findOne({ userId, profileId })` and returning a `409 Conflict`, and secondly at the database layer using a compound unique index on `{ userId: 1, profileId: 1 }`."
4. **How do you handle feed pagination / scaling?**
   * *Answer*: "Currently we exclude swiped profile IDs with `{ _id: { $nin: swipedProfileIds } }`. For a massive production scale with millions of profiles, I would evolve this into a Redis Bloom Filter or an index-backed cursor pagination system with candidate pre-scoring."

---

## 11. Deployment Guide

- **Frontend (Vercel)**:
  Connect GitHub repository, select `frontend` as Root Directory, set `NEXT_PUBLIC_API_URL` to your production backend URL, and click Deploy.
- **Backend (Render / Railway)**:
  Create Web Service, set Root Directory to `backend`, Build Command `npm install`, Start Command `node src/server.js`, and set `MONGODB_URI` and `FRONTEND_URL`.
- **Database (MongoDB Atlas)**:
  Create a free M0 cluster, whitelist IP `0.0.0.0/0`, and paste connection string into `MONGODB_URI`.

---

### Author
Built with clean code and care for the **Coy SDE Intern Take-Home Assignment**.
