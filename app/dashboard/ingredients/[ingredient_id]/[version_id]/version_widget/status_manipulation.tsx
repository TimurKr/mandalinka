'use client';

import Alert from '@/components/alert';
import Button from '@/components/button';
import { IngredientVersion } from '@/components/fetching/ingredient_detail';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';

const ConfirmationModal = dynamic(
  () => import('@/components/confirmation_modal'),
  { ssr: false }
);

export default function StatusManipulation({
  ingredientVersion,
  CLIENT_API_URL,
}: {
  ingredientVersion: IngredientVersion;
  CLIENT_API_URL: string;
}) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<
    'active' | 'inactive' | 'deleted' | 'DELETE' | null
  >(null);

  async function changeStatus(status: string | null) {
    if (status === null) return;

    if (status === 'DELETE') {
      await fetch(
        `${CLIENT_API_URL}/management/ingredients/versions/${ingredientVersion.id}/`,
        {
          method: 'DELETE',
        }
      )
        .then((response) => {
          if (response.ok) {
            setConfirmStatus(null);
            return startTransition(() =>
              router.push(
                `/management/ingredients/${ingredientVersion.ingredient}/`
              )
            );
          } else {
            return response.json();
          }
        })
        .then((response) => {
          setErrorMessage(response?.detail);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
      return;
    }

    const formData = new FormData();
    formData.append('status', status);

    await fetch(
      `${CLIENT_API_URL}/management/ingredients/versions/${ingredientVersion.id}/`,
      {
        method: 'PATCH',
        body: formData,
      }
    )
      .then((response) => {
        if (response.ok) {
          window.location.reload();
        } else {
          return response.json();
        }
      })
      .then((response) => {
        setErrorMessage(response?.detail);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
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
            : confirmStatus === 'inactive'
            ? 'vrátenie do prípravy'
            : confirmStatus === 'deleted'
            ? 'deaktiváciu'
            : confirmStatus === 'DELETE'
            ? 'zmazanie'
            : ''
        }`}
        variant={
          confirmStatus === 'active'
            ? 'success'
            : confirmStatus === 'inactive'
            ? 'warning'
            : 'danger'
        }
      >
        {confirmStatus === 'DELETE' ? 'Táto akcia je nevratná' : undefined}
      </ConfirmationModal>
      <div className="flex items-center gap-2">
        <Alert variant="danger" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
        {(ingredientVersion.is_active || ingredientVersion.is_deleted) && (
          <Button
            variant="warning"
            onClick={() => setConfirmStatus('inactive')}
            className="w-auto flex-none"
          >
            Do prípravy
          </Button>
        )}
        {(ingredientVersion.is_inactive || ingredientVersion.is_active) && (
          <Button
            variant="danger"
            onClick={() => setConfirmStatus('deleted')}
            className="w-auto flex-none"
          >
            Deaktivovať
          </Button>
        )}
        {ingredientVersion.is_inactive && (
          <Button
            variant="success"
            onClick={() => setConfirmStatus('active')}
            className="w-auto flex-none"
          >
            Aktivovať
          </Button>
        )}
        {ingredientVersion.is_inactive &&
          ingredientVersion.orders.length == 0 &&
          ingredientVersion.removals.length == 0 && (
            <Button
              variant="danger"
              dark
              onClick={() => setConfirmStatus('DELETE')}
              className="w-auto flex-none"
            >
              Zmazať
            </Button>
          )}
      </div>
    </>
  );
}
