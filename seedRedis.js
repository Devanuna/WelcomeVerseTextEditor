// Load environment variables from .env
import dotenv from 'dotenv';
dotenv.config();

import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';

// Initialize Redis from environment
const redis = Redis.fromEnv();

// Path to your culture.json
const cultureFile = path.join(process.cwd(), 'Culture.json');

async function seed() {
  try {
    // Read the JSON file
    const data = fs.readFileSync(cultureFile, 'utf-8');
    const json = JSON.parse(data);

    // Save it to Redis as a single key
    await redis.set('culture', JSON.stringify(json));

    console.log('✅ Successfully seeded Upstash Redis!');
  } catch (err) {
    console.error('❌ Failed to seed Redis:', err);
  }
}

// Run the seeding
seed();
