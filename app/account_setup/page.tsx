import Button from '@/lib/ui/button';
import SkipButton from './componenets/skip_button';
import { useServerUser } from '@/lib/auth/server-supabase-provider';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await useServerUser();
  if (!user) redirect('/auth');
  return (
    <section className="h-screen w-screen bg-slate-100">
      <div className="grid h-full place-content-center">
        <p className="text-center text-lg">
          Tu sa nastavuje účet hneď po vytvorení.
        </p>
        <SkipButton user_id={user?.id} />
      </div>
    </section>
  );
}
