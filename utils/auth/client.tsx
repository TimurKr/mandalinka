'use client';

import type { SupabaseContext } from '@/utils/supabase/client';
import { cache } from 'react';

export const useClientUser = cache(
  async (supabase: SupabaseContext['supabase']) => {
    const { data } = await supabase.auth.getUser();
    return data?.user;
  }
);
