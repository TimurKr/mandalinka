'use client';

import { useSupabase } from '@/utils/supabase/client';
import { IngredientVersion } from '@/utils/db.types';
import Alert from '@/lib/ui/alert';
import Button from '@/lib/ui/button';
import ConfirmationModal from '@/lib/ui/confirmation_modal';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';

export default function StatusManipulation({
  ingredientVersion,
}: {
  ingredientVersion: Pick<IngredientVersion, 'id' | 'ingredient' | 'status'> & {
    orders_count: number;
    removals_count: number;
  };
}) {
  const router = useRouter();
  const supabase = useSupabase();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<
    IngredientVersion['status'] | 'delete' | null
  >(null);

  async function changeStatus(
    status: IngredientVersion['status'] | 'delete' | null
  ) {
    if (status === null) return;

    if (status === 'delete') {
      const { error } = await supabase
        .from('ingredient_version')
        .delete()
        .eq('id', ingredientVersion.id);
      if (error) {
        setErrorMessage(error.message);
      } else {
        return startTransition(() => {
          router.refresh();
          setConfirmStatus(null);
        });
      }
      return;
    }

    const { error } = await supabase
      .from('ingredient_version')
      .update({ status })
      .eq('id', ingredientVersion.id);
    if (error) {
      setErrorMessage(error.message);
    } else {
      return startTransition(() => {
        setConfirmStatus(null);
        router.refresh();
      });
    }
  }

  return (
    <>
      <ConfirmationModal
        show={confirmStatus !== null}
        onClose={() => setConfirmStatus(null)}
        onConfirm={() => changeStatus(confirmStatus)}
        confirmText="Potvrdiť"
        header={`Potvďte ${
          confirmStatus === 'active'
            ? 'aktiváciu'
            : confirmStatus === 'preparation'
            ? 'vrátenie do prípravy'
            : confirmStatus === 'archived'
            ? 'deaktiváciu'
            : confirmStatus === 'delete'
            ? 'zmazanie'
            : ''
        }`}
        variant={
          confirmStatus === 'active'
            ? 'success'
            : confirmStatus === 'preparation'
            ? 'warning'
            : 'danger'
        }
      >
        {confirmStatus === 'delete' ? 'Táto akcia je nevratná' : undefined}
      </ConfirmationModal>
      <div className="flex items-center gap-2">
        <Alert variant="danger" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
        {(ingredientVersion.status === 'active' ||
          ingredientVersion.status === 'archived') && (
          <Button
            variant="warning"
            onClick={() => setConfirmStatus('preparation')}
            className="w-auto flex-none"
          >
            Do prípravy
          </Button>
        )}
        {(ingredientVersion.status === 'active' ||
          ingredientVersion.status === 'preparation') && (
          <Button
            variant="danger"
            onClick={() => setConfirmStatus('archived')}
            className="w-auto flex-none"
          >
            Deaktivovať
          </Button>
        )}
        {ingredientVersion.status === 'preparation' && (
          <Button
            variant="success"
            onClick={() => setConfirmStatus('active')}
            className="w-auto flex-none"
          >
            Aktivovať
          </Button>
        )}
        {ingredientVersion.status === 'preparation' &&
          ingredientVersion.orders_count === 0 &&
          ingredientVersion.removals_count === 0 && (
            <Button
              variant="danger"
              dark
              onClick={() => setConfirmStatus('delete')}
              className="w-auto flex-none"
            >
              Zmazať
            </Button>
          )}
      </div>
    </>
  );
}
