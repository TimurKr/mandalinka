'use client';

import { PlusCircleIcon } from '@heroicons/react/24/outline';

import Button from '@/lib/ui/button';

import type { IngredientVersion } from '@/lib/database.types';
import { useParams, useSelectedLayoutSegment } from 'next/navigation';

type IngredientVersions = Pick<
  IngredientVersion,
  'id' | 'status' | 'created_at'
>[];

export default function VersionSelector({
  versions,
}: {
  versions: IngredientVersions;
}) {
  const segment = useSelectedLayoutSegment();
  const params = useParams();

  // sort versions by the creation date
  versions.sort((a, b) => {
    if (new Date(a.created_at) > new Date(b.created_at)) {
      return 1;
    } else if (new Date(a.created_at) < new Date(b.created_at)) {
      return -1;
    } else {
      return 0;
    }
  });

  const currentVersion = versions.find(
    (version) => version.id.toString() === segment
  );

  if (!currentVersion && segment !== 'new_version') {
    console.log(currentVersion);
    return <p>NotFound</p>;
  }

  return (
    <div className="flex w-full flex-nowrap gap-2 overflow-x-auto p-2">
      <Button
        href={`/dashboard/ingredients/${params.ingredient_id}/new_version`}
        variant="primary"
        className="w-auto grow-0 p-1"
        dark
        disabled={segment === 'new_version'}
      >
        <PlusCircleIcon className="h-6 w-6" />
      </Button>
      {versions.map((version, index) => (
        <Button
          key={version.id}
          className="w-auto flex-none align-middle"
          href={`/dashboard/ingredients/${params.ingredient_id}/${version.id}`}
          variant={
            version.status == 'active'
              ? 'success'
              : version.status === 'preparation'
              ? 'warning'
              : 'danger'
          }
          dark={segment == version.id.toString()}
          disabled={segment == version.id.toString()}
        >
          Verzia - {index + 1}
        </Button>
      ))}
    </div>
  );
}
