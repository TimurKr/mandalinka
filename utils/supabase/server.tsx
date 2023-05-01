import 'server-only';

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';
import type { Database } from '@/utils/db.types';
import { cache } from 'react';

// do not cache this page
export const revalidate = 0;

export const getServerSupabase = cache(() => {
  return createServerComponentSupabaseClient<Database>({ headers, cookies });
});
