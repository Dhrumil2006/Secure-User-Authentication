# replit.md

## Overview

SecureAuth is a secure user authentication system built with a modern full-stack TypeScript architecture. The application provides user authentication via Replit's OpenID Connect (OIDC) integration, featuring a React frontend with shadcn/ui components and an Express backend with PostgreSQL database storage. The system follows Material Design principles with a focus on trust, clarity, and professional minimalism.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **Build Tool**: Vite with hot module replacement

The frontend follows a page-based structure under `client/src/pages/` with reusable components in `client/src/components/`. Authentication state is managed through a custom `useAuth` hook that queries the backend API.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Replit OIDC integration via Passport.js with OpenID Connect strategy
- **Session Management**: Express sessions stored in PostgreSQL using connect-pg-simple
- **Database ORM**: Drizzle ORM with PostgreSQL dialect

The server follows a modular structure:
- `server/index.ts` - Express app setup and middleware
- `server/routes.ts` - API route registration
- `server/replitAuth.ts` - OIDC authentication configuration
- `server/storage.ts` - Database access layer with storage interface pattern
- `server/db.ts` - Database connection pool

### Data Storage
- **Database**: PostgreSQL
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Schema Validation**: Zod schemas generated from Drizzle schemas using drizzle-zod
- **Tables**:
  - `users` - User profiles with id, email, name, profile image, timestamps
  - `sessions` - Session storage for authentication persistence

### Authentication Flow
1. User clicks login → redirected to Replit OIDC provider
2. After authentication → callback to `/api/callback`
3. User session created and stored in PostgreSQL
4. Frontend queries `/api/auth/user` to get authenticated user data
5. Protected routes check authentication via `isAuthenticated` middleware

### Build System
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Vite builds static assets, esbuild bundles server code
- **Output**: `dist/public/` for frontend assets, `dist/index.cjs` for server

## External Dependencies

### Database
- **PostgreSQL**: Primary database for user data and session storage
- **Connection**: Via `DATABASE_URL` environment variable

### Authentication Provider
- **Replit OIDC**: OpenID Connect provider for user authentication
- **Required Environment Variables**:
  - `REPL_ID` - Replit application identifier
  - `ISSUER_URL` - OIDC issuer URL (defaults to https://replit.com/oidc)
  - `SESSION_SECRET` - Secret for signing session cookies

### UI Framework Dependencies
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Tailwind class merging utility

### Build & Development
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development
- **drizzle-kit**: Database migration tooling