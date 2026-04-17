import { NextRequest, NextResponse } from 'next/server';
import { getLogo } from '@/lib/gridfs';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getLogo(id);
    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return new NextResponse(result.buffer, {
      headers: {
        'Content-Type': result.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
