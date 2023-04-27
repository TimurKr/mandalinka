import 'server-only';

import React from 'react';
import AddIngredientForm from './ingredient_form';
import { getServerSupabase } from '@/lib/auth/server-supabase-provider';

export default async function NewIngredient() {
  const supabase = getServerSupabase();

  const { data: alergens, error: alergensError } = await supabase
    .from('alergen')
    .select('id, label');

  const { data: units, error: unitsError } = await supabase
    .from('unit')
    .select('sign, name');

  if (alergensError || unitsError) {
    throw new Error('Error fetching alergens or units');
  }

  return (
    <div className="flex h-full flex-col items-center">
      <div className="my-auto py-5">
        <AddIngredientForm
          alergens={alergens.map((alergen) => ({
            value: alergen.id,
            label: `${alergen.id}: ${alergen.label}`,
          }))}
          units={units.map((unit) => ({ value: unit.sign, label: unit.name }))}
        />
      </div>
    </div>
  );
}
