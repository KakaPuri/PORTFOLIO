# Portfolio Application

## Overview

This is a modern portfolio web application built with React, Express, and PostgreSQL. It features a responsive design with dark theme, animated components, and a comprehensive admin panel for content management. The application showcases personal information, skills, work experience, education, articles, and provides a contact form for visitors.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design tokens and dark theme
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth animations and transitions
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless
- **API Design**: RESTful API endpoints with proper error handling
- **Development**: Hot module replacement with Vite integration

### Database Schema
- **Users**: Authentication and user management
- **Articles**: Blog posts with categories and publishing status
- **Skills**: Technical skills with categories and proficiency levels
- **Experiences**: Work experience with date ranges
- **Education**: Educational background
- **Activities**: Professional activities and achievements
- **Profile**: Personal profile information
- **Messages**: Contact form submissions

## Key Components

### Frontend Components
- **Navigation**: Responsive navigation with mobile menu
- **Animated Background**: Floating particles with CSS animations
- **Skill Bars**: Animated progress bars with category-based colors
- **Timeline**: Reusable timeline component for experience and education
- **Admin Panel**: Comprehensive content management interface
- **Form Components**: Consistent form styling with validation

### Backend Services
- **Storage Interface**: Abstract storage layer for database operations
- **Route Handlers**: RESTful endpoints for all data entities
- **Middleware**: Request logging and error handling
- **Development Tools**: Vite integration for SSR in development

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **Server Processing**: Express routes handle requests and validate data
3. **Database Operations**: Drizzle ORM performs type-safe database queries
4. **Response Handling**: JSON responses with proper error codes
5. **Client Updates**: TanStack Query manages cache invalidation and updates

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **@radix-ui/react-***: Accessible UI component primitives
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database ORM
- **express**: Web application framework
- **framer-motion**: Animation library
- **react-hook-form**: Form management
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing
- **zod**: Schema validation

### Development Dependencies
- **@vitejs/plugin-react**: React support for Vite
- **drizzle-kit**: Database migration tool
- **typescript**: Type checking and compilation
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database Setup**: Drizzle migrations applied with `db:push`

### Environment Configuration
- **Development**: Uses Vite dev server with HMR and middleware mode
- **Production**: Serves static files from Express with proper error handling
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### Scripts
- `dev`: Development server with hot reloading
- `build`: Production build for both frontend and backend
- `start`: Production server
- `check`: TypeScript type checking
- `db:push`: Apply database schema changes

## Changelog
- June 28, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.