export default function Loading() {
  return (
    <div className="grid h-full place-content-center">
      <p className="flex justify-center text-neutral-600">
        Načítavam
        <span className="material-symbols-rounded ml-2 animate-spin ">
          autorenew
        </span>
      </p>
    </div>
  );
}
