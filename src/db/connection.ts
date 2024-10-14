import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from "@neondatabase/serverless";

import { env } from '../../env';
import * as schema from './schemas'

const sql = neon(env.DATABASE_URI!);
export const db = drizzle(sql, { schema });