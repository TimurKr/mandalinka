import { redirect } from 'next/navigation';
import { useServerUser } from '@/lib/auth/server-supabase-provider';
import Navigation from './navigation';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await useServerUser();

  if (!user) redirect('/auth?redirect_url=/account');

  if (!user.account_setup_completed) {
    return redirect('/account_setup');
  }

  const pages = [
    { label: 'Všeobecné informácie', url: '/account/general' },
    { label: 'Notifikácie', url: '/account/notifications' },
    { label: 'Adresy doručenia', url: '/account/address' },
    { label: 'Preferencie', url: '/account/preferences' },
    { label: 'História objednávok', url: '/account/history' },
  ];

  return (
    <div className="my-auto flex h-full flex-wrap items-start gap-2 p-10">
      <div className="shrink-0 rounded-xl bg-white p-4 shadow-md">
        <h4 className="p-2 text-xl font-semibold text-black">
          {user?.full_name || 'Mr. NoName'}
        </h4>
        <Navigation />
      </div>
      <div className="grow rounded-xl bg-white p-4 shadow-md">{children}</div>
    </div>
  );
}
