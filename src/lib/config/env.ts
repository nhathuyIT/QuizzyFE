import { z } from "zod";

const boolFromString = z
  .string()
  .optional()
  .transform((v) => v === "true");

export const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .default("http://localhost:3001"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Quizzy"),
  NEXT_PUBLIC_APP_VERSION: z.string().default("1.0.0"),
  NEXT_PUBLIC_ENABLE_ANALYTICS: boolFromString.default(false),
  NEXT_PUBLIC_ENABLE_DEBUG: boolFromString.default(false),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  cached = envSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG,
  });
  return cached;
}
