import { MultiRegionRatelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

const env = process.env.NODE_ENV as string ?? "development"

const cache = new Map();
// Create a new ratelimiter, that allows 10 requests per 2 seconds
const ratelimit = new MultiRegionRatelimit({
  redis: [
    new Redis({
      url: process.env.REDIS_US_EAST_1_URL as string,
      token: process.env.REDIS_US_EAST_1_PASSWORD as string,
    }),
    new Redis({
      url: process.env.REDIS_US_WEST_1_URL as string,
      token: process.env.REDIS_US_WEST_1_PASSWORD as string,
    }),
    new Redis({
      url: process.env.REDIS_EU_CENTRAL_1_URL as string,
      token: process.env.REDIS_EU_CENTRAL_1_PASSWORD as string,
    }),
    new Redis({
      url: process.env.REDIS_AP_NORTHEAST_1_URL as string,
      token: process.env.REDIS_AP_NORTHEAST_1_PASSWORD as string,
    }),
  ],
  limiter: MultiRegionRatelimit.slidingWindow(10, "2 s"),
  analytics: true,
  timeout: 1000,
  ephemeralCache: cache,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */ 
  prefix: `mecab-edge/ratelimit/${env}`,
});

export default async function middleware(request: NextRequest, event: NextFetchEvent): Promise<Response | undefined> {
  const ip = request.ip ?? "127.0.0.1";

  const { success, pending, limit, reset, remaining } = await ratelimit.limit(`${ip}`);
  event.waitUntil(pending);

  const res = success ? NextResponse.next() : NextResponse.json({ error: "rate limit exceeded" }, { status: 429 });

  res.headers.set("X-RateLimit-Limit", limit.toString());
  res.headers.set("X-RateLimit-Remaining", remaining.toString());
  res.headers.set("X-RateLimit-Reset", reset.toString());
  return res;
}

export const config = {
  matcher: "/api/mecab",
};