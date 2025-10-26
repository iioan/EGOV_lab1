import { NextResponse } from 'next/server';
import { User, ApiResponse } from '@/lib/types';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory storage for demonstration (in production, use a database)
const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: new Date().toISOString(),
  },
];

// Initialize nextId based on existing users
let nextId = Math.max(...users.map(u => parseInt(u.id)), 0) + 1;

// GET /api/users - Get all users
export async function GET() {
  const response: ApiResponse<User[]> = {
    success: true,
    data: users,
  };
  
  return NextResponse.json(response);
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Name is required and must be a non-empty string',
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    if (!body.email || typeof body.email !== 'string') {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Email is required and must be a string',
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    // Basic email validation
    if (!EMAIL_REGEX.test(body.email)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid email format',
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    const newUser: User = {
      id: (nextId++).toString(), // Use incrementing ID
      name: body.name.trim(),
      email: body.email.trim(),
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    
    const response: ApiResponse<User> = {
      success: true,
      data: newUser,
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user',
    };
    
    return NextResponse.json(response, { status: 400 });
  }
}
