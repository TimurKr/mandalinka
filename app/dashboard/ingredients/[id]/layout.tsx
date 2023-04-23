// import VersionSelector from "./version_widget/version_selector";
import Image from 'next/image';

import Button from '@/lib/ui/button';
import { BorderedElement } from '@/lib/ui/bordered_element';
import { useServerSupabase } from '@/lib/auth/server-supabase-provider';
import ImageElement from './componenets/image';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const supabase = useServerSupabase();

  const ingredientPromise = supabase
    .from('ingredients')
    .select(
      `
      id, 
      name, 
      img,
      alergens (id, label),
      extra_info
    `
    )
    .eq('id', params.id)
    .single();

  const alergensPromise = supabase
    .from('alergens')
    .select('*')
    .order('id', { ascending: true });

  const unitsPromise = supabase.from('units').select('*');

  const [
    { data: ingredient, error: ingredientError },
    { data: alergens, error: alergensError },
    { data: units, error: unitsError },
  ] = await Promise.all([ingredientPromise, alergensPromise, unitsPromise]);

  if (
    ingredientError ||
    alergensError ||
    unitsError ||
    !ingredient ||
    !alergens ||
    !units
  ) {
    throw new Error(
      `Error loading ingredient: ${ingredientError?.message} | Alergens: ${alergensError?.message} | Units: ${unitsError?.message}`
    );
  }

  return (
    <div className="flex w-full max-w-6xl flex-row flex-wrap self-start justify-self-center">
      <div className="w-full flex-shrink-0 p-2">
        <h3
          className="text-4xl"
          // className={`text-4xl ${
          //   ingredient.is_active
          //     ? "text-green-500"
          //     : ingredient.is_deleted
          //     ? "text-red-500"
          //     : ingredient.is_inactive
          //     ? "text-yellow-500"
          //     : "text-gray-500"
          // }`}
        >
          {ingredient.name}
        </h3>
      </div>
      <div className="aspect-square shrink-0 basis-full p-2 md:basis-1/3">
        <ImageElement path={ingredient.img ? 'ingredients/' + ingredient.img : undefined} />
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
          <p className="text-sm text-gray-400">N/A</p>
          {/* {ingredient.in_stock_amount} {ingredient.unit.sign} */}
        </BorderedElement>
      </div>
      <div className="flex-1 basis-1/4 p-2">
        <Button
          variant="black"
          href={`/management/ingredients/${ingredient.id}/edit/`}
        >
          Edit
        </Button>
      </div>

      <div className="mt-4 min-h-[256px] basis-full p-2">{children}</div>
    </div>
  );
}
