import { Suspense } from 'react';
import Loading from '@/lib/ui/loading_element';
import Search from './_components/search/server';
import { getServerSupabase } from '@/utils/supabase/server';
import ClientStore from '@/utils/zustand/client';
import { useStore } from '@/utils/zustand';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getServerSupabase();

  const { data: units, error } = await supabase
    .from('unit')
    .select('*')
    .throwOnError();

  if (!units) throw Error('No units fetched.');

  useStore.setState({ units });

  return (
    <div className="flex h-full w-full">
      <ClientStore data={{ units }} />
      <div className="flex-none border-r border-gray-300">
        {/* <Suspense fallback={<Loading />}> */}
        {/* @ts-expect-error Async Server Component */}
        <Search />
        {/* </Suspense> */}
      </div>
      <div className="h-full flex-auto overflow-auto p-2">{children}</div>
    </div>
  );
}
