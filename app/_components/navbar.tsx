import Link from 'next/link';
import Image from 'next/image';
import { Route } from 'next';

import Favicon from '@/public/favicon.ico';

import { getServerUser } from '@/utils/auth/server';
import { getServerSupabase } from '@/utils/supabase/server';

import Button from '@/lib/ui/button';

const authentificated_pages = [
  {
    title: 'Dashboard',
    url: '/dashboard' as Route,
    dark: false,
  },
];

const unauthentificated_pages = [
  {
    title: 'Prihlásiť sa',
    url: '/auth?view=sign_in' as Route,
    dark: false,
  },
  {
    title: 'Zaregistrovať',
    url: '/auth?view=sign_up' as Route,
    dark: true,
  },
];

export default async function Navbar() {
  const user = await getServerUser();
  const supabase = getServerSupabase();

  let unread_notification_count = 0;
  if (user) {
    let { count } = await supabase
      .from('notification')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false)
      .order('created_at', { ascending: false });
    unread_notification_count = count || 0;
  }

  const pages = user ? authentificated_pages : unauthentificated_pages;

  return (
    <nav
      className="sticky top-0 flex items-center justify-between backdrop-blur"
      role="navigation"
    >
      <Link href="/" className="p-3">
        <Image src={Favicon} alt="Mandalinka logo" />
      </Link>
      <div className="flex flex-col items-center gap-4 p-5 sm:flex-row">
        {pages.map((page) => {
          if (typeof page.title === 'string') {
            return (
              <Button
                key={page.url}
                href={page.url}
                variant="black"
                dark={page.dark}
                className="relative"
              >
                {page.title}
                {page.title == 'Dashboard' && unread_notification_count ? (
                  <span className="absolute right-0 top-0 flex h-3 w-3 -translate-y-1/2 translate-x-1/2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                  </span>
                ) : null}
              </Button>
            );
          }
        })}
      </div>
    </nav>
  );
}
