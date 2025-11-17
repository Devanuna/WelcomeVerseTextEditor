import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (req.query.type === 'hash') {
        const hash = await redis.get('culture:hash');
        return res.status(200).json({ hash });
      } else {
        const data = await redis.get('culture');
        return res.status(200).json(data || []);
      }
    } else if (req.method === 'POST') {
      const body = await new Promise(resolve => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
      });

      if (!body.content) throw new Error('No content provided');

      await redis.set('culture', JSON.parse(body.content));

      const hash = crypto.createHash('sha1').update(body.content).digest('hex');
      await redis.set('culture:hash', hash);

      return res.status(200).json({ success: true, hash });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
