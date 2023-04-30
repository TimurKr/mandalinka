import 'server-only';

import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
// import VersionSelector from "./version_selector";
import { BorderedElement } from '@/lib/ui/bordered_element';
import GeneralInfo from './general';
// import InStockManipulation from "./in_stock_manipulation";
import Graph from './graph';
// import StatusManipulation from "./status_manipulation";
import { Suspense } from 'react';
import Loading from '@/lib/ui/loading_element';
import { getServerSupabase } from '@/utils/supabase/server';
import { getArray, getSingle } from '@/utils/fetch/helpers';
import OrdersTable from './orders_table';
import RemovalsTable from './removals_table';
import IngredientVersionForm from '../../_componenets/ingredient_version_form';
import InStockManipulation from './in_stock_manipulation';
import StatusManipulation from './status_manipulation';
import { useStore } from '@/utils/zustand';

// const RemovalsTable = dynamic(() => import("./removals_table"), { ssr: false });

export default async function IngredientVersionWidget({
  ingredient_id,
  version_id,
}: {
  ingredient_id: number;
  version_id: number;
}) {
  const supabase = getServerSupabase();

  const currentVersionPromise = supabase
    .from('ingredient_version')
    .select(
      `
      id,
      cost,
      created_at,
      expiration_period,
      in_stock,
      source,
      status,
      status_changed_at,
      ingredient (unit),
      orders:ingredient_version_order (
        id,
        ingredient_version,
        status,
        ordered_at,
        delivery_at,
        expires_at,
        amount, 
        unit,
        in_stock,
        cost,
        status_changed_at
        ),
      removals:ingredient_version_removal (
        id,
        removed_at,
        amount,
        unit,
        reason,
        extra_info
        )
      `
    )
    .eq('id', version_id)
    .order('delivery_at', {
      foreignTable: 'ingredient_version_order',
      ascending: false,
    })
    .order('removed_at', {
      foreignTable: 'ingredient_version_removal',
      ascending: false,
    })
    .single()
    .throwOnError();

  const [{ data: currentVersionData, error: currentVersionError }] =
    await Promise.all([currentVersionPromise]);

  if (currentVersionError || !currentVersionData) {
    throw new Error(
      'Error loading ingredient: ' + currentVersionError?.message ||
        "Didn't receive data from server"
    );
  }

  const units = useStore.getState().units;

  const currentVersion = {
    ...currentVersionData,
    unit: getSingle(getSingle(currentVersionData.ingredient).unit),
    orders: getArray(currentVersionData.orders).sort(
      // First, awaiting order, then ordered, then delivered then rest, secondly by status_changed_at
      (a, b) => {
        const statusOrder = {
          awaiting_order: 0,
          ordered: 1,
          delivered: 2,
          canceled: 3,
          expired: 3,
        };
        return (
          statusOrder[a.status] - statusOrder[b.status] ||
          (a.status_changed_at < b.status_changed_at ? 1 : -1)
        );
      }
    ),
    removals: getArray(currentVersionData.removals),
    ingredient: getSingle(currentVersionData.ingredient),
  };

  if (!currentVersion)
    throw new Error('No such version belongs to this ingredient');

  return (
    <>
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
              <OrdersTable data={currentVersion.orders} />
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
                ingredient={{ id: ingredient_id }}
                initial={{}}
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
              <InStockManipulation
                ingredientVersion={{
                  ...currentVersion,
                  unit: useStore
                    .getState()
                    .units.find((u) => u.sign === currentVersion.unit)!,
                }}
              />
            </BorderedElement>
          </div>
        )}
        <div>
          <BorderedElement title="Zmena statusu" className="pt-3">
            <StatusManipulation
              ingredientVersion={{
                ...currentVersion,
                ingredient: ingredient_id,
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
