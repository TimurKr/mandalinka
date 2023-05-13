'use client';
import React from 'react';
import { useSupabase } from '@/utils/supabase/client';
import Alert from '@/lib/ui/alert';
import { useState } from 'react';
import {
  MdOutlineMarkEmailUnread,
  MdOutlineMarkEmailRead,
  MdLink,
} from 'react-icons/md';

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
  const supabase = useSupabase();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notif, setNotif] = useState(notification);

  async function toggleRead(event: any) {
    event.stopPropagation();
    setLoading(true);

    const { data: new_notif, error: error_message } = await supabase
      .from('notification')
      .update({
        read: !notif.read,
      })
      .eq('id', notif.id)
      .select('*')
      .single();

    if (error_message) setError(error_message.message);
    else setError(null);

    if (new_notif) setNotif(new_notif);

    setLoading(false);
  }

  return (
    <div
      key={notif.id}
      className={`relative max-w-xl cursor-pointer p-2 transition first:rounded-t-lg last:rounded-b-lg hover:shadow-xl ${
        notif.read
          ? 'border border-slate-300'
          : 'border border-primary bg-primary/20'
      }`}
    >
      <div className="p-2" onClick={() => setIsActive(!isActive)}>
        <h5 className="item flex items-center justify-between text-lg">
          <span className="justify-self-start">{notif.title}</span>
          <div className="flex flex-row gap-2">
            {notif.href ? (
              <a
                className="rounded-lg border bg-white p-2 hover:bg-slate-100 hover:shadow-md active:bg-slate-300"
                href={notif.href}
              >
                <MdLink />
              </a>
            ) : (
              <a
                className="rounded-lg border bg-white p-2 hover:bg-slate-100 hover:shadow-md active:bg-slate-300"
                onClick={toggleRead}
              >
                {notif.read ? (
                  <MdOutlineMarkEmailUnread />
                ) : (
                  <MdOutlineMarkEmailRead />
                )}
              </a>
            )}

            {/* <div className="rounded-lg border bg-white p-2 pl-0 hover:bg-slate-200 hover:shadow-md active:bg-slate-300">
              <Dropdown label={''} inline={true}>
                {notif.read ? (
                  <Dropdown.Item
                    icon={MdOutlineMarkEmailUnread}
                    onClick={toggleRead}
                  >
                    Neprečítané
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item
                    icon={MdOutlineMarkEmailRead}
                    onClick={toggleRead}
                  >
                    Prečítané
                  </Dropdown.Item>
                )}
              </Dropdown>
            </div> */}
          </div>
        </h5>
        <p className={`text-sm text-slate-700 ${isActive ? '' : 'truncate'}`}>
          {notif.message}
        </p>
      </div>
      <Alert
        variant="danger"
        className="border-0"
        onClose={() => setError(null)}
      >
        {error}
      </Alert>
    </div>
  );
}
