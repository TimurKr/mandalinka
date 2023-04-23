export default function GeneralInfo({ source, cost, unit_sign }: { source: string, cost: string | number, unit_sign: string }) {
  return (
    <>
      <div className="grid h-full w-full place-content-center">
        <p>{source}</p>
        <p>
          {cost ? `${cost} € / ${unit_sign}` : (
            <span className="text-xs text-gray-400">Cena nedefinovaná</span>
          )}
        </p>
      </div>
    </>
  );
}
