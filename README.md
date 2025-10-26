# EGOV Lab Application

A simple Next.js application with TypeScript featuring both frontend (React) and backend (API Routes) capabilities.

## 🏗️ Architecture

This project follows a clean and simple architecture:

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API Routes
│   │   ├── hello/         # Example API endpoint
│   │   └── users/         # User management API
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components (Frontend)
│   └── UserList.tsx       # Example component with API integration
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

## 🔌 API Endpoints

### GET /api/hello
Simple health check endpoint

**Response:**
```json
{
  "message": "Hello from the API!",
  "timestamp": "2025-10-26T08:00:00.000Z"
}
```

### GET /api/users
Get all users

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-10-26T08:00:00.000Z"
    }
  ]
}
```

### POST /api/users
Create a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "3",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-10-26T08:00:00.000Z"
  }
}
```

## 🛠️ Development

### TypeScript

The project uses TypeScript for both frontend and backend:
- Strict type checking enabled
- Shared types in `src/lib/types/`
- Full IntelliSense support

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
```

## 📝 Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Use functional components with hooks
- Keep components small and focused
- Use async/await for asynchronous operations

## 🔐 Environment Variables

Create a `.env.local` file for environment-specific variables:

```
# Add your environment variables here
```

## 📚 Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **UI**: React 19
- **Styling**: Tailwind CSS
- **Linting**: ESLint

## 🎯 Key Features

- ✅ TypeScript for both frontend and backend
- ✅ API Routes for backend functionality
- ✅ React components for frontend
- ✅ Shared type definitions
- ✅ Tailwind CSS for styling
- ✅ ESLint for code quality
- ✅ Simple and maintainable architecture
