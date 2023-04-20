'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import LogoutButton from './logout-button';

const current_path = '/dashboard';

const customer_pages = [
  {
    title: 'Objednávky',
    href: 'my_orders',
    icon: 'list_alt',
  },
  {
    title: 'História',
    href: 'history',
    icon: 'history',
  },
  {
    title: 'Notifikácie',
    href: 'notifications',
    icon: 'notifications',
  },
  {
    title: 'Nastavenia',
    href: 'account_settings',
    icon: 'manage_accounts',
  },
];

const staff_pages = [
  {
    title: 'Menu',
    href: 'menus',
    icon: 'menu_book',
  },
  {
    title: 'Recepty',
    href: 'recipes',
    icon: 'ramen_dining',
  },
  {
    title: 'Suroviny',
    href: 'ingredients',
    icon: 'egg_alt',
  },
  {
    title: 'Supabase',
    href: 'https://app.supabase.com/',
    icon: 'bolt',
  },
];

export default function Navigation({
  is_staff,
  notifications,
}: {
  is_staff?: boolean;
  notifications: number | null;
}) {
  const selected = useSelectedLayoutSegment();

  return (
    <nav className="flex h-full flex-col justify-center divide-y-2 bg-slate-50 p-2">
      {[customer_pages, is_staff ? staff_pages : []].map((pages, index) => (
        <div key={index} className="py-3">
          {pages.map((page) => (
            <Link
              key={page.title}
              href={current_path + '/' + page.href}
              className={`group relative my-3 grid h-10 w-10 place-content-center rounded-xl border bg-slate-100 p-1 text-2xl md:text-3xl ${
                page.href === selected
                  ? 'cursor-default !bg-primary font-semibold'
                  : '!font-light shadow-md hover:bg-primary/50 hover:shadow-xl active:bg-primary/70'
              }`}
            >
              <span
                className={`material-symbols-outlined text-2xl md:text-3xl ${
                  page.href === selected
                    ? 'font-semibold text-black'
                    : '!font-light'
                }`}
              >
                {page.icon}
              </span>
              {page.title == 'Notifikácie' && notifications ? (
                <span className="absolute right-0 top-0 flex h-3 w-3 -translate-y-1/2 translate-x-1/2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                </span>
              ) : null}
              <div className="invisible absolute top-1/2 ml-14 -translate-y-1/2 rounded-md bg-primary p-2 text-sm opacity-0 transition group-hover:visible group-hover:opacity-100">
                {page.title}
              </div>
            </Link>
          ))}
        </div>
      ))}
      <div className="py-3">
        <LogoutButton className="group relative my-3 grid h-10 w-10 place-content-center rounded-xl border bg-slate-100 p-1 text-2xl font-extralight text-red-500 shadow-md hover:bg-red-200 hover:shadow-xl active:bg-red-300 md:text-3xl">
          <span className="material-symbols-outlined text-2xl !font-light md:text-3xl">
            logout
          </span>
          <div className="invisible absolute top-1/2 ml-14 -translate-y-1/2 rounded-md bg-red-200 p-2 text-sm opacity-0 transition group-hover:visible group-hover:opacity-100">
            Odhlásiť
          </div>
        </LogoutButton>
      </div>
    </nav>
  );
}
