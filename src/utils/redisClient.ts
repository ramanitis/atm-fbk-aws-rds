import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:4546";

const redis = createClient({ url: redisUrl });

redis.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

export {
    redis as redisCleint,
    connectRedis
}
