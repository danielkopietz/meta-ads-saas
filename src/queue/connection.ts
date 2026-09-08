import IORedis from "ioredis";

import { getServerEnv } from "@/lib/env";

export function createQueueConnection() {
  const { REDIS_URL } = getServerEnv();

  if (!REDIS_URL) {
    throw new Error("REDIS_URL is required when starting the worker process.");
  }

  return new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });
}
