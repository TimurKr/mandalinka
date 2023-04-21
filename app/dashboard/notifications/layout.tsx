export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center pt-16">
      <div className="m-6 rounded-xl bg-white p-6 shadow-2xl">{children}</div>
    </div>
  );
}
