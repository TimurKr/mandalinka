import Link from 'next/link';
import Button from '@/lib/ui/button';
import Image from 'next/image';

import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { headers, cookies } from 'next/headers';

import Favicon from '@/public/favicon.ico';
import { Database } from '@/lib/database.types';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export const revalidate = 0;

export default async function Navbar() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });

  let pages: { label: string | JSX.Element; url: string; dark: boolean }[];
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    pages = [
      { label: 'Prihlásiť sa', url: '/login', dark: false },
      { label: 'Zaregistrovať', url: '/register', dark: true },
    ];
  } else {
    pages = [
      { label: 'Objednávky', url: '/orders', dark: false },
      { label: 'Dashboard', url: '/dashboard', dark: false },
      {
        label: <UserCircleIcon className="h-7 w-7" />,
        url: '/account',
        dark: false,
      },
    ];
  }

  // const pages = [
  //   ['Účet', '/account'],
  //   ['Management', '/management'],
  //   ['Login', '/login'],
  // ];

  return (
    <nav
      className="sticky top-0 flex items-center justify-between backdrop-blur"
      role="navigation"
    >
      <Link href="/" className="p-3">
        <Image src={Favicon} alt="Mandalinka logo" />
      </Link>
      <div className="flex flex-col items-center gap-4 p-5 sm:flex-row">
        {pages.map((page) => (
          <Button
            key={page.url}
            href={page.url}
            variant="black"
            dark={page.dark}
            className=""
          >
            {page.label}
          </Button>
        ))}
      </div>
    </nav>
  );
}
