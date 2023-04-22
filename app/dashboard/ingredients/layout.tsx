import { Suspense } from 'react';
import Loading from '@/lib/ui/loading_element';
import Search from './search/server';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full">
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
