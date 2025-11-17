import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function POST(req) {
  try {
    const body = await req.json();
    const { content, hash } = body;
    if (!content || !hash) return new Response(JSON.stringify({ message:'Missing content or hash' }), { status:400 });

    // Save JSON + hash in Redis
    await redis.set('CultureJSON', content);
    await redis.set('CultureHash', hash);

    return new Response(JSON.stringify({ message:'Saved successfully', hash }), { status:200 });
  } catch(e) {
    return new Response(JSON.stringify({ message: e.message }), { status:500 });
  }
}

export async function GET() {
  try {
    const content = await redis.get('CultureJSON');
    const hash = await redis.get('CultureHash');
    return new Response(JSON.stringify({ content, hash }), { status:200 });
  } catch(e) {
    return new Response(JSON.stringify({ message:e.message }), { status:500 });
  }
}
