import {
  useServerSupabase,
  useServerUser,
} from '@/lib/auth/server-supabase-provider';

import { redirect } from 'next/navigation';

import Navigation from './components/navigation';

// do not cache this page
export const revalidate = 0;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = useServerSupabase();
  const user = await useServerUser();

  // Only allow unauthenticated users to see this page
  if (!user) {
    redirect('/');
  }

  const { error, count } = await supabase
    .from('notifications')
    .select('*', { count: 'estimated', head: true })
    .eq('user_id', user.id)
    .eq('read', false);
  if (error) throw error;

  return (
    <section className="flex h-screen w-screen overflow-hidden bg-slate-100">
      <div className="z-10 flex-none shadow-xl">
        <Navigation is_staff={user.is_staff} notifications={count} />
      </div>
      <div className="flex-auto">{children}</div>
    </section>
  );
}
