import {
  useServerSupabase,
  useServerUser,
} from '@/lib/auth/server-supabase-provider';
import Notification from './components/notification';

export default async function Page() {
  const supabase = useServerSupabase();
  const user = await useServerUser();

  if (!user) throw new Error('User not found');

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (
    <div>
      <h3 className="text-xl font-semibold">Vaše notifikácie</h3>
      {notifications.length === 0 || (
        <p className="text-sm text-gray-500">
          {notifications.length} neprečítaných
        </p>
      )}
      <div className="mt-2 divide-y rounded-lg border border-slate-300">
        {notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
