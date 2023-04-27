import React from 'react';

import IngredientVersionWidget from './version_widget';

export default async function Ingredient({
  params,
}: {
  params: { ingredient_id: string; version_id: string };
}) {
  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <IngredientVersionWidget
        ingredient_id={parseInt(params.ingredient_id)}
        version_id={parseInt(params.version_id)}
      />
    </>
  );
}
