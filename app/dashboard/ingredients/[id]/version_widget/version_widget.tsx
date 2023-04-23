import "server-only";

import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import VersionSelector from "./version_selector";
import { BorderedElement } from "@/lib/ui/bordered_element";
import GeneralInfo from "./general";
import InStockManipulation from "./in_stock_manipulation";
import Graph from "./graph";
import StatusManipulation from "./status_manipulation";
import { Suspense } from "react";
import Loading from "@/lib/ui/loading_element";
import { useServerSupabase } from "@/lib/auth/server-supabase-provider";

// const OrdersTable = dynamic(() => import("./orders_table"), { ssr: false });

// const RemovalsTable = dynamic(() => import("./removals_table"), { ssr: false });

export default async function IngredientVersionWidget({
  ingredient_id,
  version_id,
}: {
  ingredient_id: number;
  version_id: number;
}) {

  const supabase = useServerSupabase();

  const parentIngredientPromise = supabase
    .from("ingredients")
    .select(`unit`)
    .eq("id", ingredient_id)
    .single();

  const allVersionsPromise = supabase
  .from("ingredient_versions")
  .select(`
      id,
      status,
      created_at
    
  `)
  .eq("ingredient", ingredient_id)
  .single();

  const currentVersionPromise = supabase
    .from("ingredient_versions")
    .select(`
      cost,
      created_at,
      expiration_period,
      id,
      in_stock,
      source,
      status,
      status_changed_at`)
    .eq("id", version_id)
    .single();

  const unitsPromise = supabase.from("units").select("*");

  const [
    { data: parentIngredient, error: parentIngredientError},
    { data: allVersions, error: allVersionsError },
    { data: currentVersion, error: currentVersionError },
    { data: units, error: unitsError },
  ] = await Promise.all([parentIngredientPromise, allVersionsPromise, currentVersionPromise, unitsPromise]);

  if (parentIngredientError || allVersionsError || currentVersionError || unitsError) {
    throw new Error("Error loading ingredient: " + parentIngredientError?.message || allVersionsError?.message || currentVersionError?.message || unitsError?.message);
  }

  if (!allVersions || !currentVersion || !units || !parentIngredient) {
    return notFound();
  }

    return (
      <BorderedElement
        className={`relative !p-0 ${
          currentVersion.status === "active"
            ? "!border-green-600"
            : currentVersion.status === "preparation"
            ? "!border-yellow-600"
            : currentVersion.status === "archived"
            ? "!border-red-600"
            : "!border-gray-600"
        }`}
      >
        {/* <div>
          <VersionSelector all_versions={allVersions} current_id={version_id} />
        </div> */}
        <div className="flex flex-wrap justify-between gap-3 overflow-visible p-2 pt-4">
          <div className="shrink-0">
            <BorderedElement title="Všeobecné informácie">
              <GeneralInfo source={currentVersion.source} cost={currentVersion.cost} unit_sign={units.find(unit => unit.id === parentIngredient.unit)?.sign || "N/A"}  />
            </BorderedElement>
          </div>
          <div className="flex-auto">
            <BorderedElement title="Graf">
              Graf
              {/* <Graph data={current_version} /> */}
            </BorderedElement>
          </div>
          <div className="flex-auto">
            <BorderedElement title="Objednávky">
              <Suspense fallback={<Loading />}>
                {/* <OrdersTable
                  data={current_version}
                  modify_url={`${process.env.CLIENT_API_URL}/management/ingredients/stock_orders/`}
                /> */}
              </Suspense>
            </BorderedElement>
          </div>
          <div className="flex-auto">
            <BorderedElement title="Odpisy">
              <Suspense fallback={<Loading />}>
                {/* <RemovalsTable
                  data={current_version}
                  delete_url={`${process.env.CLIENT_API_URL}/management/ingredients/stock_removals/`}
                /> */}
              </Suspense>
            </BorderedElement>
          </div>
          {/* {current_version.is_inactive && (
            <div className="flex-auto">
              <BorderedElement title="Upravte verziu" className="!pt-4">
                <IngredientVersionForm
                  submit_url={`${process.env.CLIENT_API_URL}/management/ingredients/versions/${current_version.id}/`}
                  method="PATCH"
                  ingredient={ingredient}
                  initial={current_version}
                />
              </BorderedElement>
            </div>
          )} */}
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
      </BorderedElement>
    );
  
}


// return (
//   <BorderedElement className="!border-primary-600 !p-0">
//     <div className="relative h-full w-full overflow-visible p-2 pt-4">
//       <VersionSelector ingredient={ingredient} />
//       <IngredientVersionForm
//         title="Nová verzia ingrediencie"
//         submit_url={`${process.env.CLIENT_API_URL}/management/ingredients/new_version/`}
//         method="POST"
//         ingredient={ingredient}
//       />
//     </div>
//   </BorderedElement>
// );
