# Virtual Herbal Garden - AYUSH Medicine Platform

## Overview

This project is a Virtual Herbal Garden designed to explore traditional medicinal plants used in Indian AYUSH systems (Ayurveda, Yoga & Naturopathy, Unani, Siddha, etc.). It's an interactive, educational web platform that allows users to discover, learn about, and visualize medicinal plants through modern web technologies.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based frontend built with:
- **Vite** as the build tool and development server
- **React 18** with TypeScript for type safety
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and data fetching
- **Tailwind CSS** with custom design system for styling
- **shadcn/ui** component library for consistent UI components

### Backend Architecture
The backend is a REST API built with:
- **Express.js** server with TypeScript
- **Drizzle ORM** for database operations and schema management
- **PostgreSQL** as the primary database (using Neon Database)
- In-memory storage implementation for development/testing

### Design System
The project implements a custom design system with:
- **Green-focused color palette** (forest green, fresh green, golden accents)
- **CSS custom properties** for theming
- **Responsive design** with mobile-first approach
- **Consistent typography** using system fonts

## Key Components

### Plant Management System
- **Plant Library**: Browse collection of medicinal plants with detailed information
- **Search & Filter**: Multi-criteria search by name, benefit, region, or category
- **Plant Details**: Comprehensive information including botanical names, habitat, uses, and cultivation methods
- **3D Visualization**: Placeholder system for future 3D plant models

### User Features
- **Bookmarking System**: Save favorite plants for later reference
- **Personal Notes**: Add custom notes to plants
- **Virtual Tours**: Curated educational paths through plant collections
- **Social Sharing**: Share plant information

### Data Structure
Plants contain:
- Basic information (common/botanical names)
- Geographic data (region, habitat)
- Medical information (uses, preparation methods, AYUSH system)
- Categorization (primary use, category, popularity)
- Media (images, future 3D models)

## Data Flow

1. **Client requests** are routed through Wouter's client-side router
2. **API calls** are managed by TanStack Query with automatic caching
3. **Server endpoints** handle CRUD operations for plants, bookmarks, and notes
4. **Database operations** are abstracted through Drizzle ORM
5. **Response data** is automatically cached and synchronized across components

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL database connection
- **Drizzle ORM**: Database schema and query management
- **TanStack Query**: Server state management
- **Radix UI**: Accessible component primitives

### Development Tools
- **Vite**: Build system with HMR support
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast JavaScript bundling for production
- **Replit integration**: Development environment support

### Future Integrations
- **Three.js**: Planned for 3D plant model visualization
- **AR capabilities**: Mobile augmented reality features
- **Text-to-speech**: Audio narration of plant descriptions

## Deployment Strategy

### Development
- **Vite dev server** with hot module replacement
- **Express server** with middleware logging
- **File-based routing** with automatic route registration
- **Environment-based configuration** for database connections

### Production Build
1. **Frontend build**: Vite compiles React app to static assets
2. **Backend build**: ESBuild bundles Express server
3. **Database migration**: Drizzle handles schema changes
4. **Static file serving**: Express serves built frontend assets

### Database Management
- **Schema definition**: Centralized in `shared/schema.ts`
- **Migration system**: Drizzle Kit for database versioning
- **Connection pooling**: Neon serverless PostgreSQL
- **Development storage**: In-memory fallback for testing

The architecture prioritizes educational accessibility, performance, and future scalability for adding advanced features like 3D visualization and AR integration.