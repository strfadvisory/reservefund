import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  const countrycode = request.nextUrl.searchParams.get('countrycode') || 'us';
  if (!q || !q.trim()) {
    return NextResponse.json({ error: 'Missing q' }, { status: 400 });
  }

  const key = (process.env.OPENCAGEDATAKEY || '').trim();
  if (!key) {
    return NextResponse.json(
      { error: 'OpenCage API key not configured' },
      { status: 500 },
    );
  }

  try {
    const url = new URL('https://api.opencagedata.com/geocode/v1/json');
    url.searchParams.set('q', q.trim());
    url.searchParams.set('key', key);
    url.searchParams.set('limit', '1');
    url.searchParams.set('no_annotations', '1');
    if (countrycode) url.searchParams.set('countrycode', countrycode);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.status?.message || 'Geocode failed' },
        { status: res.status },
      );
    }

    const first = data.results?.[0];
    if (!first) return NextResponse.json({ result: null });

    const c = first.components || {};
    const city =
      c.city ||
      c.town ||
      c.village ||
      c.hamlet ||
      c.municipality ||
      c.county ||
      '';
    const result = {
      formatted: first.formatted || '',
      city,
      state: c.state || '',
      stateCode: c.state_code || '',
      country: c.country || '',
      countryCode: (c.country_code || '').toUpperCase(),
      postcode: c.postcode || '',
      road: c.road || '',
      suburb: c.suburb || c.neighbourhood || '',
    };
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Geocode failed' },
      { status: 500 },
    );
  }
}
