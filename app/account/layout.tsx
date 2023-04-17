import {
  useServerSupabase,
  useServerUser,
} from '@/lib/auth/server-supabase-provider';
import { redirect } from 'next/navigation';

/**
 * This is a layout component that is used to wrap all account pages.
 * It checks:
 *  - if the user is logged in and redirects to the login page if not.
 *  - if the user is logged in and has not completed the setup process, it redirects to the setup page.
 */
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = useServerSupabase();

  const { id } = (await useServerUser()) || { id: null };

  if (!id) redirect('/auth?redirect_url=/account&view=sign_in');

  return (
    <div className="grid min-h-screen place-content-center bg-primary-100 p-32">
      {children}
    </div>
  );
}
