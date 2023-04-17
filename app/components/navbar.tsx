import Link from 'next/link';
import Button from '@/lib/ui/button';
import Image from 'next/image';

import Favicon from '@/public/favicon.ico';
import { BellAlertIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useServerUser } from '@/lib/auth/server-supabase-provider';
import LogoutButton from '../account/logout-button';

export const revalidate = 0;

export default async function Navbar() {
  let pages: { label: string | JSX.Element; url: string; dark: boolean }[];
  const user = await useServerUser();

  if (!user) {
    pages = [
      { label: 'Prihlásiť sa', url: '/auth?view=sign_in', dark: false },
      { label: 'Zaregistrovať', url: '/auth?view=sign_up', dark: true },
    ];
  } else {
    pages = [
      { label: 'Objednávky', url: '/orders', dark: false },
      {
        label: <BellAlertIcon className="h-8 w-8" />,
        url: '/account/notifications',
        dark: false,
      },
      {
        label: <UserCircleIcon className="h-8 w-8" />,
        url: '/account',
        dark: false,
      },
    ];
  }

  if (user?.role === 'staff') {
    pages.splice(0, 0, { label: 'Dashboard', url: '/dashboard', dark: false });
  }

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
          if (typeof page.label === 'string') {
            return (
              <Button
                key={page.url}
                href={page.url}
                variant="black"
                dark={page.dark}
                className=""
              >
                {page.label}
              </Button>
            );
          }
          return (
            <Link key={page.url} href={page.url} className="cursor-pointer">
              {page.label}
            </Link>
          );
        })}
        <LogoutButton />
      </div>
    </nav>
  );
}
