'use client';

import { useEffect } from 'react';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function NotFoundElement({ children }: { children?: string }) {
  return (
    <div className="grid h-full place-content-center">
      <div className="grid grid-flow-col grid-rows-2 items-center justify-items-start gap-x-5">
        <ExclamationCircleIcon className="row-span-2 h-12 w-12 text-red-500" />
        <p className="text-lg">404 Not Found</p>
        <p className="align-middle text-sm text-gray-600">
          {children || 'Požadovaná stránka nebola nájdená'}
        </p>
      </div>
    </div>
  );
}
