// import VersionSelector from "./version_widget/version_selector";
import Image from 'next/image';

import Button from '@/lib/ui/button';
import { BorderedElement } from '@/lib/ui/bordered_element';
import { getServerSupabase } from '@/utils/supabase/server';
import ImageElement from './_componenets/image';
import VersionSelector from './_componenets/version_selector';
import { getArray } from '@/utils/fetch/helpers';
import { useSelectedLayoutSegment } from 'next/navigation';
import { IngredientVersion } from '@/utils/db.types';
import ClientStore from '@/utils/zustand/client';
import { useStore } from '@/utils/zustand';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { ingredient_id: string };
}) {
  const supabase = getServerSupabase();

  const ingredientPromise = supabase
    .from('ingredient')
    .select(
      `
      id, 
      name, 
      img,
      in_stock,
      unit,
      alergens:alergen (id, label),
      extra_info,
      versions:ingredient_version (id, status, version_number)
    `
    )
    .eq('id', params.ingredient_id)
    .single();

  const alergensPromise = supabase
    .from('alergen')
    .select('*')
    .order('id', { ascending: true });

  const [
    { data: ingredientData, error: ingredientError },
    { data: alergens, error: alergensError },
  ] = await Promise.all([ingredientPromise, alergensPromise]);

  if (ingredientError || alergensError || !ingredientData || !alergens) {
    throw new Error(
      `Error loading ingredient: ${ingredientError?.message} | Alergens: ${alergensError?.message}`
    );
  }

  useStore.setState({ alergens });

  const ingredient = {
    ...ingredientData,
    alergens: getArray(ingredientData.alergens),
    versions: getArray(ingredientData.versions),
    status:
      getArray(ingredientData.versions).find(
        (version) => version.status === 'active'
      )?.status ??
      getArray(ingredientData.versions).find(
        (version) => version.status === 'preparation'
      )?.status ??
      getArray(ingredientData.versions).find(
        (version) => version.status === 'archived'
      )?.status ??
      ('uninmplemented' as IngredientVersion['status'] | 'uninmplemented'),
  };

  return (
    <div className="flex w-full max-w-6xl flex-row flex-wrap self-start justify-self-center">
      <ClientStore data={{ alergens }} />
      <div className="w-full flex-shrink-0 p-2">
        <h3
          className={`text-4xl ${
            ingredient.status === 'active'
              ? 'text-green-500'
              : ingredient.status === 'preparation'
              ? 'text-red-500'
              : ingredient.status === 'archived'
              ? 'text-yellow-500'
              : 'text-gray-500'
          }`}
        >
          {ingredient.name}
        </h3>
      </div>
      <div className="aspect-square shrink-0 basis-full p-2 md:basis-1/3">
        <ImageElement
          path={ingredient.img ?? undefined}
        />
      </div>
      <div className="shrink-0 flex-grow basis-full p-2 md:basis-2/3">
        <BorderedElement title="Graf">
          <p>TODO: Graf používanie v minulosti</p>
        </BorderedElement>
      </div>
      <div className="flex-1 basis-1/4 p-2">
        <BorderedElement title="Extra info">
          {ingredient.extra_info ? (
            <p>{ingredient.extra_info.toString()}</p>
          ) : (
            <p className="text-sm text-gray-400">N/A</p>
          )}
        </BorderedElement>
      </div>
      <div className="flex-1 shrink-0 basis-1/4 p-2">
        <BorderedElement title="Alergény">
          <p className="">
            {(ingredient.alergens &&
              [ingredient.alergens].flat().map((alergen) => (
                <span
                  key={alergen.id}
                  className="mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                >
                  {alergen.label}
                </span>
              ))) || <p className="text-sm text-gray-400">N/A</p>}
          </p>
        </BorderedElement>
      </div>
      <div className="flex-1 basis-1/4 p-2">
        <BorderedElement title="Cena">
          <p className="text-sm text-gray-400">N/A</p>
          {/* {ingredient.cost ? (
            <p>{ingredient.cost.toString()} €</p>
          ) : (
            <p className="text-sm text-gray-400">N/A</p>
          )} */}
        </BorderedElement>
      </div>
      <div className="flex-1 basis-1/4 p-2">
        <BorderedElement title="Na sklade">
          <p className="px-2">
            {ingredient.in_stock} {ingredient.unit}
          </p>
        </BorderedElement>
      </div>
      <div className="flex-1 basis-1/4 p-2">
        <Button
          variant="black"
          href={`/dashboard/ingredients/${ingredient.id.toString()}`}
        >
          Edit
        </Button>
      </div>

      <div className="mt-4 min-h-[256px] basis-full p-2">
        <BorderedElement title="Verzie">
          <VersionSelector versions={getArray(ingredient.versions)} />
          {children}
        </BorderedElement>
      </div>
    </div>
  );
}
