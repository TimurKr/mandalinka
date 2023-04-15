import 'server-only';

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';

// do not cache this page
export const revalidate = 0;

export function useServerSupabase() {
  return createServerComponentSupabaseClient({ headers, cookies });
}

export async function useServerUser() {
  const { data, error } = await useServerSupabase().auth.getUser();
  return data?.user;
}
