import 'server-only';

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

// do not cache this page
export const revalidate = 0;

export function useServerSupabase() {
  return createServerComponentSupabaseClient<Database>({ headers, cookies });
}

export async function useServerUser() {
  const {
    data: { user },
    error,
  } = await useServerSupabase().auth.getUser();
  return user;
}
