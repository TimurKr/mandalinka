import 'server-only';

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

// do not cache this page
export const revalidate = 0;

export function useServerSupabase() {
  return createServerComponentSupabaseClient<Database>({ headers, cookies });
}

export async function useServerAuthentificated() {
  const supabase = useServerSupabase();
  const { data: user } = await supabase.auth.getUser();
  return !!user;
}

export async function useServerUser() {
  const supabase = useServerSupabase();
  const {
    data: { user: BaseUser },
  } = await supabase.auth.getUser();

  if (!BaseUser) return null;

  const { data: ExtensionUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', BaseUser.id)
    .single();

  const user = {
    ...BaseUser,
    ...ExtensionUser,
  };

  return user;
}
