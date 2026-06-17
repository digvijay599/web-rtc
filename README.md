<div align="center">

<img src="https://user-images.githubusercontent.com/placeholder/banner.png" alt="CodeVoice Banner" width="100%" />

# 🎙️ CodeVoice — Real-Time Audio Rooms

### A full-stack Clubhouse-inspired voice chat platform built with WebRTC, Socket.IO, React & Node.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-17.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socket.io&logoColor=white)](https://socket.io)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-1.9.x-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [WebRTC Signal Flow](#-webrtc-signal-flow)
- [Socket Events Reference](#-socket-events-reference)
- [REST API Reference](#-rest-api-reference)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the App](#-running-the-app)
- [Known Issues & Improvements](#-known-issues--improvements)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🧠 Overview

**CodeVoice** is a real-time voice chat application inspired by Clubhouse. It enables users to create and join audio rooms, speak in real-time with multiple participants, and manage mute/unmute states — all powered by **WebRTC peer-to-peer audio streaming** with a **Socket.IO signaling server**.

This project demonstrates:
- **WebRTC mesh network** for real-time peer-to-peer audio
- **Socket.IO** as a signaling channel for ICE candidates & SDP negotiation
- **Phone-based OTP authentication** via Twilio SMS
- **JWT access + refresh token** auth flow with HTTP-only cookies
- **Redux Toolkit** global state management on the frontend
- **Protected route architecture** with three guard levels (Guest / SemiProtected / Protected)

---

## 🔗 Live Demo

> 🚧 Coming soon — deployment in progress

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🎤 Real-Time Audio Rooms | Create or join voice rooms with live P2P audio via WebRTC |
| 📱 Phone OTP Auth | Passwordless login via Twilio SMS OTP (with HMAC hash verification) |
| 🔐 JWT Auth | Access token (1h) + Refresh token (1y) stored in HTTP-only cookies |
| 🔇 Mute / Unmute | Per-user mute toggling synced across all room participants in real-time |
| 🏠 Room Management | Create rooms with topic & type; browse all open rooms |
| 👤 Profile Activation | Two-step onboarding: OTP verify → profile setup (name + avatar) |
| 🛡️ Protected Routes | Three-tier route guard: GuestRoute, SemiProtectedRoute, ProtectedRoute |
| 🔄 Token Refresh | Silent access token refresh using refresh token on app load |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                      │
│                                                            │
│  ┌──────────┐   ┌──────────────┐   ┌──────────────────┐   │
│  │ Redux    │   │  useWebRTC   │   │  Socket.IO       │   │
│  │ Store    │   │  Hook        │   │  Client          │   │
│  │ (auth)   │   │  (WebRTC     │   │  (Signaling)     │   │
│  └──────────┘   │   logic)     │   └────────┬─────────┘   │
│                 └──────────────┘            │             │
└──────────────────────────────────────────── │ ────────────┘
                                              │ WebSocket
┌─────────────────────────────────────────────│─────────────┐
│                   SERVER (Node.js)          │             │
│                                             ▼             │
│  ┌──────────────┐   ┌──────────────────────────────────┐  │
│  │  Express     │   │  Socket.IO Server                │  │
│  │  REST API    │   │  (Signaling: ICE, SDP, Mute)     │  │
│  │              │   │                                  │  │
│  │  /api/auth   │   │  Rooms: join → add-peer →        │  │
│  │  /api/rooms  │   │  relay-ice → relay-sdp →         │  │
│  │  /api/...    │   │  session-description              │  │
│  └──────┬───────┘   └────────────────┬─────────────────┘  │
│         │                            │                    │
│  ┌──────▼────────────────────────────▼──────────────────┐  │
│  │                    MongoDB (Mongoose)                 │  │
│  │         Users  |  Rooms  |  RefreshTokens            │  │
│  └───────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
                          │
              ┌───────────▼────────────┐
              │   Twilio SMS API       │
              │   (OTP Delivery)       │
              └────────────────────────┘

P2P Audio Stream (WebRTC):
  Peer A ◄──── STUN (freeice) ────► Peer B
         ◄──── ICE Candidate ──────►
         ◄──── SDP Offer/Answer ───►
         ◄══════ Audio Stream ══════►  (Direct P2P)
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18.x | Runtime |
| Express.js | 4.x | HTTP server & REST API |
| Socket.IO | 4.6.x | WebRTC signaling channel |
| Mongoose | 6.x | MongoDB ODM |
| MongoDB | 6.x | Database |
| JSON Web Token | 9.x | Access & Refresh token auth |
| Twilio | 3.x | Phone OTP SMS delivery |
| bcrypt / crypto | built-in | OTP hashing (HMAC) |
| cookie-parser | 1.4.x | HTTP-only cookie management |
| dotenv | 16.x | Environment config |
| jimp | 0.22.x | Avatar image processing |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 17.x | UI framework |
| Redux Toolkit | 1.9.x | Global state management |
| React Router DOM | 5.x | Client-side routing |
| Socket.IO Client | 4.4.x | WebSocket connection |
| freeice | 2.x | Free STUN server list for ICE |
| Axios | 0.21.x | HTTP client for REST API |
| Create React App | 5.x | Build tooling |

---

## 📁 Project Structure

```
web-rtc/
├── backend/                        # Node.js + Express + Socket.IO server
│   ├── controllers/
│   │   ├── auth-controller.js      # OTP send/verify, JWT refresh, logout
│   │   ├── activate-controller.js  # User profile activation (name, avatar)
│   │   └── rooms-controller.js     # Create, list, show rooms
│   ├── middlewares/
│   │   └── auth-middleware.js      # JWT access token verification
│   ├── models/
│   │   ├── User-model.js           # User schema (phone, name, avatar, activated)
│   │   ├── room-model.js           # Room schema (topic, roomType, ownerId, speakers)
│   │   └── refresh-model.js        # RefreshToken schema (token, userId)
│   ├── services/
│   │   ├── otp-services.js         # OTP generation, Twilio SMS, HMAC verify
│   │   ├── hash-service.js         # HMAC-SHA256 hashing utility
│   │   ├── token-service.js        # JWT sign, verify, store/refresh/delete
│   │   ├── user-service.js         # Find/create user in MongoDB
│   │   └── room-service.js         # Room CRUD logic
│   ├── dtos/
│   │   ├── user-dto.js             # User data transfer object (sanitizes output)
│   │   └── room-dto.js             # Room data transfer object
│   ├── storage/                    # Uploaded avatar images
│   ├── actions.js                  # Shared Socket.IO event name constants
│   ├── db.js                       # Mongoose connection setup
│   ├── routes.js                   # All REST API route definitions
│   ├── server.js                   # App entry: Express + Socket.IO + WebRTC signaling
│   ├── .env.example                # Environment variable template
│   └── package.json
│
└── frontend/                       # React + Redux SPA
    └── src/
        ├── components/
        │   ├── AddRoomModal/        # Modal to create a new audio room
        │   ├── RoomCard/            # Single room display card
        │   └── shared/
        │       ├── Navigation/      # Top nav bar
        │       └── Loader/          # Full-screen loading spinner
        ├── hooks/
        │   ├── useWebRTC.js         # 🌟 Core hook: all WebRTC logic (peers, ICE, SDP, mute)
        │   ├── useStateWithCallback.js # useState with post-setState callback
        │   └── useLoadingWithRefresh.js # On-mount token refresh + loading state
        ├── pages/
        │   ├── Home/                # Landing page (unauthenticated)
        │   ├── Authenticate/        # Phone number + OTP flow
        │   ├── Activate/            # Profile setup (name, avatar upload)
        │   ├── Rooms/               # Browse & create rooms
        │   ├── Room/                # Live audio room view
        │   └── Steps/               # Onboarding step indicator
        ├── socket/
        │   └── index.js             # Socket.IO client factory
        ├── store/                   # Redux store & auth slice
        ├── http/                    # Axios instance & API helpers
        ├── actions.js               # Shared Socket.IO event name constants (mirrors backend)
        └── App.js                   # Router + three-tier route guard setup
```

---

## 📡 WebRTC Signal Flow

This app implements a **full WebRTC mesh signaling flow** via Socket.IO.

```
User A joins room                User B already in room
     │                                    │
     │──── socket.emit(JOIN) ────────────►│
     │                                    │
     │◄─── emit(ADD_PEER, createOffer:false) ──── Server
     │         (to existing clients)      │
     │                                    │
     │──── emit(ADD_PEER, createOffer:true) ─────►│
     │         (to new joiner)            │
     │                                    │
  B creates RTCPeerConnection          A creates RTCPeerConnection
  B creates SDP Offer                     │
     │──── emit(RELAY_SDP, offer) ────────►│
     │                                    │
     │◄─── emit(SESSION_DESCRIPTION) ─────│  A sets remote desc + creates Answer
     │                                    │
     │◄─── emit(RELAY_SDP, answer) ───────│
     │                                    │
  Both exchange ICE Candidates via RELAY_ICE / ICE_CANDIDATE
     │◄══════════ P2P Audio Stream ═══════►│
```

**Key WebRTC events in `useWebRTC.js`:**

| Step | Event | Direction | Description |
|---|---|---|---|
| 1 | `JOIN` | Client → Server | User joins a room with roomId + user info |
| 2 | `ADD_PEER` | Server → Client | Tell clients to create a peer connection |
| 3 | `RELAY_SDP` | Client → Server → Client | Exchange SDP offer/answer |
| 4 | `SESSION_DESCRIPTION` | Server → Client | Deliver remote SDP to peer |
| 5 | `RELAY_ICE` | Client → Server → Client | Exchange ICE candidates |
| 6 | `ICE_CANDIDATE` | Server → Client | Deliver ICE candidate to peer |
| 7 | `MUTE` / `UNMUTE` | Client → Server → All | Broadcast mute state to room |
| 8 | `MUTE_INFO` | Client → Server → Others | Sync mute state for new joiners |
| 9 | `LEAVE` / `REMOVE_PEER` | Client → Server → All | Cleanup on disconnect |

---

## 🔌 Socket Events Reference

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `join` | `{ roomId: string, user: UserObject }` | Join a room and trigger peer setup |
| `relay-ice` | `{ peerId: string, icecandidate: RTCIceCandidate }` | Relay ICE candidate to a specific peer |
| `relay-sdp` | `{ peerId: string, sessionDescription: RTCSessionDescription }` | Relay SDP offer/answer to a specific peer |
| `mute` | `{ roomId: string, userId: string }` | Broadcast mute event to all room members |
| `unmute` | `{ roomId: string, userId: string }` | Broadcast unmute event to all room members |
| `mute-info` | `{ userId: string, roomId: string, isMute: boolean }` | Send current mute state to newly joined peers |
| `leave` | — | Triggered on socket disconnect; removes peer from all rooms |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `add-peer` | `{ peerId: string, createOffer: boolean, user: UserObject }` | Instruct client to create a RTCPeerConnection |
| `remove-peer` | `{ peerId: string }` | Instruct client to close & remove a peer connection |
| `ice-candidate` | `{ peerId: string, icecandidate: RTCIceCandidate }` | Deliver ICE candidate from a peer |
| `session-description` | `{ peerId: string, sessionDescription: RTCSessionDescription }` | Deliver SDP offer or answer from a peer |
| `mute` | `{ peerId: string, userId: string }` | Notify room that a user muted |
| `unmute` | `{ peerId: string, userId: string }` | Notify room that a user unmuted |
| `mute-info` | `{ userId: string, isMute: boolean }` | Sync mute state when a new peer joins |

---

## 🌐 REST API Reference

**Base URL:** `http://localhost:5500/api`

### 🔐 Authentication

#### Send OTP
```http
POST /api/send-otp
Content-Type: application/json

{ "phone": "+919876543210" }
```
**Response:**
```json
{
  "hash": "<hmac_hash>.<expires_timestamp>",
  "phone": "+919876543210",
  "otp": 4821
}
```
> In production, OTP is sent via Twilio SMS and NOT returned in the response. The `otp` field in the response is for development only.

---

#### Verify OTP
```http
POST /api/verify-otp
Content-Type: application/json

{
  "phone": "+919876543210",
  "otp": "4821",
  "hash": "<hmac_hash>.<expires_timestamp>"
}
```
**Response:** Sets `accessToken` and `refreshToken` as HTTP-only cookies.
```json
{
  "user": {
    "id": "64abc123...",
    "phone": "+919876543210",
    "name": null,
    "avatar": null,
    "activated": false
  },
  "auth": true
}
```

---

#### Activate Profile
```http
POST /api/activate
Authorization: Cookie (accessToken)
Content-Type: multipart/form-data

{ "name": "John Doe", "avatar": <file> }
```

---

#### Refresh Token
```http
GET /api/refresh
```
Reads `refreshToken` from cookie and issues a new `accessToken`.

---

#### Logout
```http
POST /api/logout
Authorization: Cookie (accessToken)
```
Deletes refresh token from DB and clears cookies.

---

### 🏠 Rooms

All room endpoints require authentication (`accessToken` cookie).

#### Create Room
```http
POST /api/rooms
Authorization: Cookie (accessToken)
Content-Type: application/json

{
  "topic": "Let's Talk Tech",
  "roomType": "open"
}
```
**Response:** `RoomDto` object

---

#### List All Open Rooms
```http
GET /api/rooms
Authorization: Cookie (accessToken)
```
**Response:** Array of `RoomDto` objects

---

#### Get Room by ID
```http
GET /api/rooms/:roomId
Authorization: Cookie (accessToken)
```
**Response:** Room object with speaker details

---

## 🗄️ Database Schema

### Users Collection
```js
{
  _id: ObjectId,
  phone: String,          // required, used as unique identifier
  name: String,           // set during activation
  avatar: String,         // relative file path, served from /storage
  activated: Boolean,     // false until profile setup complete
  createdAt: Date,
  updatedAt: Date
}
```

### Rooms Collection
```js
{
  _id: ObjectId,
  topic: String,          // Room title / discussion topic
  roomType: String,       // "open" | "social" | "private"
  ownerId: ObjectId,      // ref → Users
  speakers: [ObjectId],   // ref → Users array
  activated: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### RefreshTokens Collection
```js
{
  _id: ObjectId,
  token: String,          // JWT refresh token string
  userId: ObjectId,       // ref → Users
  createdAt: Date
}
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v16+ (v18 recommended)
- [MongoDB](https://www.mongodb.com/) v6+ (local or [MongoDB Atlas](https://cloud.mongodb.com))
- [Yarn](https://yarnpkg.com/) (or npm)
- [Twilio Account](https://www.twilio.com/) (for SMS OTP — optional in dev)

---

### 1. Clone the Repository

```bash
git clone https://github.com/digvijay599/web-rtc.git
cd web-rtc
```

---

### 2. Backend Setup

```bash
cd backend
yarn install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

See [Environment Variables](#-environment-variables) for details on each variable.

Start the backend server:

```bash
# Development (with auto-reload)
yarn dev

# Production
yarn start
```

Server runs at: `http://localhost:5500`

---

### 3. Frontend Setup

```bash
cd ../frontend
yarn install
```

> **Note:** The Socket.IO client is hardcoded to `http://localhost:5500` in `src/socket/index.js`. Update this if your backend runs on a different port or host.

Start the frontend dev server:

```bash
yarn start
```

App runs at: `http://localhost:3000`

---

## 🔑 Environment Variables

Create a `.env` file in the `/backend` directory with the following variables:

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `5500`) |
| `FRONT_URL` | Yes | Frontend URL for CORS (e.g. `http://localhost:3000`) |
| `BASE_URL` | Yes | Backend base URL for avatar image paths (e.g. `http://localhost:5500/`) |
| `DB_URL` | Yes | MongoDB connection string (e.g. `mongodb://localhost:27017/WebRTC`) |
| `JWT_ACCESS_TOKEN_SECRET` | Yes | Long random string for signing access tokens (1h expiry) |
| `JWT_REFRESH_TOKEN_SECRET` | Yes | Long random string for signing refresh tokens (1y expiry) |
| `HASH_SECRET` | Yes | Secret key for HMAC-SHA256 OTP hashing |
| `SMS_SID` | Dev optional | Twilio Account SID (for SMS OTP delivery) |
| `SMS_AUTH_TOKEN` | Dev optional | Twilio Auth Token |
| `SMS_FROM_NUMBER` | Dev optional | Twilio phone number in E.164 format (e.g. `+15077107195`) |

**Example `.env`:**
```env
PORT=5500
FRONT_URL=http://localhost:3000
BASE_URL=http://localhost:5500/
DB_URL=mongodb://localhost:27017/WebRTC
JWT_ACCESS_TOKEN_SECRET=your_super_long_random_secret_here
JWT_REFRESH_TOKEN_SECRET=another_super_long_random_secret_here
HASH_SECRET=yet_another_long_random_secret
SMS_SID=ACxxxxxxxxxxxxxxxxxxxx
SMS_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
SMS_FROM_NUMBER=+1XXXXXXXXXX
```

> ⚠️ **Security Warning:** Never commit your `.env` file. The `.env.example` file in this repo contains **expired/invalidated** credentials included only as format reference.

---

## 🏃 Running the App

### Full Local Setup (Both Servers)

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd web-rtc/backend
yarn dev
# ✅ Server running on http://localhost:5500
# ✅ DB is connected
```

**Terminal 2 — Frontend:**
```bash
cd web-rtc/frontend
yarn start
# ✅ App running on http://localhost:3000
```

### User Flow

```
1. Open http://localhost:3000
2. Enter your phone number → OTP sent (check console in dev mode for OTP value)
3. Enter OTP to verify → Redirected to /activate
4. Set your name and optionally upload an avatar
5. Browse the /rooms page
6. Create a new room (topic + type)
7. Join a room → Microphone permission requested
8. Real-time audio begins between room participants!
9. Toggle mute/unmute — synced across all participants
```

---

## 🐛 Known Issues & Improvements

This is a learning/portfolio project. The following improvements are planned or known:

| Issue | Priority | Notes |
|---|---|---|
| Frontend hardcodes `localhost:5500` in socket config | High | Should use env variable `REACT_APP_BACKEND_URL` |
| OTP returned in API response in dev mode | High | Must be removed before production; use Twilio only |
| No rate limiting on `/api/send-otp` | High | Vulnerable to SMS spam without rate limiting (e.g., `express-rate-limit`) |
| `httponly` cookie flag has a typo (`httponly` → `httpOnly`) | Medium | JS is case-sensitive; `httponly: true` is silently ignored in some environments |
| `verifyAccessToken` / `verifyRefreshToken` have spelling typos (`varify`) | Low | Cosmetic — rename to `verifyAccessToken` |
| No input sanitization / validation layer (e.g., Joi or Zod) | Medium | Auth controller does manual checks inconsistently |
| No WebRTC TURN server configured | Medium | `freeice()` provides public STUN servers only — audio will fail on strict NAT/firewalls without TURN |
| Frontend uses React 17 + React Router v5 | Low | Upgrade path to React 18 + React Router v6 is available |
| No test coverage | Medium | No unit or integration tests exist |
| `yarn-error.log` committed to repo | Low | Should be added to `.gitignore` |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feat/your-feature-name

# 3. Commit using conventional commit format
git commit -m "feat: add TURN server configuration support"

# 4. Push and open a Pull Request
git push origin feat/your-feature-name
```

**Commit Message Format:**
```
feat:     New feature
fix:      Bug fix
refactor: Code refactor (no behavior change)
docs:     Documentation update
chore:    Build/config/dependency update
test:     Add or update tests
```

---

## 👤 Author

**Digvijay Nath Tiwari**

- 🌐 Portfolio: [digvijaytiwari.in](https://www.digvijaytiwari.in)
- 💼 LinkedIn: [linkedin.com/in/digvijaytiwari](https://linkedin.com/in/digvijaytiwari)
- 🐦 Twitter: [@digvijay5788894](https://twitter.com/digvijay5788894)
- 🐙 GitHub: [@digvijay599](https://github.com/digvijay599)

---

<div align="center">

⭐ **If this project helped you understand WebRTC — drop a star!** ⭐

</div>
