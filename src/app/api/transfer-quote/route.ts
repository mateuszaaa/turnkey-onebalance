import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { account, amount, recipientAccountId, aggregatedAssetId } = body;

    if (!account || !amount || !recipientAccountId || !aggregatedAssetId) {
      return NextResponse.json(
        { error: 'Missing required fields: account, amount, recipientAccountId, or aggregatedAssetId' },
        { status: 400 }
      );
    }

    const apiKey = process.env.PUBLIC_ONEBALANCE_API_KEY;
    const apiUrl = process.env.PUBLIC_ONEBALANCE_API;

    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        { error: 'Missing API configuration' },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiUrl}/api/quotes/transfer-quote`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account,
        amount,
        recipientAccountId,
        aggregatedAssetId,
      }),
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
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}