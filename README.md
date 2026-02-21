# Payout Management Platform - Backend API

The backend REST API for the Payout Management Platform. Built using Node.js, Express, TypeScript, and MongoDB.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ORM)
- **Language:** TypeScript
- **Security:** JWT Authentication, Helmet, CORS, bcryptjs

## Prerequisites

- Node.js (v18 or higher)
- MongoDB database (Atlas URI or local instance)

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env` file in the root directory mirroring the required variables:

   ```env
   PORT=5001
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d
   COOKIE_EXPIRES_IN=7
   ALLOWED_ORIGINS=http://localhost:3000
   ```

3. **Run the Server:**
   - **Development (auto-reload):** `npm run dev`
   - **Build:** `npm run build`
   - **Production:** `npm start` _(starts the compiled code in `/dist`)_

## Database Seeding

To initialize the database with standard dummy Users/Vendors/Payouts, run:

```bash
npm run seed
```

## API Structure

- `/api/v1/auth` - Login, Logout, Verification
- `/api/v1/vendors` - Vendor management routes
- `/api/v1/payouts` - Role-based payout drafting, submitting, and processing
- `/health` - Instance health check
