# ResolveAI: B2B Multi-Tenant Support CRM

ResolveAI is a full-stack Next.js web application built to serve as an AI-powered customer support CRM. It demonstrates complex data modeling, a robust vanilla CSS design system, and abstract AI integration interfaces.

## Features
- **Unified Split-Pane Inbox**: Complex layout displaying dynamic support tickets.
- **AI Triage & Drafting**: Extracts sentiment, calculates urgency, and suggests response drafts.
- **Analytics Dashboard**: Custom CSS charts and KPI aggregations.
- **Vanilla CSS Design System**: Lightweight, highly customizable, and premium aesthetic.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Vanilla CSS.
- **Backend**: Next.js Server Components.
- **Database**: SQLite with Prisma ORM.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup the Database
```bash
# Push schema to SQLite DB
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed database with dummy enterprise data
npx tsx prisma/seed.ts
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.
