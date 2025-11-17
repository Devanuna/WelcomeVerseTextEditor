import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (req.query.type === 'hash') {
        const hash = await redis.get('culture:hash');
        return res.status(200).json({ hash: hash || '' });
      } else {
        const data = await redis.get('culture');
        return res.status(200).json(data ? JSON.parse(data) : []);
      }
    } 
    else if (req.method === 'POST') {
      // Use req.json() instead of req.on('data')
      const body = await req.json();

      if (!body.content) throw new Error('No content provided');

      await redis.set('culture', JSON.parse(body.content));

      const hash = Date.now().toString(16) + '-' + body.content.length;
      await redis.set('culture:hash', hash);

      return res.status(200).json({ success: true, hash });
    } 
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
