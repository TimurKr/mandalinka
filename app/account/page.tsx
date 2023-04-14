import { redirect } from 'next/navigation';

export default function Page() {
  redirect('account/general');
  return null;
}
