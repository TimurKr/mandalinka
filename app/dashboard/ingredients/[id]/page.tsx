import React from 'react';

import IngredientVersionWidget from "./version_widget/version_widget";
import { useServerSupabase } from '@/lib/auth/server-supabase-provider';

export default async function Ingredient({
  params,
}: {
  params: { id: string };
}) {
  const supabase = useServerSupabase();

  const { data: ingredient } = await supabase
    .from('ingredients')
    .select('* , ingredient_versions ( * )')
    .eq('id', params.id)
    .single();



  let current_version: number | undefined;

  if (ingredient?.ingredient_versions) {
    let versions = [ingredient.ingredient_versions].flat();
    current_version = versions.find((version) => version.status === "active")?.id ||
    versions.find((version) => version.status === "preparation")?.id ||
    versions.find((version) => version.status === "archived")?.id ||
    versions.pop()?.id ||
    undefined;
  }

  return (
    <>
    {current_version && 
    (
      <>
      {/* @ts-expect-error Async Server Component */}
      <IngredientVersionWidget
        ingredient_id={parseInt(params.id)}
        version_id={current_version}
      />
      </>
    )}
    </>
  );
}
