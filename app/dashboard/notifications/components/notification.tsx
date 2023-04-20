'use client';
import { useClientSupabase } from '@/lib/auth/client-supabase-provider';
import Alert from '@/lib/ui/alert';
import Button from '@/lib/ui/button';
import { truncate } from 'fs';
import { useState } from 'react';

export default function Notification({
  notification,
}: {
  notification: {
    created_at: string | null;
    href: string | null;
    id: number;
    message: string;
    read: boolean;
    title: string;
    user_id: string;
  };
}) {
  const supabase = useClientSupabase();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notif, setNotif] = useState(notification);

  async function toggleRead() {
    setLoading(true);

    const { data: new_notif, error: error_message } = await supabase
      .from('notifications')
      .update({
        read: !notif.read,
      })
      .eq('id', notif.id)
      .select('*')
      .single();

    if (error_message) setError(error_message.message);
    else setError(null);

    console.log('New notfication:', new_notif);

    if (new_notif) setNotif(new_notif);

    setLoading(false);
  }

  return (
    <div
      key={notif.id}
      onClick={() => setIsActive(!isActive)}
      className={`cursor-pointer first:rounded-t-lg last:rounded-b-lg ${
        notif.read ? '' : 'border border-orange-500 bg-orange-100'
      }`}
    >
      <div className="flex max-w-md flex-wrap items-center justify-between p-2">
        <div className="max-w-full shrink p-2">
          <h5 className="text-lg">{notif.title}</h5>
          <p className={`text-sm text-slate-700 ${isActive ? '' : 'truncate'}`}>
            {notif.message}
          </p>
        </div>
        <Button
          className="inset-y-0 right-0 w-auto bg-slate-50"
          variant="primary"
          onClick={toggleRead}
        >
          {loading
            ? 'Loading...'
            : notif.read
            ? 'Označiť ako neprečítané'
            : 'Prečítané'}
        </Button>
      </div>
      <Alert variant="danger" onClose={() => setError(null)}>
        {error}
      </Alert>
    </div>
  );
}
