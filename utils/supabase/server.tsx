import 'server-only';

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';
import type { Database } from '@/utils/db.types';

// do not cache this page
export const revalidate = 0;

export function getServerSupabase() {
  return createServerComponentSupabaseClient<Database>({ headers, cookies });
}
