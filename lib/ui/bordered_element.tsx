export function BorderedElement({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={
        className +
        ' py-auto relative h-full w-full rounded-xl border border-gray-500 p-2 shadow'
      }
    >
      {title && (
        <div className="absolute left-1 top-0 max-w-full -translate-y-1/2 truncate rounded-xl px-2 backdrop-blur-3xl hover:max-w-none">
          <h4 className="text-xs">{title}</h4>
        </div>
      )}
      {children}
    </div>
  );
}
