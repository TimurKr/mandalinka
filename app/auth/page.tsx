import { redirect, useSearchParams } from 'next/navigation';
import Authentificate from './auth_element';
import { getServerUser } from '@/lib/auth/server-supabase-provider';

export const revalidate = 0;

/**
 * This page allows for loging in or signing up.
 *
 * @param view - the auth view that should be active upon loading. Options:
 * - sign_up - DEFAULT
 * - sign_in
 * - forgotten_password
 * - magic_link
 * - update_password
 * @param redirect_url - the url to redirect to after successful login
 */
export default async function Page({
  searchParams,
}: {
  searchParams: {
    view?: string;
    redirect_url?: string;
  };
}) {
  // Protect route
  const user = await getServerUser();

  // artifically wait for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // const user = await supabase.auth.getUser();
  if (user) {
    redirect('/account');
  }

  const validViews = [
    'sign_in',
    'sign_up',
    'forgotten_password',
    'magic_link',
    'update_password',
  ];
  let view = searchParams.view || 'sign_up';

  if (!validViews.includes(view)) {
    view = 'sign_up';
  }

  const redirect_url = searchParams.redirect_url;

  return (
    <div className="rounded-xl bg-white px-8 py-6 shadow-2xl">
      <Authentificate view={view} redirect_url={redirect_url} />
    </div>
  );
}
