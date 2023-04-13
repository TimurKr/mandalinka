'use client';

import Link from 'next/link';
import Button from '@/components/button';
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
          <li className="py-2 px-2" key={name}>
            <Button href={href} variant="black">
              {name}
            </Button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
