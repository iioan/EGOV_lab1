import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log(data);

    // OPTIONAL: basic sanity checks (keep/extend as you like)
    if (!data?.studentIdentity || !data?.academicData) {
      return NextResponse.json(
        { ok: false, error: 'Missing required slices in payload.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      receivedAt: new Date().toISOString(),
      payload: data,
    });
  } catch (e) {
    console.error('send-form error:', e);
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body.' },
      { status: 400 }
    );
  }
}
