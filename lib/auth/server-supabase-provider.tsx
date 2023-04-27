import 'server-only';

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';

// do not cache this page
export const revalidate = 0;

export function getServerSupabase() {
  return createServerComponentSupabaseClient<Database>({ headers, cookies });
}

export async function getServerAuthentificated() {
  const supabase = getServerSupabase();
  const { data: user } = await supabase.auth.getUser();
  return !!user;
}

export async function getServerUser() {
  const supabase = getServerSupabase();
  const {
    data: { user: BaseUser },
  } = await supabase.auth.getUser();

  if (!BaseUser) return null;

  const { data: ExtensionUser } = await supabase
    .from('user')
    .select('*')
    .eq('id', BaseUser.id)
    .single();

  const user = {
    ...BaseUser,
    ...ExtensionUser,
  };

  return user;
}
