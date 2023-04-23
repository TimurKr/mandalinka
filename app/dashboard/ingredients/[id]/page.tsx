import React from "react";

// import IngredientVersionWidget from "./version_widget/version_widget";
import { useServerSupabase } from "@/lib/auth/server-supabase-provider";

export default async function Ingredient({
  params,
}: {
  params: { id: string };
}) {

  const supabase = useServerSupabase();

  const { data: ingredient } = await supabase
    .from("ingredients")
    .select('*')
    .eq("id", params.id)
    .single();

  // let current_version =
  //   ingredient.versions.find((version) => version.is_active) ||
  //   ingredient.versions.find((version) => version.is_inactive) ||
  //   ingredient.versions.find((version) => version.is_deleted) ||
  //   ingredient.versions[-1] ||
  //   undefined;

  return (
    <>
      {/* @ts-expect-error Async Server Component
      <IngredientVersionWidget
        ingredient={ingredient}
        version_id={current_version?.id}
      /> */}

      <div className="flex flex-row flex-wrap w-full">
        <pre>{JSON.stringify(ingredient, null, 2)}</pre>
      </div>
    </>
  );
}
