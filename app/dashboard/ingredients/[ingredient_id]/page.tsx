import { getServerSupabase } from '@/utils/supabase/server';
import { getArray } from '@/utils/fetch/helpers';
import { notFound, redirect } from 'next/navigation';

export default async function Ingredient({
  params,
}: {
  params: { ingredient_id: string };
}) {
  const supabase = getServerSupabase();

  const { data } = await supabase
    .from('ingredient_version')
    .select('id, status')
    .eq('ingredient', params.ingredient_id)
    .throwOnError();
  if (!data) return notFound();

  const versions = getArray(data);

  if (versions.length === 0)
    return redirect(
      `/dashboard/ingredients/${params.ingredient_id}/new_version`
    );

  let current_version =
    versions.find((version) => version.status === 'active')?.id ||
    versions.find((version) => version.status === 'preparation')?.id ||
    versions.find((version) => version.status === 'archived')?.id ||
    versions[0].id;

  redirect(`/dashboard/ingredients/${params.ingredient_id}/${current_version}`);
}
