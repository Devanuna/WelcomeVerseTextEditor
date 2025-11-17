// seedRedis.js
import { Redis } from '@upstash/redis';
import fs from 'fs';

const redis = Redis.fromEnv();

async function seed() {
  try {
    const content = fs.readFileSync('./Culture.json', 'utf-8'); // make sure path is correct
    await redis.set('CultureJSON', content);
    console.log('Redis seeded successfully!');
  } catch (e) {
    console.error('Error seeding Redis:', e);
  }
}

seed();
