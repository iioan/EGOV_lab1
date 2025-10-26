import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello from the API!',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      message: 'Data received successfully',
      receivedData: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Invalid JSON in request body',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
