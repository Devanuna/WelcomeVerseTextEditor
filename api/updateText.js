import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const dataStr = await redis.get('culture') || '[]';
      const hash = await redis.get('culture_hash') || '';
      const data = JSON.parse(dataStr);
      res.status(200).json({ data, hash });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const body = await new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
      });

      if (!body.content) throw new Error('No content provided');

      // Save JSON
      const contentStr = JSON.stringify(JSON.parse(body.content));
      await redis.set('culture', contentStr);

      // Compute hash
      const hash = crypto.createHash('sha256').update(contentStr).digest('hex');
      await redis.set('culture_hash', hash);

      res.status(200).json({ success: true, hash });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
