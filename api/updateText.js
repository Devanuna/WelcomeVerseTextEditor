import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Return hash or full JSON depending on query
      if (req.query.type === 'hash') {
        const hash = await redis.get('culture:hash');
        return res.status(200).json({ hash: hash || '' });
      } else {
        const data = await redis.get('culture');
        return res.status(200).json(data ? JSON.parse(data) : []);
      }
    } 
    else if (req.method === 'POST') {
      // Read POST body
      const body = await new Promise(resolve => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
      });

      if (!body.content) throw new Error('No content provided');

      // Save the JSON to Redis
      await redis.set('culture', JSON.parse(body.content));

      // Generate simple hash: timestamp + content length
      const hash = Date.now().toString(16) + '-' + body.content.length;
      await redis.set('culture:hash', hash);

      return res.status(200).json({ success: true, hash });
    } 
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
