import 'server-only';
import { getServerSupabase } from '@/utils/supabase/server';
import { cache } from 'react';

// do not cache this page
export const revalidate = 0;

export const getServerAuthentificated = cache(async () => {
  const supabase = getServerSupabase();
  const { data: user } = await supabase.auth.getUser();
  return !!user;
});

export const getServerUser = cache(async () => {
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
});
