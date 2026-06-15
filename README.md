# Clinic System

A full-stack clinic appointment management system built with Next.js 16, Prisma 7, and PostgreSQL (Neon). Patients can browse doctors, book appointments, and manage their schedule. Doctors can manage their availability and confirm or complete appointments.

## Features

- **User authentication** — Register as patient or doctor, login with JWT stored in httpOnly cookies, account lockout after 5 failed attempts
- **Rate limiting** — 5 login attempts/min, 3 registration attempts/min per IP
- **Role-based access** — Patient, Doctor, and Admin roles with separate dashboards
- **Doctor listing** — Browse doctors with specialty filter, pagination, and name search
- **Doctor detail** — View doctor profile and available time slots (30-min intervals, weekdays 9AM–5PM, next 30 days)
- **Appointment booking** — Select date and time, booking validation (working hours, double-booking prevention), cancel within 24h rule
- **Patient dashboard** — View upcoming/past appointments, cancel eligible appointments
- **Doctor dashboard** — Stats cards (pending/confirmed/total), confirm or complete appointments, manage schedule
- **Responsive design** — Mobile-friendly with Tailwind CSS v4

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| Database | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) |
| ORM | [Prisma 7](https://www.prisma.io/) (with PrismaPg adapter) |
| Auth | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) + [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (httpOnly cookies) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Notifications | [react-hot-toast](https://react-hot-toast.com/) |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or [Neon](https://neon.tech/))

### Installation

```bash
git clone <repo-url>
cd clinic-system
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiration (default: 7d) |
| `BCRYPT_ROUNDS` | Salt rounds for password hashing (default: 10) |

> **Note:** `JWT_SECRET` is required — the app will crash at startup if it's not set.

### Database

```bash
npx prisma migrate dev
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── actions/          # Server Actions (appointment mutations)
├── app/
│   ├── (auth)/       # Login & register pages
│   ├── api/
│   │   ├── auth/     # Login, register, logout, me endpoints
│   │   ├── appointments/  # CRUD endpoints
│   │   └── doctors/  # Listing & detail endpoints
│   ├── dashboard/
│   │   ├── admin/    # Admin dashboard (placeholder)
│   │   ├── doctor/   # Doctor dashboard
│   │   └── patient/  # Patient dashboard
│   ├── doctors/      # Public doctor listing & detail
│   └── page.tsx      # Landing page
├── components/
│   ├── appointments/ # AppointmentCard, AppointmentList
│   ├── doctors/      # DoctorCard, DoctorList
│   ├── forms/        # LoginForm, RegisterForm, BookingForm
│   ├── layout/       # Header
│   └── ui/           # Button, Card, Input, Select, Toast
├── lib/
│   ├── auth.ts       # JWT helpers, password hashing, session
│   ├── db.ts         # Prisma client singleton
│   ├── rate-limit.ts # In-memory rate limiter
│   ├── utils.ts      # cn(), formatDate(), etc.
│   └── validations.ts # Zod schemas
├── proxy.ts          # Route protection (Next.js 16)
└── generated/        # Prisma client output
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | No | Logout (clears cookie) |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/doctors` | No | List doctors (`?specialty=&page=&limit=`) |
| GET | `/api/doctors/[id]` | No | Doctor detail + available slots |
| GET | `/api/appointments` | Yes | List user's appointments |
| POST | `/api/appointments` | Patient | Book appointment |
| PUT | `/api/appointments/[id]` | Yes | Cancel/confirm/complete |

## Appointment Status Flow

```
PENDING → CONFIRMED → COMPLETED
   ↓          ↓
CANCELLED  CANCELLED
```

- Patients can cancel PENDING or CONFIRMED appointments if more than 24 hours before the scheduled time.
- Doctors can confirm PENDING appointments and complete CONFIRMED appointments.

## Next.js 16 & Prisma 7 Notes

This project uses **Next.js 16** and **Prisma 7**, which have breaking changes from earlier versions:

- Use `proxy.ts` instead of `middleware.ts` for route protection
- `params` and `cookies()` are async — must be `await`ed
- Prisma 7 uses `prisma-client` provider and `prisma.config.ts` for datasource URL
- Prisma client output is in `src/generated/`

## License

MIT
