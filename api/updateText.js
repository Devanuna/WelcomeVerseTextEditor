import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const redis = Redis.fromEnv();

// Create SHA256 hash from JSON string
function makeHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export default async function handler(req, res) {
  // ------------------ GET ------------------
  if (req.method === 'GET') {
    try {
      const data = await redis.get('culture');           // your JSON
      const hash = await redis.get('culture:hash');      // your fingerprint

      res.status(200).json({
        hash: hash || null,
        data: data || []
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  // ------------------ POST ------------------
  if (req.method === 'POST') {
    try {
      const body = await new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
      });

      if (!body.content) throw new Error('No content provided');

      const parsed = JSON.parse(body.content);
      const hash = makeHash(body.content);

      // Save data + hash
      await redis.set('culture', parsed);
      await redis.set('culture:hash', hash);

      res.status(200).json({
        success: true,
        hash
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
