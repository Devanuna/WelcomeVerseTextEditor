import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { content, changesCount } = req.body;
      if (!content) throw new Error('Missing content');

      // Save JSON to Redis
      await redis.set('CultureJSON', content);

      res.status(200).json({
        message: `Амжилттай шинэчиллээ! ${changesCount || 0} өөрчлөлт`,
        changesApplied: changesCount || 0,
      });
    } catch (e) {
      console.error('Redis update error:', e.message);
      res.status(500).json({ message: e.message });
    }
  } else if (req.method === 'GET') {
    try {
      const data = await redis.get('CultureJSON');
      if (!data) throw new Error('No data found');
      res.status(200).json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
