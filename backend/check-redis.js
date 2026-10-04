const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

async function testRedis() {
  try {
    const pong = await redis.ping();
    console.log("Redis connected:", pong);
  } catch (err) {
    console.error("Redis connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = { testRedis, redis };