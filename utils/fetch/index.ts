import 'server-only';

import { cache } from 'react';
import { getServerSupabase } from '../supabase/server';

export const fetchUnits = cache(async () => {
  const supabase = getServerSupabase();

  const { data: units } = await supabase
    .from('unit')
    .select('*')
    .throwOnError();

  return units!;
});

export const fetchAlergens = cache(async () => {
  const supabase = getServerSupabase();

  const { data: alergens } = await supabase
    .from('alergen')
    .select('*')
    .throwOnError();

  return alergens!;
});
