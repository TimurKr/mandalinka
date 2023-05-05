import 'server-only';

import React from 'react';

import IngredientVersionForm from '../_componenets/ingredient_version_form';
import { BorderedElement } from '@/lib/ui/bordered_element';
import VersionSelector from '../_componenets/version_selector';
import { getServerSupabase } from '@/utils/supabase/server';

export default async function Ingredient({
  params,
}: {
  params: { ingredient_id: string; version_id: string };
}) {
  const supabase = getServerSupabase();

  const { data: versions } = await supabase
    .from('ingredient_version')
    .select('id, status, created_at')
    .eq('ingredient', params.ingredient_id)
    .throwOnError();
  if (!versions) throw new Error('No object returned from supabase');

  return (
    <IngredientVersionForm
      ingredient={{ id: parseInt(params.ingredient_id) }}
      initial={{}}
    />
  );
}
