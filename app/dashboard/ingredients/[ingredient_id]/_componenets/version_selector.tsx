'use client';

import { PlusCircleIcon } from '@heroicons/react/24/outline';

import Button from '@/lib/ui/button';

import type { IngredientVersion } from '@/utils/db.types';
import { useParams, useSelectedLayoutSegment } from 'next/navigation';

export default function VersionSelector({
  versions,
}: {
  versions: Pick< IngredientVersion, 'id' | 'status' | 'version_number'>[];
}) {
  const segment = useSelectedLayoutSegment();
  const params = useParams();

  // sort versions by the creation date
  versions.sort((a, b) => b.version_number - a.version_number);

  const currentVersion = versions.find(
    (version) => version.id.toString() === segment
  );

  if (!currentVersion && segment !== 'new_version') {
    return <p>NotFound</p>;
  }

  return (
    <div className="flex w-full flex-nowrap items-center gap-2 overflow-x-auto p-2">
      <Button
        href={`/dashboard/ingredients/${params.ingredient_id}/new_version`}
        variant="primary"
        className="w-auto grow-0 p-1"
        dark
        disabled={segment === 'new_version'}
      >
        <PlusCircleIcon className="h-6 w-6" />
      </Button>
      {versions.length > 0 ? (
        versions.map((version, index) => (
          <Button
            key={version.id}
            className="w-auto flex-none align-middle"
            // href={`/dashboard/ingredients/${params.ingredient_id}/${version.id.toString()}`}
            onClick={() => {}}
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
            v.{version.version_number}
          </Button>
        ))
      ) : (
        <p className="cursor-default ps-1 text-sm text-slate-500">
          Žiadne verzie
        </p>
      )}
    </div>
  );
}
