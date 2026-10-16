# 🚖 RathoreTaxi — Full-Stack Ride-Hailing Platform

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

**RathoreTaxi** is a modern, responsive, full-stack ride-hailing application inspired by Uber. It features dedicated portals for **Passengers (Riders)** and **Drivers (Captains)**, interactive Leaflet maps with real-time route calculations, dynamic fare estimation across multiple vehicle tiers, simulated dispatch & live trip tracking with OTP verification, robust JWT authentication with token blacklisting, and a pre-configured database seeder.

---

## 📑 Table of Contents

- [Features](#-features)
  - [Passenger (Rider) Experience](#passenger-rider-experience)
  - [Driver (Captain) Experience](#driver-captain-experience)
  - [Security & Core Architecture](#security--core-architecture)
- [Tech Stack](#-tech-stack)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Seed Sample Data](#4-seed-sample-data-optional-but-recommended)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
  - [User (Rider) Endpoints](#user-rider-endpoints)
  - [Captain (Driver) Endpoints](#captain-driver-endpoints)
- [Default Demo Credentials](#-default-demo-credentials)
- [Deployment](#-deployment)
- [License](#-license)

---

## ✨ Features

### Passenger (Rider) Experience
- **Interactive Mapping**: Powered by Leaflet & OpenStreetMap with dynamic markers for pickup and drop-off, geolocation auto-detect, and animated route lines.
- **Location Autocomplete**: Geocoding search for intuitive pickup and destination selection.
- **Multi-Tier Vehicle Selection**:
  - 🚗 **Rathore Prime Car**: Comfortable, air-conditioned ride for up to 4 passengers.
  - 🛺 **Rathore Auto**: Pocket-friendly city rickshaw for up to 3 passengers.
  - 🏍️ **Rathore Moto Bike**: Lightning-fast single commuter bike for beating traffic.
- **Dynamic Fare Engine**: Transparent fare calculations based on base fares, distance per kilometer (Haversine formula), and vehicle tier tariffs.
- **Ride Dispatch Simulation**: Realistic search animations, instant Captain assignment, secure OTP generation, and real-time trip simulation.
- **Rider Dashboard & History**: History of past trips with fare breakdown, vehicle details, driver info, and date timestamps.

### Driver (Captain) Experience
- **Captain Onboarding**: Registration with driver profile and vehicle attributes (model, plate number, capacity, and vehicle type: `car`, `bike`, `auto`).
- **Driver Control Center**: Live status toggle (Online / Offline), total earnings tracker, completed rides tally, and driver rating indicators.
- **Ride Request Queue**: View incoming ride alerts with passenger pickup, destination, fare, and distance.
- **Trip Execution**: Accept rides, navigate to passenger pickup, verify passenger OTP, begin transit, and mark rides completed with instantaneous earnings update.
- **Captain Profile**: Dedicated profile dashboard displaying captain and vehicle specs.

### Security & Core Architecture
- **JWT Authentication & Stateless Sessions**: Token-based authentication stored securely in cookies or HTTP authorization headers.
- **Token Blacklisting**: Logout immediately invalidates tokens in MongoDB using automatic TTL index expiration, preventing replay attacks.
- **Input Validation**: Strict request sanitization with `express-validator` on all authentication and registration flows.
- **Role-Based Protected Routes**: Frontend route protection distinguishing between guest visitors, logged-in riders, and registered captains.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern reactive UI library |
| **Vite 8** | Next-generation fast frontend tooling & HMR |
| **Tailwind CSS v4** | Utility-first CSS framework with modern Vite integration |
| **React Router v7** | Declarative client-side routing and protected routes |
| **Leaflet & OpenStreetMap** | Open-source interactive maps & custom markers |
| **Lucide React** | Modern, lightweight icon collection |
| **Axios** | HTTP client with automatic auth token injection |
| **React Hot Toast** | Toast notifications for user feedback |

### Backend
| Technology | Description |
| :--- | :--- |
| **Node.js** | JavaScript runtime environment |
| **Express.js 4** | Web framework for RESTful API endpoints |
| **MongoDB & Mongoose 8** | NoSQL database with ODM schema modeling |
| **JWT (jsonwebtoken)** | Signed authentication tokens |
| **bcrypt** | Salted password hashing |
| **express-validator** | Request payload validation and error formatting |
| **cookie-parser & cors** | Cookie handling and Cross-Origin Resource Sharing |

---

## 📁 Project Architecture & Directory Structure

```text
uber clone app/
├── backend/
│   ├── api/                 # Serverless entry points (Vercel)
│   ├── controller/          # Request handlers (user & captain controllers)
│   ├── db/                  # Database connection logic (Mongoose)
│   ├── middlewares/         # JWT verification & role authorization
│   ├── models/              # Schemas (User, Captain, BlacklistToken)
│   ├── routes/              # Express route declarations (/users, /captain)
│   ├── services/            # Business logic and database operations
│   ├── app.js               # Express application initialization & middleware
│   ├── server.js            # HTTP server listener
│   ├── seed.js              # Database seeder with sample riders & drivers
│   ├── .env.example         # Backend environment template
│   └── package.json
│
├── frontend/
│   ├── public/              # Static assets and icons
│   ├── src/
│   │   ├── api/             # Axios API instances & endpoints
│   │   ├── components/      # Reusable UI (Navbar, Map, VehicleOption, etc.)
│   │   ├── context/         # AuthContext & RideContext state providers
│   │   ├── pages/           # Rider pages (Home, BookRide, RideSearching, Profile)
│   │   │   └── captain/     # Captain pages (Dashboard, Ride, Login, Register)
│   │   ├── utils/           # Geocoding, distance calculations & helpers
│   │   ├── App.jsx          # Route configuration & layout wrapper
│   │   ├── index.css        # Tailwind CSS imports & custom styling
│   │   └── main.jsx         # React application root
│   ├── .env.example         # Frontend environment template
│   ├── vite.config.js       # Vite configuration
│   └── package.json
│
├── vercel.json              # Monorepo unified deployment configuration
├── package.json             # Root workspace configuration
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher) — [Download Node.js](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **yarn**
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

---

### 1. Clone Repository

```bash
git clone https://github.com/jatin110206/RathoreTaxi.git
cd "uber clone app"
```

---

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` parameters:
   ```env
   PORT=4000
   DB_CONNECT=mongodb://127.0.0.1:27017/RathoreTaxi
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will be running at `http://localhost:4000`.*

---

### 3. Frontend Setup

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Set the backend API URL:
   ```env
   VITE_API_URL=http://localhost:4000
   ```

5. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will typically be accessible at `http://localhost:5173`.*

---

### 4. Seed Sample Data (Optional but Recommended)

To quickly test the application with pre-populated riders and captains with active vehicles:

```bash
cd backend
npm run seed
```

This populates sample riders and drivers with valid vehicle registrations (Car, Moto, Auto) ready to login and test immediately.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `PORT` | Yes | Port on which Express server listens | `4000` |
| `DB_CONNECT` | Yes | MongoDB connection URI (Local or Atlas) | `mongodb://127.0.0.1:27017/RathoreTaxi` |
| `JWT_SECRET` | Yes | Secret key used for signing JWT tokens | `rathore-taxi-super-secret-key-2026` |

### Frontend (`frontend/.env`)

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | Yes | Base URL of backend REST API (no trailing slash) | `http://localhost:4000` |

---

## 📡 API Reference

Base URL: `http://localhost:4000`

### User (Rider) Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/users/register` | No | Register a new rider account |
| `POST` | `/users/login` | No | Authenticate rider and receive JWT token |
| `GET` | `/users/profile` | **Bearer Token** | Retrieve currently authenticated rider's profile |
| `GET` | `/users/logout` | **Bearer Token** | Log out rider and blacklist current JWT token |

#### Example: Register User Request
```json
POST /users/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "Jatin",
    "lastname": "Rathore"
  },
  "email": "jatin@example.com",
  "password": "password123"
}
```

---

### Captain (Driver) Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/captain/register` | No | Register a new driver with vehicle details |
| `POST` | `/captain/login` | No | Authenticate driver and receive JWT token |
| `GET` | `/captain/profile` | **Bearer Token** | Retrieve currently authenticated driver's profile |
| `GET` | `/captain/logout` | **Bearer Token** | Log out driver and blacklist current JWT token |

#### Example: Register Captain Request
```json
POST /captain/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "Rajesh",
    "lastname": "Rathore"
  },
  "email": "captain.rajesh@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Silver",
    "plate": "DL-01-AB-1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

---

## 👥 Default Demo Credentials

After running `npm run seed` in the backend, you can sign in with any of the following accounts:

### 👤 Sample Riders
| Email | Password | Role |
| :--- | :--- | :--- |
| `jatin@rathoretaxi.com` | `password123` | Rider |
| `priya.sharma@example.com` | `password123` | Rider |
| `rohit.verma@example.com` | `password123` | Rider |

### 🚖 Sample Captains (Drivers)
| Email | Password | Vehicle Type | Vehicle Plate |
| :--- | :--- | :--- | :--- |
| `captain.rajesh@rathoretaxi.com` | `password123` | Car (Swift Dzire) | `DL-01-AB-1234` |
| `captain.vikram@rathoretaxi.com` | `password123` | Moto (Pulsar 150) | `MH-02-CD-5678` |
| `captain.amit@rathoretaxi.com` | `password123` | Auto (Bajaj Compact) | `UP-14-EF-9012` |

---

## 🌐 Deployment

The repository includes a root `vercel.json` and backend `api/` configuration designed for zero-config microservice deployments on [Vercel](https://vercel.com):

```json
{
  "services": {
    "frontend": { "root": "frontend", "framework": "vite" },
    "backend": { "root": "backend" }
  },
  "rewrites": [
    { "source": "/api(/.*)?", "destination": { "type": "service", "service": "backend" } },
    { "source": "/(.*)", "destination": { "type": "service", "service": "frontend" } }
  ]
}
```

To deploy manually via the Vercel CLI:
```bash
npm install -g vercel
vercel
```

Ensure environment variables (`DB_CONNECT`, `JWT_SECRET`, and `VITE_API_URL`) are configured in your Vercel Project Settings.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Crafted with ❤️ by <b>Jatin Prakash Rathore</b>
</p>
