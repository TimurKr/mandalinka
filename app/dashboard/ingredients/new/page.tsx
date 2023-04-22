import 'server-only';

import React from 'react';
import AddIngredientForm from './ingredient_form';

export default async function NewIngredient() {
  return (
    <div className="grid h-full place-content-center">
      <AddIngredientForm
        alergens={[
          { value: 1, label: 'aler1' },
          { value: 2, label: 'aler2' },
        ]}
        units={[
          { value: 1, label: 'unit1' },
          { value: 2, label: 'unit2' },
        ]}
      />
    </div>
  );
}
