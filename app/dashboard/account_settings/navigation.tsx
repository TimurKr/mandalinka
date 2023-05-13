'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import Link from 'next/link';

export default function Navigation() {
  const selected = useSelectedLayoutSegment();

  const pages = [
    {
      label: 'Všeobecné informácie',
      href: '/dashboard/account_settings/general',
    },
    {
      label: 'Adresy doručenia',
      href: '/dashboard/account_settings/addresses',
    },
    {
      label: 'Preferencie',
      href: '/dashboard/account_settings/preferences',
    },
    {
      label: 'Notifikácie',
      href: '/dashboard/account_settings/notifications',
    },
  ];

  return (
    <div>
      {pages.map((page) => (
        <p key={page.href} className="my-2">
          <Link
            href={page.href}
            className={`rounded-lg px-2 py-1 font-semibold ${
              page.href.endsWith(selected || 'definitely_not_a_page')
                ? 'cursor-default bg-primary-200 text-black'
                : 'text-neutral-600 hover:bg-primary-200 hover:text-black active:bg-primary-400'
            }`}
          >
            {page.label}
          </Link>
        </p>
      ))}
    </div>
  );
}
