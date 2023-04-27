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
import { getServerSupabase } from '@/lib/auth/server-supabase-provider';
import { getArray, getSingle } from '@/lib/supabase/fetch-helpers';
import OrdersTable from './orders_table';
import VersionSelector from '../../_componenets/version_selector';
import RemovalsTable from './removals_table';
import IngredientVersionForm from '../../_componenets/ingredient_version_form';

// const OrdersTable = dynamic(() => import("./orders_table"), { ssr: false });

// const RemovalsTable = dynamic(() => import("./removals_table"), { ssr: false });

export default async function IngredientVersionWidget({
  ingredient_id,
  version_id,
}: {
  ingredient_id: number;
  version_id: number;
}) {
  const supabase = getServerSupabase();

  const versionsPromise = supabase
    .from('ingredient_version')
    .select(
      `
      id,
      status,
      created_at
      `
    )
    .eq('ingredient', ingredient_id)
    .throwOnError();

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
        status,
        ordered_at,
        delivery_at,
        expires_at,
        amount, 
        unit,
        in_stock,
        cost
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

  const unitsPromise = supabase.from('unit').select('*').throwOnError();

  const [
    { data: versionsData, error: versionsError },
    { data: currentVersionData, error: currentVersionError },
    { data: units, error: unitsError },
  ] = await Promise.all([versionsPromise, currentVersionPromise, unitsPromise]);

  if (
    versionsError ||
    unitsError ||
    currentVersionError ||
    !versionsData ||
    !currentVersionData ||
    !units
  ) {
    throw new Error(
      'Error loading ingredient: ' + versionsError?.message ||
        currentVersionError?.message ||
        unitsError?.message ||
        "Didn't receive data from server"
    );
  }

  const versions = versionsData;

  const currentVersion = {
    ...currentVersionData,
    unit: getSingle(getSingle(currentVersionData.ingredient).unit),
    orders: getArray(currentVersionData.orders),
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
              <OrdersTable
                data={currentVersion.orders}
                modify_url={`${process.env.CLIENT_API_URL}/management/ingredients/stock_orders/`}
              />
            </Suspense>
          </BorderedElement>
        </div>
        <div className="flex-auto">
          <BorderedElement title="Odpisy">
            <Suspense fallback={<Loading />}>
              <RemovalsTable
                data={currentVersion.removals}
                delete_url={`${process.env.CLIENT_API_URL}/management/ingredients/stock_removals/`}
              />
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
        {/* {(current_version.is_active ||
            current_version.orders.length > 0 ||
            current_version.removals.length > 0 ||
            current_version.in_stock_amount > 0) && (
            <div className="flex-initial">
              <BorderedElement title="Na sklade" className="!p-3 !pr-1">
                <InStockManipulation
                  ingredientVersion={current_version}
                  units={units}
                  CLIENT_API_URL={process.env.CLIENT_API_URL || ""}
                />
              </BorderedElement>
            </div>
          )} */}
        <div>
          <BorderedElement title="Zmena statusu" className="pt-3">
            {/* <StatusManipulation
                ingredientVersion={current_version}
                CLIENT_API_URL={process.env.CLIENT_API_URL || ""}
              /> */}
          </BorderedElement>
        </div>
      </div>
    </>
  );
}
