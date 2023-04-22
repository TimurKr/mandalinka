// import { Ingredient } from "@/components/fetching/ingredients_list";
import Button from '@/lib/ui/button';

import { useServerSupabase } from '@/lib/auth/server-supabase-provider';

import ClientSearch from './client';

export default async function Search() {
  const supabase = useServerSupabase();

  const { data, error } = await supabase
    .from('ingredients')
    .select('id, name, search_tags');

  if (error) throw error;

  return (
    <div className="flex h-full w-[15rem] flex-col">
      <ClientSearch ingredients={data} />
      <div className="z-10 w-full flex-none p-3 backdrop-blur">
        <Button variant="primary" dark href="/management/ingredients/new">
          Pridať novú ingredienciu
        </Button>
      </div>
    </div>
  );
}
