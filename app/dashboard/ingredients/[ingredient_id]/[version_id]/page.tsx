import React, { Suspense, cache } from 'react';

import { getServerSupabase } from '@/utils/supabase/server';
import { fetchUnits } from '@/utils/fetch';
import { getSingle, getArray } from '@/utils/fetch/helpers';
import { BorderedElement } from '@/lib/ui/bordered_element';
import GeneralInfo from './_components/general';
import Graph from './_components/graph';
import Loading from '@/lib/ui/loading_element';
import OrdersTable from './_components/orders_table';
import RemovalsTable from './_components/removals_table';
import IngredientVersionForm from '../_componenets/ingredient_version_form';
import InStockManipulation from './_components/in_stock_manipulation';
import StatusManipulation from './_components/status_manipulation';
import { fetchData } from './_components/fetchData';
import ClientStore from './_components/store_client';

export default async function Ingredient({
  params,
}: {
  params: { ingredient_id: string; version_id: string };
}) {
  const data = await fetchData(params.version_id);
  const { currentVersion, units } = data;

  return (
    <>
      <ClientStore data={data} />
      <div className="flex flex-wrap justify-between gap-3 overflow-visible p-2 pt-4">
        <div className="shrink-0">
          <BorderedElement title="Všeobecné informácie">
            <GeneralInfo data={currentVersion} />
          </BorderedElement>
        </div>
        <div className="flex-auto">
          <BorderedElement title="Graf">
            Graf
            <Graph />
          </BorderedElement>
        </div>
        <div className="flex-auto">
          <BorderedElement title="Objednávky">
            <Suspense fallback={<Loading />}>
              {/* @ts-expect-error Async Server Component */}
              <OrdersTable />
            </Suspense>
          </BorderedElement>
        </div>
        <div className="flex-auto">
          <BorderedElement title="Odpisy">
            <Suspense fallback={<Loading />}>
              <RemovalsTable data={currentVersion.removals} />
            </Suspense>
          </BorderedElement>
        </div>
        {currentVersion.status === 'preparation' && (
          <div className="flex-auto">
            <BorderedElement title="Upravte verziu" className="!pt-4">
              <IngredientVersionForm
                ingredient={{ id: parseInt(params.ingredient_id) }}
                initial={{
                  ...currentVersion,
                  ingredient: parseInt(params.ingredient_id),
                }}
              />
            </BorderedElement>
          </div>
        )}
        {(currentVersion.status === 'active' ||
          currentVersion.orders.length > 0 ||
          currentVersion.removals.length > 0 ||
          currentVersion.in_stock > 0) && (
          <div className="flex-initial">
            <BorderedElement title="Na sklade" className="!p-3 !pr-1">
              <InStockManipulation />
            </BorderedElement>
          </div>
        )}
        <div>
          <BorderedElement title="Zmena statusu" className="pt-3">
            <StatusManipulation
              ingredientVersion={{
                ...currentVersion,
                ingredient: parseInt(params.ingredient_id),
                orders_count: currentVersion.orders.length,
                removals_count: currentVersion.removals.length,
              }}
            />
          </BorderedElement>
        </div>
      </div>
    </>
  );
}
