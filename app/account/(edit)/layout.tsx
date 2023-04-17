import { redirect } from 'next/navigation';
import Link from 'next/link';
import Button from '@/lib/ui/button';
import {
  useServerSupabase,
  useServerUser,
} from '@/lib/auth/server-supabase-provider';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import LogoutButton from '../logout-button';

export const revalidate = 0;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = useServerSupabase();
  const supabase_user = await useServerUser();

  if (!supabase_user) redirect('/auth?redirect_url=/account&view=sign_in');

  const { data: user } = await supabase
    .from('users')
    .select('is_set, full_name')
    .eq('id', supabase_user.id)
    .single();

  if (!user) {
    return redirect('/auth?redirect_url=/account&view=sign_in');
  }

  if (!user.is_set) {
    return redirect('/account/setup');
  }

  const pages = [
    { label: 'Všeobecné informácie', url: '/account/general' },
    { label: 'Notifikácie', url: '/account/notifications' },
    { label: 'Adresy doručenia', url: '/account/address' },
    { label: 'Preferencie', url: '/account/preferences' },
    { label: 'História objednávok', url: '/account/history' },
  ];

  return (
    <div className="flex gap-3">
      <div className="rounded-xl bg-white p-4 shadow-md">
        <Link href="/" className="inline-block rounded-md hover:bg-slate-300">
          <ArrowLeftIcon className="m-1 h-5 w-5" />
        </Link>
        <h4 className="p-2 text-xl font-semibold text-black">
          {user?.full_name || 'Mr. NoName'}
        </h4>
        <div>
          {pages.map((page) => (
            <p key={page.url} className="mb-1">
              <Link
                href={page.url}
                className="rounded-lg px-2 py-1 font-semibold text-neutral-600 hover:bg-primary-200 hover:text-black"
              >
                {page.label}
              </Link>
            </p>
          ))}
          <p>
            <LogoutButton className=" rounded-lg px-2 py-1 font-semibold text-red-600 hover:bg-red-300" />
          </p>
        </div>
      </div>
      <div className="grow rounded-xl bg-white p-4 shadow-md">{children}</div>
    </div>
  );
}
