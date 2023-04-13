'use client';

import Link from 'next/link';
import Button from '@/components/ui/button';
import Image from 'next/image';

import Favicon from '@/public/favicon.ico';

export default function Navigation() {
  const pages = [
    ['Účet', '/account'],
    ['Management', '/management'],
    ['Login', '/login'],
  ];

  return (
    <nav
      className="sticky top-0 flex justify-between py-2 backdrop-blur"
      role="navigation"
    >
      <div className="p-2">
        <Link href="/">
          <Image src={Favicon} alt="Mandalinka logo" />
        </Link>
      </div>
      <ol className="flex flex-col items-center sm:flex-row">
        {pages.map(([name, href]) => (
          <li className="px-2 py-2" key={name}>
            <Button href={href} variant="black">
              {name}
            </Button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
