import { NextResponse } from 'next/server';
import { User, ApiResponse } from '@/lib/types';

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
    
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: body.name,
      email: body.email,
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
