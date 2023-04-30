import 'server-only';

import React from 'react';
import AddIngredientForm from './ingredient_form';
import { getServerSupabase } from '@/utils/supabase/server';
import { useStore } from '@/utils/zustand';
import ClientStore from '@/utils/zustand/client';

export default async function NewIngredient() {
  const supabase = getServerSupabase();

  const { data: alergens } = await supabase
    .from('alergen')
    .select('id, label')
    .throwOnError();

  if (!alergens) {
    throw new Error('No alergens fetched.');
  }

  useStore.setState({ alergens });

  return (
    <div className="flex h-full flex-col items-center">
      <ClientStore data={{ alergens }} />
      <div className="my-auto py-5">
        <AddIngredientForm />
      </div>
    </div>
  );
}
