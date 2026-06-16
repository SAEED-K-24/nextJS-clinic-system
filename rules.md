
```markdown
# Development Rules for Next.js Project

## Core Rules (MANDATORY)

### 1. Documentation First
- Always check Next.js official docs: https://nextjs.org/docs
- Follow App Router conventions strictly
- Use `next/font` for fonts, `next/image` for images
- NEVER use pages directory (use App Router only)

### 2. Git Rules (CRITICAL)
- **NEVER** push to git without user confirmation
- After each major feature completion, ASK: "هل تريد عمل commit لهذه التغييرات؟"
- NEVER auto-commit, auto-push, or auto-create PR
- Show git diff before any git operation
- NEVER push sensitive data (.env, secrets, tokens)

### 3. Code Style & Quality
- Use TypeScript with NO `any` type (use `unknown` if necessary)
- Use `'use client'` directive ONLY when needed (client components)
- Prefer Server Components by default
- Use proper error handling with try-catch
- Add console.log only in development, remove for production

### 4. No Over-Engineering
- Don't add Redux or complex state management unless requested
- Don't add Redis, caching layers, or queues unless requested
- Don't add WebSockets unless requested
- Don't write unnecessary abstractions
- Keep components simple and focused

### 5. Common Next.js Patterns to Use
- Use `next/navigation` for routing (not `next/router`)
- Use Server Actions for mutations when possible
- Use Route Handlers for external API endpoints
- Use `cookies()` from `next/headers` for server-side token validation
- Use `redirect()` from `next/navigation` for auth flows
- Use `notFound()` for 404 pages

### 6. Database & Prisma
- Always use Prisma Client singleton pattern
- Never expose raw database queries in API routes
- Use Prisma migrations (not `prisma db push` for production)
- Validate input with Zod before saving to database

### 7. Authentication & Security
- Hash passwords with bcryptjs (min 10 rounds)
- Store JWT in httpOnly cookies (preferred) or localStorage with Axios interceptors
- Validate JWT in middleware for protected routes
- Never trust client-side role checks (always verify on server)
- Implement rate limiting on auth endpoints (optional but recommended)

### 8. Tailwind CSS Rules
- Use Tailwind utility classes only (no custom CSS files unless needed)
- Follow mobile-first responsive design
- Use `clsx` or `cn` utility for conditional classes
- Keep design system consistent (colors, spacing, typography)

### 9. Project-Specific Rules
- **Roles**: Implement 3 roles (PATIENT, DOCTOR, ADMIN)
- **Middleware**: Protect all routes under `/dashboard/*` and `/api/*`
- **Booking Logic**: Prevent double-booking same doctor at same time
- **Time Validation**: Only allow bookings during working hours (9 AM - 5 PM, Monday-Friday)
- **Cancellation**: Patients can cancel only 24 hours before appointment

### 10. File & Folder Naming
- Use `kebab-case` for folders: `appointment-card/`
- Use `PascalCase` for components: `AppointmentCard.tsx`
- Use `camelCase` for utilities: `formatDate.ts`
- Use `route.ts` for API routes, `page.tsx` for pages

### 11. Development Workflow
1. Start development server with `npm run dev`
2. Test each feature manually before marking complete
3. Show user the result in browser
4. Ask user to approve before moving to next feature
5. NEVER delete existing working code without permission

### 12. Environment & Setup
- Create `.env.local` for development (never commit)
- Provide `.env.example` with dummy values
- Run `prisma generate` after schema changes
- Run `prisma migrate dev` for database changes

### 13. Error Handling & UX
- Show user-friendly error messages (not raw JSON errors)
- Use loading states for async operations
- Implement proper form validation with Zod
- Display success/error toasts for user actions

### 14. What NOT to Do (Avoid These)
- Don't use `getServerSideProps` or `getStaticProps` (use App Router instead)
- Don't use `_app.tsx` or `_document.tsx` (use layout.tsx)
- Don't import server-side code in client components
- Don't forget to add `'use client'` for interactive components
- Don't ignore TypeScript errors
- Don't commit commented-out code

### 15. Asking for Permission
Before doing ANY of these, ASK the user:
- Creating/renaming/deleting files
- Installing new packages
- Running database migrations
- Making git commits
- Changing project structure
- Refactoring existing code

## Example Workflow Script

When starting a feature, say:
"I will now implement [feature name]. This will involve creating:
1. [file path] - purpose
2. [file path] - purpose

Do I have your permission to proceed?"

After finishing feature, say:
"✅ [Feature name] is complete. You can test it at [URL path].
Do you want me to:
1. Move to next feature
2. Make adjustments
3. Commit this code to git"

## Reminders for AI Assistant
- ⚠️ **GIT**: NEVER push or commit without "commit" command from user
- ⚠️ **INSTALL**: ASK before running npm install
- ⚠️ **DELETE**: ASK before deleting any code
- ✅ **DOCS**: Check Next.js docs for every major decision
- ✅ **SIMPLE**: Keep it simple, user wants common patterns only