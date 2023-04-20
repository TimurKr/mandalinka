import { redirect } from 'next/navigation';

export default async function Page() {
  return redirect('/dashboard/account_settings/general');
}
