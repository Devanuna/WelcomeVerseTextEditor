// /api/updateText.js
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.REDIS_URL,   // REST URL from Upstash
  token: process.env.REDIS_TOKEN // REST token
});

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { content, changesCount } = req.body;
      if (!content) throw new Error('Missing content');

      // Save JSON to Redis
      await redis.set('CultureJSON', content);

      return res.status(200).json({
        message: `Амжилттай шинэчиллээ! ${changesCount || 0} өөрчлөлт`,
        changesApplied: changesCount || 0
      });
    }

    if (req.method === 'GET') {
      const data = await redis.get('CultureJSON');
      // If Redis key is missing, return empty array instead of throwing
      const jsonData = data ? JSON.parse(data) : [];
      return res.status(200).json(jsonData);
    }

    // Other methods not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('Redis API error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};
