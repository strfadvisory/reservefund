import { NextRequest } from 'next/server';
import { getLogo } from '@/lib/gridfs';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const image = await getLogo(id);
    if (!image) return new Response('Not found', { status: 404 });
    return new Response(new Uint8Array(image.buffer), {
      status: 200,
      headers: {
        'Content-Type': image.contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: any) {
    return new Response(err.message || 'Failed to load profile image', { status: 500 });
  }
}
