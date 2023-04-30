import NotFoundElement from '@/lib/ui/not-found_element';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-content-center">
      <NotFoundElement>Na tejto stránke sa nič nenachádza</NotFoundElement>
    </div>
  );
}
