import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Create a new Redis instance
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

// Create a new Ratelimit instance
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});
