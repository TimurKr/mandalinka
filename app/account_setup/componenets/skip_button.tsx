'use client';
import { useClientSupabase } from '@/lib/auth/client-supabase-provider';
import Button from '@/lib/ui/button';
import { PostgrestError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SkipButton({ user_id }: { user_id: string }) {
  const supabase = useClientSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);

  async function handleSkip() {
    setLoading(true);
    router.prefetch('/dashboard');

    // Update user account_setup_completed to true
    let { error } = await supabase
      .from('users')
      .update({
        account_setup_completed: true,
      })
      .eq('id', user_id);

    if (error) {
      console.error(error);
      setError(error);
      setLoading(false);
      return;
    }

    // Make the notification about account setup unread
    ({ error } = await supabase
      .from('notifications')
      .update({
        read: false,
      })
      .eq('user_id', user_id)
      .eq('type', 'account_setup'));

    if (error) {
      console.error(error);
      setError(error);
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(false);
    router.push('/dashboard');
  }

  return (
    <Button
      variant={error ? 'danger' : 'black'}
      onClick={handleSkip}
      disabled={loading}
    >
      {loading
        ? 'Odosielam dáta...'
        : error
        ? 'Nastal problém s odoslaním dát'
        : 'Dokončiť neskôr'}
    </Button>
  );
}
