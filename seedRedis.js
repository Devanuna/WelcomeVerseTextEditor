import { Redis } from '@upstash/redis';
import fs from 'fs';

// Initialize Redis from your environment variable
const redis = Redis.fromEnv();

// Read your culture.json
const data = JSON.parse(fs.readFileSync('./culture.json', 'utf-8'));

// Push each entry into Redis
async function seed() {
  for (const item of data) {
    await redis.set(item.Name, JSON.stringify(item));
    console.log(`Saved ${item.Name}`);
  }
  console.log('All items saved to Redis!');
}

seed();
