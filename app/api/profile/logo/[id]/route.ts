import { NextRequest } from 'next/server';
import { getLogo } from '@/lib/gridfs';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const logo = await getLogo(id);
    if (!logo) return new Response('Not found', { status: 404 });
    return new Response(new Uint8Array(logo.buffer), {
      status: 200,
      headers: {
        'Content-Type': logo.contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: any) {
    return new Response(err.message || 'Failed to load logo', { status: 500 });
  }
}
