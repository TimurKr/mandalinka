'use client';

import { useClientSupabase } from '@/lib/auth/client-supabase-provider';
import ConfirmationModal from '@/lib/ui/confirmation_modal';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function LogoutButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}): JSX.Element {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const supabase = useClientSupabase();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out: ', error);
    }
    setShowConfirmationModal(false);
  }

  return (
    <>
      <ConfirmationModal
        show={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleLogout}
        header={'Odhlásiť sa'}
        icon={<ArrowLeftOnRectangleIcon className="h-6 w-6" />}
        confirmText="Odhlásiť sa"
        cancelText="Naspäť"
        variant="danger"
        dismissible
        size="sm"
      />
      <a
        onClick={() => setShowConfirmationModal(true)}
        className={`${className} cursor-pointer`}
      >
        {children || 'Odhlásiť sa'}
      </a>
    </>
  );
}
