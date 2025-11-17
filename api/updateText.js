// /api/updateText.js
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv(); // uses REDIS_URL and REDIS_TOKEN automatically

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { content, changesCount } = req.body;
      if (!content) throw new Error('Missing content');

      // Save JSON to Redis
      await redis.set("CultureJSON", content);

      return res.status(200).json({
        message: `Амжилттай шинэчиллээ! ${changesCount || 0} өөрчлөлт`,
        changesApplied: changesCount || 0
      });
    }

    if (req.method === 'GET') {
      const data = await redis.get("CultureJSON");
      // Return empty array if Redis is empty
      return res.status(200).json(data ? JSON.parse(data) : []);
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (err) {
    console.error('Redis API error:', err.message);
    return res.status(500).json({ message: err.message });
  }
}
