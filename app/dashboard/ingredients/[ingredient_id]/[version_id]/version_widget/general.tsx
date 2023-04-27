import type { IngredientVersion } from '@/lib/database.types';

type Props = {
  data: Pick<IngredientVersion, 'source' | 'cost'> & {
    unit: { sign: string } | string;
  };
};

export default function GeneralInfo({ data }: Props) {
  return (
    <>
      <div className="grid h-full w-full place-content-center">
        <p>{data.source}</p>
        <p>
          {data.cost ? (
            `${data.cost} € / ${
              typeof data.unit === 'string' ? data.unit : data.unit.sign
            }`
          ) : (
            <span className="text-xs text-gray-400">Cena nedefinovaná</span>
          )}
        </p>
      </div>
    </>
  );
}
