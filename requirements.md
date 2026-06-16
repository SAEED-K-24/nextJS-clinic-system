# Project Requirements - Clinic Appointment System

## Tech Stack (Required)

### Frontend
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS (with typography plugin)
- React Hook Form (form validation)
- Zod (schema validation)
- Axios (HTTP client with interceptors for JWT)

### Backend
- Next.js API Routes (Route Handlers)
- Next.js Server Actions (for mutations where appropriate)
- bcryptjs (password hashing)
- jsonwebtoken (JWT generation/verification)

### Database
- PostgreSQL (latest stable)
- Prisma (ORM)
- @prisma/client

### Authentication
- JWT with Bearer token
- httpOnly cookies (recommended) OR localStorage (based on preference)
- Next.js Middleware for route protection

### Development Tools
- npm or pnpm (package manager)
- eslint (with Next.js config)
- prettier
- husky (pre-commit hooks)
- dotenv (environment variables)

## Features to Implement (Priority Order)

### Phase 1: Authentication & Setup (Must Have)
- [ ] User registration (patient, doctor roles)
- [ ] User login with JWT token generation
- [ ] Protected routes via middleware
- [ ] Role-based access control (patient, doctor, admin)
- [ ] Logout functionality

### Phase 2: Core Features
- [ ] Doctor list with search/filter by specialty
- [ ] Appointment booking with time-slot validation
- [ ] View appointments (patient dashboard)
- [ ] View appointments (doctor dashboard)
- [ ] Cancel appointment (patient only before 24h)
- [ ] Update appointment status (doctor: pending → confirmed/completed)

### Phase 3: Advanced Features (Nice to Have)
- [ ] Admin panel: add/manage doctors, specialties
- [ ] Pagination for appointments and doctors list
- [ ] Appointment history with filters (date range, status)
- [ ] Profile management (update name, password)
- [ ] Email notification (Nodemailer) after booking/cancellation

## API Endpoints Structure
/api/auth
POST /register
POST /login
POST /logout
GET /me

/api/doctors
GET / (with query: specialty, page, limit)
GET /[id]
POST / (admin only)

/api/appointments
GET / (patient: my appointments, doctor: my schedule)
POST / (create appointment)
PUT /[id] (cancel or update status)
DELETE /[id] (admin only)

/api/admin
GET /doctors (manage)
POST /doctors
PUT /doctors/[id]



## Environment Variables Required

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"
BCRYPT_ROUNDS="10"
NODE_ENV="development"