'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid h-full place-content-center">
      <div className="grid grid-flow-col grid-rows-2 items-center justify-items-start gap-x-5">
        <span className="material-symbols-rounded row-span-2 text-6xl text-red-500">
          error
        </span>
        <p className="text-lg">Chyba pri načítavaní dát</p>
        <p className="align-middle text-sm text-gray-600">
          {error.name}: {error.message}
        </p>
      </div>
    </div>
  );
}
