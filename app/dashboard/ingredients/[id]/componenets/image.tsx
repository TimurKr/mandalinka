'use client';
import { BorderedElement } from '@/lib/ui/bordered_element';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function ImageElement({ path }: { path?: string }) {
  return (
    <BorderedElement className="group relative">
      <Image
        className="inset-0 aspect-square h-auto w-auto rounded-xl object-cover"
        src={path || '/ingredients/placeholder'}
        alt="Nepodarilo sa načítať obrázok"
        width={512}
        height={512}
      />
      {/* <PencilSquareIcon
        className="absolute start-1/2 top-1/2 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-xl bg-slate-200/70 p-2 text-red-500 hover:bg-slate-200/90 group-hover:block"
      >
      </PencilSquareIcon> */}
    </BorderedElement>
  );
}
