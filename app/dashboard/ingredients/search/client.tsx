'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';

import Fuse from 'fuse.js';

import { useRouter } from 'next/navigation';

import Button from '@/lib/ui/button';
import Alert from '@/lib/ui/alert';

import type { Ingredient as FullIngredient } from '@/lib/database.types';
type Ingredient = Pick<FullIngredient, 'id' | 'name' | 'search_tags'>;

export default function ClientSearch({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {
  // Declare states
  const [search, setSearch] = useState('');
  const [matchingIngredients, setMatchingIngredients] =
    useState<Ingredient[]>(ingredients);

  // Router for redirecting
  const router = useRouter();
  const selected = useSelectedLayoutSegment();

  // Fuse.js for searching
  const fuse = useMemo(
    () => new Fuse(ingredients, { keys: ['name', 'search_tags'] }),
    [ingredients]
  );

  const currentIngredient = ingredients.find(
    (ingredient) => selected == ingredient.id.toString()
  );

  const moveSelectedIngredientToTop = useCallback(
    (original: Ingredient[]): Ingredient[] => {
      if (!currentIngredient) {
        return original;
      }

      const index = original.indexOf(currentIngredient);
      if (index !== -1) {
        original.splice(index, 1);
        original.unshift(currentIngredient);
      }

      return original;
    },
    [currentIngredient]
  );

  const handleSearch = useCallback(
    (value: string) => {
      if (value === search && value !== '') {
        return;
      }
      setSearch(value);

      let results = ingredients;

      if (value !== '') {
        results = fuse.search(value).map((result) => result.item);
      }

      // Sort results to show the active first, then inactive, then deleted, then the rest
      // The current ingredient is always first
      // results.sort((a, b) => {
      //   if (a.isActive && !b.isActive) {
      //     return -1;
      //   }
      //   if (!a.isActive && b.isActive) {
      //     return 1;
      //   }
      //   if (a.isInactive && !b.isInactive) {
      //     return -1;
      //   }
      //   if (!a.isInactive && b.isInactive) {
      //     return 1;
      //   }
      //   if (a.isDeleted && !b.isDeleted) {
      //     return -1;
      //   }
      //   if (!a.isDeleted && b.isDeleted) {
      //     return 1;
      //   }
      //   if (!a.isActive && !a.isDeleted && !a.isInactive) {
      //     return 1;
      //   }
      //   if (!b.isActive && !b.isDeleted && !b.isInactive) {
      //     return -1;
      //   }
      //   return 0;
      // });
      results = moveSelectedIngredientToTop(results);
      setMatchingIngredients(results);
    },
    [fuse, ingredients, moveSelectedIngredientToTop, search]
  );

  useEffect(() => {
    handleSearch(search);
  }, [handleSearch, search]);

  function handleSubmit(event: React.ChangeEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (matchingIngredients.length === 0) {
      return;
    }
    router.push(`/dashboard/ingredients/${matchingIngredients[0].id}`);
  }

  return (
    <>
      <div className="z-10 w-full flex-none p-3 backdrop-blur">
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="searchbar"
            className="block pl-1 text-sm font-medium text-gray-700"
          >
            Hľadaj ingredienciu
          </label>
          <input
            type="text"
            name="searchbar"
            id="searchbar"
            autoComplete="off"
            className="my-2 block w-full rounded-full px-3 py-2 shadow-md hover:shadow-lg focus:shadow-lg focus:outline-primary sm:text-sm"
            placeholder={ingredients[0].name}
            value={search}
            onChange={(event) => {
              handleSearch(event.target.value);
            }}
          />
        </form>
      </div>
      <div className="z-0 w-full flex-grow overflow-y-auto">
        {matchingIngredients.length === 0 && (
          <Alert variant="warning">
            Nenašli sa žiadne výsledky pre hľadanie <strong>{search}</strong>
          </Alert>
        )}

        <ul className="h-full">
          {matchingIngredients.map((ingredient) => (
            <li key={ingredient.id} className="block p-3 py-2">
              <Button
                variant="black"
                // variant={
                //   ingredient.isActive
                //     ? 'success'
                //     : ingredient.isInactive
                //     ? 'warning'
                //     : ingredient.isDeleted
                //     ? 'danger'
                //     : 'black'
                // }
                dark={currentIngredient?.id === ingredient.id}
                href={`/dashboard/ingredients/${ingredient.id}`}
                className="inline"
                // className={`inline ${
                //   !ingredient.isActive &&
                //   !ingredient.isInactive &&
                //   !ingredient.isDeleted
                //     ? 'opacity-70'
                //     : ''
                // }`}
              >
                {ingredient.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
