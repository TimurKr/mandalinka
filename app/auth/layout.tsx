import { getServerUser } from '@/utils/auth/server';

import { redirect } from 'next/navigation';

// do not cache this page
export const revalidate = 0;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  // Only allow unauthenticated users to see this page
  if (user) {
    redirect('/');
  }

  return (
    <div className="grid min-h-screen place-content-center bg-primary-300">
      {children}
    </div>
  );
}
