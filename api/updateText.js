// /api/updateText.js
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await redis.get('CultureJSON');
      return res.status(200).json(data ? JSON.parse(data) : []);
    }

    if (req.method === 'POST') {
      const { content, changesCount } = req.body;

      if (!content) throw new Error('Missing content');

      await redis.set('CultureJSON', content);

      return res.status(200).json({
        message: `Амжилттай шинэчиллээ! ${changesCount || 0} өөрчлөлт`,
        changesApplied: changesCount || 0
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (e) {
    console.error('updateText error:', e);
    return res.status(500).json({ message: e.message });
  }
}
