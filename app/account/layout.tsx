import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';

import type { Database } from '@/lib/database.types';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Button from '@/lib/ui/button';
import Logout from './logout';

export const revalidate = 0;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });

  const { data: userObject, error } = await supabase.auth.getUser();

  if (!userObject.user) {
    redirect('/login');
    return null;
  }

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userObject.user.id)
    .single();

  const pages = [
    { label: 'Všeobecné informácie', url: '/account/general' },
    { label: 'Adresy doručenia', url: '/account/address' },
    { label: 'Preferencie', url: '/account/preferences' },
    { label: 'História objednávok', url: '/account/history' },
  ];

  return (
    <div className="grid min-h-screen place-content-center bg-primary-100 p-32">
      <div className="flex gap-3">
        <div className="rounded-xl bg-white p-4 shadow-md">
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
              <Logout className=" rounded-lg px-2 py-1 font-semibold text-red-600 hover:bg-red-300" />
            </p>
          </div>
        </div>
        <div className="grow rounded-xl bg-white p-4 shadow-md">{children}</div>
      </div>
    </div>
  );
}
