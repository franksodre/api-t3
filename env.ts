import { config } from 'dotenv'
import { z } from 'zod';

config({ path: '.env' });

const envSchema = z.object({
  DATABASE_URI: z.string().url().min(1),
  RESEND_API_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  BASE_URL: z.string().url(),
  REDIRECT_URL: z.string().url()
})

export const env = envSchema.parse(process.env);