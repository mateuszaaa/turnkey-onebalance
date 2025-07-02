import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.PUBLIC_ONEBALANCE_API_KEY;
    const apiUrl = process.env.PUBLIC_ONEBALANCE_API;

    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        { error: 'Missing API configuration' },
        { status: 500 }
      );
    }

    const url = new URL("/api/chains/supported-list", apiUrl);

    const response = await fetch(url, {
      headers: {
        'x-api-key': apiKey,
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let error;
      if (contentType && contentType.includes('application/json')) {
        error = await response.json();
      } else {
        const text = await response.text();
        error = { message: text, status: response.status };
      }
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Supported chains proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}