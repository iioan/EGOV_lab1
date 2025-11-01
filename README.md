# EGOV Lab Application

A simple Next.js application with TypeScript featuring both frontend (React) and backend (API Routes) capabilities.

## 🏗️ Architecture

This project follows a clean and simple architecture:

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API Routes
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components (Frontend)
└── lib/                   # Shared utilities
    └── types/             # TypeScript type definitions
        └── index.ts       # Shared types for frontend & backend
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

### Frontend (React + TypeScript)

- **Pages**: Located in `src/app/` using Next.js App Router
- **Components**: Reusable React components in `src/components/`
- **Styling**: Tailwind CSS for utility-first styling

### Backend (API Routes + TypeScript)

- **API Routes**: Located in `src/app/api/`
- **Type Safety**: Shared TypeScript types in `src/lib/types/`
