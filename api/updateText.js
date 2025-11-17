import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize Redis from environment variables
const redis = Redis.fromEnv();

export const GET = async () => {
  try {
    const data = await redis.get('culture');
    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    const body = await req.json();
    const content = body.content; // JSON string from frontend

    if (!content) throw new Error('No content provided');

    await redis.set('culture', JSON.parse(content));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
