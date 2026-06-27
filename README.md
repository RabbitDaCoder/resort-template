# Discovery Samal Resort

Discovery Samal Resort is a full-stack booking platform for the resort website, guest reservation flow, admin operations, and transactional email handling. The repository is split into three apps: a React frontend, an Express/MongoDB backend, and a small Node-based email relay.

The codebase has been rebranded for Discovery Samal Resort. The current frontend work centers on a structured home-page rebuild while keeping the existing booking, payment, and admin flows intact.

## What Is In This Repo

- `frontend/` contains the guest-facing site and admin UI shell.
- `backend/` contains the REST API, data models, business logic, uploads, and auth.
- `email-service/` contains the standalone mail relay used for outbound booking email delivery.
- `render.yaml` contains the backend Render service definition.

## Main Capabilities

- Guest-facing resort website with room browsing and branded landing pages.
- Booking flow with room selection, date picking, guest details, payment upload, and receipt pages.
- Admin area for rooms, bookings, discounts, payment review, and payment settings.
- Manual payment handling for bank transfer and GCash-style payment flows.
- Optional installment support and reminder workflow.
- Transactional email sending through a dedicated service.
- PDF receipt generation.
- JWT-based admin authentication, audit logging, rate limiting, and upload handling.

## Stack

### Frontend

- React 19
- React Router 7
- Vite 8
- Tailwind CSS 4
- Axios
- Swiper
- Lucide React
- Framer Motion
- React Hook Form and Zod

### Backend

- Node.js 18+
- Express 5
- MongoDB and Mongoose
- JWT and bcryptjs
- Cloudinary and Multer
- Nodemailer
- PDFKit
- Winston and Morgan

### Email Service

- Node.js
- Express
- Nodemailer

## Project Layout

```text
discoverysamal-resort/
|- backend/
|- email-service/
|- frontend/
|- render.yaml
|- PROJECT_REBRAND_PROMPT.md
|- README.md
```

### Frontend Highlights

- `src/pages/` holds route pages.
- `src/layouts/` contains public and admin layouts.
- `src/components/` contains shared UI and admin/booking widgets.
- `src/sections/home/` contains the newer section-based home implementation.
- `src/services/api.js` centralizes API requests.
- `src/lib/brand.js` centralizes brand data used in the UI.

Current route map includes:

- Public: `/`, `/about`, `/rooms`, `/booking`, `/booking/:id/payment`, `/booking/:id/success`, `/activities`, `/gallery`, `/contact`
- Admin: `/owner/login`, `/owner`, `/owner/rooms`, `/owner/bookings`, `/owner/payments`, `/owner/discounts`, `/owner/settings`

### Backend Highlights

- `server.js` boots the API and mounts route groups.
- `config/` contains DB, email, and logging configuration.
- `controllers/` handles request/response orchestration.
- `services/` contains business logic.
- `models/` defines MongoDB entities.
- `middleware/` handles auth, validation, uploads, idempotency, rate limiting, and errors.
- `validators/` contains request schema validation.
- `seed/rooms.seed.js` seeds room data.

Main API groups:

- `/api/health`
- `/api/rooms`
- `/api/bookings`
- `/api/payments`
- `/api/admin`
- `/api/settings`
- `/api/discounts`

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB connection string
- Cloudinary account for uploads
- SMTP credentials for the email relay

### Install

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../email-service
npm install
```

## Environment Setup

This repository currently includes an `.env.example` for the email service. The backend still relies on the local `.env` file as the reference source, and secrets should remain out of version control.

### Backend

Backend setup typically requires these variables:

- `PORT`
- `NODE_ENV`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `EMAIL_SERVICE_URL`
- `EMAIL_SERVICE_API_KEY`
- `ADMIN_EMAIL`
- `RESORT_PHONE`
- `RESORT_EMAIL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Frontend

The frontend uses Vite env files for production and local configuration. Check the files under `frontend/`, including `.env.production`, for the exact keys already wired into this project.

### Email Service

Email relay setup typically requires:

- `PORT`
- `EMAIL_API_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `CLIENT_URL`

## Running Locally

Run each app in its own terminal.

### Backend

```bash
cd backend
npm run dev
```

Default local API URL:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### Frontend

```bash
cd frontend
npm run dev
```

Typical Vite URL:

```text
http://localhost:5173
```

### Email Service

```bash
cd email-service
npm run dev
```

## Scripts

### Backend

- `npm run dev` starts the API with Nodemon.
- `npm start` starts the API in normal Node mode.
- `npm run seed:rooms` seeds room data.

### Frontend

- `npm run dev` starts the Vite dev server.
- `npm run build` creates a production build.
- `npm run preview` previews the production build locally.

### Email Service

- `npm run dev` starts the relay locally.

## Deployment

This project is deployed as separate services.

### Backend

- Platform: Render
- Config: `render.yaml`
- Root directory: `backend/`
- Build command: `npm install`
- Start command: `npm start`

### Frontend

- Platform: Vercel
- Config: `frontend/vercel.json`
- Routing: SPA rewrite to `/`

### Email Service

- Platform: Vercel
- Config: `email-service/vercel.json`
- Main route: `/api/send`

## Current Frontend Direction

Recent frontend work in this repository includes:

- a full rebrand to Discovery Samal Resort
- a refreshed brand palette and typography (UI redesign forthcoming)
- a section-based home page implementation under `frontend/src/sections/home/`
- anchor-based public navigation on the landing page

The intent is to modernize the resort presentation without breaking the existing booking and admin application logic.

## Operational Notes

- Brand metadata used by the frontend lives in `frontend/src/lib/brand.js`.
- If you change the production domain, mail sender, or API host, update the frontend brand config and the backend and email-service environment values together.
- The backend trusts the first proxy and exposes a simple `/api/health` endpoint for uptime checks.

## Validation

The frontend was last validated with:

```bash
cd frontend
npm run build
```

## License

No license file is currently included in this repository.
