import Alert from '@/lib/ui/alert';
import ConfirmationModal from '@/lib/ui/confirmation_modal';
import { IngredientVersionOrder } from '@/utils/db.types';
import {
  ArchiveBoxIcon,
  ArrowDownOnSquareIcon,
  BackspaceIcon,
  ClockIcon,
  TrashIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from 'flowbite-react';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { FormEvent, startTransition, useRef, useState } from 'react';
import { DateTimeInput } from '@/lib/forms';
import { useSupabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useIngredientVersionStore } from '../../../store';

export interface IconParams {
  order_id: number;
  status: IngredientVersionOrder['status'] | 'delete';
  revert?: boolean;
}

const mapper = {
  awaiting_order: {
    icon: ClockIcon,
    DEFAULT: undefined,
    revert: {
      tooltip: 'Vrátiť na neobjednané',
      color: 'red',
      confirmText: 'Potvďte, že objednávka nebola objednaná.',
    },
  },
  ordered: {
    icon: TruckIcon,
    DEFAULT: {
      tooltip: 'Označiť ako objednané',
      color: 'green',
      confirmText: 'Potvrďte, že objednávka bola objednaná.',
    },
    revert: {
      tooltip: 'Vrátiť na nedoručené',
      color: 'red',
      confirmText: 'Naozaj chcete označiť objednávku ako objednanú?',
    },
  },
  delivered: {
    icon: ArrowDownOnSquareIcon,
    DEFAULT: {
      tooltip: 'Označiť ako doručené',
      color: 'green',
      confirmText: 'Potvrďte, že objednávka bola doručená.',
    },
    revert: {
      tooltip: 'Vrátiť na doručené',
      color: 'red',
      confirmText: 'Potvďte, že objednávka ešte neexpirovala.',
    },
  },
  expired: {
    icon: TrashIcon,
    DEFAULT: {
      tooltip: 'Označiť za expirované',
      color: 'red',
      confirmText: 'Potvrďte expiráciu objednávky.',
    },
    revert: undefined,
  },
  canceled: {
    icon: ArchiveBoxIcon,
    DEFAULT: {
      tooltip: 'Označiť za zrušené',
      color: 'red',
      confirmText: 'Naozaj chcete označiť túto objednávku za zrušenú?',
    },
    revert: undefined,
  },
  delete: {
    icon: BackspaceIcon,
    DEFAULT: {
      tooltip: 'Vymazať',
      color: 'red',
      confirmText: 'Naozaj',
    },
    revert: undefined,
  },
};

export function StatusManipulationIcon({
  status,
  revert,
  order_id,
}: IconParams) {
  const [showConfimation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<FormikProps<any>>(null);
  const supabase = useSupabase();
  const router = useRouter();

  const order = useIngredientVersionStore((state) =>
    state.currentVersion.orders.find((order) => order.id === order_id)
  )!;
  const ingredientVersion = useIngredientVersionStore(
    (state) => state.currentVersion
  );

  if (!order) throw new Error(`Order with id: ${order_id} not found`);

  async function submit(date?: Date) {
    setIsSubmitting(true);

    // DELETE
    if (status === 'delete') {
      const { error } = await supabase
        .from('ingredient_version_order')
        .delete()
        .eq('id', order_id);
      if (error) {
        setErrorMessage(error.message);
        setIsSubmitting(false);
        return;
      }
      location.reload();
      return;
    }
    // UPDATE

    const { error: statusChangeError } = await supabase
      .from('ingredient_version_order')
      .update({
        id: order_id,
        ordered_at: status === 'ordered' ? date?.toISOString() : undefined,
        delivery_at: status === 'delivered' ? date?.toISOString() : undefined,
        in_stock: status === 'delivered' ? order.id : 0,
      })
      .eq('id', order_id);
    if (statusChangeError) {
      setErrorMessage(statusChangeError.message);
      setIsSubmitting(false);
      return;
    }

    // UPDATE IN STOCK
    const { error: inStockError } = await supabase.rpc(
      'update_ingredient_version_in_stock',
      {
        ingredient_version_id: order.ingredient_version,
      }
    );
    if (inStockError) {
      setErrorMessage(`Error updating stock: ${inStockError.message}`);
      setIsSubmitting(false);
      return;
    }

    // UPDATE COST
    if (status === 'ordered') {
      const { error: costError } = await supabase
        .from('ingredient_version')
        .update({
          cost:
            order.cost /
            ((order.amount * order.unit.conversion_rate) /
              ingredientVersion.unit.conversion_rate),
        })
        .eq('id', order.ingredient_version);
      if (costError) {
        setErrorMessage(`Error updating cost: ${costError.message}`);
        setIsSubmitting(false);
        return;
      }
    }

    location.reload();
  }

  const Icon = mapper[status].icon;
  const data = mapper[status][revert ? 'revert' : 'DEFAULT'];

  if (!data) throw new Error('Invalid status manipulation');

  return (
    <>
      <ConfirmationModal
        show={showConfimation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          formRef.current?.submitForm() ?? submit();
        }}
        header={data.confirmText}
        variant={data.color === 'red' ? 'danger' : 'success'}
        disableConfirm={isSubmitting}
      >
        <Alert onClose={() => setErrorMessage(null)} variant="danger">
          {errorMessage}
        </Alert>
        {/* Require time for order and delivered */}
        {status === 'ordered' || status === 'delivered' ? (
          <Formik
            innerRef={formRef}
            initialValues={{
              date: new Date(
                status === 'ordered'
                  ? order.ordered_at ?? new Date()
                  : order.delivery_at ?? new Date()
              ),
            }}
            validationSchema={Yup.object({
              date:
                status == 'ordered'
                  ? Yup.date()
                      .required('Povinné')
                      .max(
                        new Date(order.delivery_at ?? 8.64e15),
                        ({ max }) => {
                          `Dátum musí byť pred ${max.toLocaleString()}`;
                        }
                      )
                  : Yup.date()
                      .required('Povinné')
                      .min(new Date(order.ordered_at!))
                      .max(new Date(order.expires_at ?? 8.64e15), ({ max }) => {
                        `Dátum musí byť pred ${max.toLocaleString()}`;
                      }),
            })}
            onSubmit={(values) => {
              submit(new Date(values.date));
            }}
          >
            <DateTimeInput
              label={`Čas ${status === 'ordered' ? 'objednávky' : 'doručenia'}`}
              name="date"
              time
            />
          </Formik>
        ) : status === 'delete' ? (
          <>Táto akcia je nevratná</>
        ) : (
          <></>
        )}
      </ConfirmationModal>

      <Tooltip content={data.tooltip} arrow={false}>
        <Icon
          className={`h-6 w-6 rounded-md p-1 text-${data.color}-600 hover:bg-${data.color}-200 cursor-pointer active:bg-${data.color}-300`}
          onClick={() => setShowConfirmation(true)}
        />
      </Tooltip>
    </>
  );
}
