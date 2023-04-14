export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-content-center bg-primary-300">
      {children}
    </div>
  );
}
