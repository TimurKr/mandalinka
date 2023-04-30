'use client';

import Alert from '@/lib/ui/alert';
import ConfirmationModal from '@/lib/ui/confirmation_modal';
import {
  ArchiveBoxArrowDownIcon,
  ArrowDownOnSquareIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  ArrowUturnLeftIcon,
  DocumentArrowUpIcon,
  EllipsisHorizontalIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  ReceiptRefundIcon,
  TrashIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { Progress, Table, Tooltip } from 'flowbite-react';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { startTransition, useRef, useState, useTransition } from 'react';
import { IngredientVersionOrder, Unit } from '@/utils/db.types';
import { Menu } from '@headlessui/react';
import { DateTimeInput } from '@/lib/forms';
import { useSupabase } from '@/utils/supabase/client';

type Order = IngredientVersionOrder;

function StatusActions({
  order,
}: {
  order: Pick<
    Order,
    | 'id'
    | 'status'
    | 'amount'
    | 'cost'
    | 'in_stock'
    | 'ordered_at'
    | 'delivery_at'
    | 'expires_at'
    | 'ingredient_version'
  > & {
    unit: Pick<Unit, 'sign' | 'conversion_rate'>;
  };
}) {
  const supabase = useSupabase();
  const router = useRouter();
  const [status, setStatus] = useState<Order['status'] | 'delete' | null>(null);
  const formRef = useRef<FormikProps<any>>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (order.status == 'delivered' && order.amount !== order.in_stock)
    return <></>;

  async function changeStatus(status: Order['status'] | 'delete', date?: Date) {
    setIsSubmitting(true);
    if (status === 'expired') {
      setErrorMessage('Expirácia sa určuje inde');
      return;
    }

    // Require date for delivered and ordered
    if (!date && (status === 'delivered' || status === 'ordered')) {
      setErrorMessage('Dátum je povinný');
      return;
    }

    // DELETE
    if (status === 'delete') {
      const { error } = await supabase
        .from('ingredient_version_order')
        .delete()
        .eq('id', order.id);
      if (error) {
        setErrorMessage(error.message);
        setIsSubmitting(false);
        return;
      }
    }
    // UPDATE
    else {
      const { error } = await supabase
        .from('ingredient_version_order')
        .update({
          status,
          ordered_at: status === 'ordered' ? date?.toISOString() : undefined,
          delivery_at: status === 'delivered' ? date?.toISOString() : undefined,
          in_stock: status === 'delivered' ? order.amount : 0,
        })
        .eq('id', order.id);
      if (error) {
        setErrorMessage(error.message);
        setIsSubmitting(false);
        return;
      }
    }

    // UPDATE IN STOCK
    const { error } = await supabase.rpc('update_ingredient_version_in_stock', {
      ingredient_version_id: order.ingredient_version,
    });
    if (error) {
      setErrorMessage(`Error updating stock: ${error.message}`);
      setIsSubmitting(false);
      startTransition(() => {
        router.refresh();
      });
      return;
    }

    // UPDATE COST
    if (status === 'ordered') {
      const { error } = await supabase
        .from('ingredient_version')
        .update({
          cost: order.cost / ((order.amount * order.unit.conversion_rate) / 1),
          // ingredientVersion.unit.conversion_rate), TODO: fix conversion rate
        })
        .eq('id', order.ingredient_version);
      if (error) {
        setErrorMessage(`Error updating cost: ${error.message}`);
        setIsSubmitting(false);
        startTransition(() => {
          router.refresh();
        });
        return;
      }
    }

    return startTransition(() => {
      setErrorMessage(null);
      setStatus(null);
      setIsSubmitting(false);
      router.refresh();
    });
  }

  function getIcon(type: Order['status'] | 'delete', color: string) {
    const className = `w-6 h-6 p-1 rounded-md cursor-pointer text-${color}-600 hover:bg-${color}-200 cursor-pointer active:bg-${color}-300`;
    const iconProps = {
      className,
      onClick: () => setStatus(type),
    };
    const tooltipProps = {
      content:
        type === 'awaiting_order'
          ? 'Vrátiť do prípravy'
          : type === 'ordered'
          ? 'Označiť za objednané'
          : type === 'delivered'
          ? 'Označiť za doručené'
          : type === 'canceled'
          ? 'Označiť za zrušené'
          : type === 'delete'
          ? 'Vymazať'
          : 'Unknown status',
      arrow: false,
    };

    return (
      <Tooltip {...tooltipProps} placement="left">
        {type === 'awaiting_order' ? (
          <PencilSquareIcon {...iconProps} />
        ) : type === 'ordered' ? (
          <TruckIcon {...iconProps} />
        ) : type === 'delivered' ? (
          <ArrowDownOnSquareIcon {...iconProps} />
        ) : type === 'canceled' ? (
          <ArchiveBoxArrowDownIcon {...iconProps} />
        ) : type === 'delete' ? (
          <TrashIcon {...iconProps} />
        ) : (
          <></>
        )}
      </Tooltip>
    );
  }

  const active_icons = {
    awaiting_order: [getIcon('ordered', 'green'), getIcon('delete', 'red')],
    ordered: [
      getIcon('awaiting_order', 'red'),
      getIcon('delivered', 'green'),
      getIcon('canceled', 'red'),
    ],
    delivered: [getIcon('ordered', 'red')],
    canceled: [getIcon('ordered', 'green')],
    expired: [],
  };

  return (
    <>
      <ConfirmationModal
        show={status !== null}
        onClose={() => setStatus(null)}
        onConfirm={() => {
          formRef.current?.submitForm() ?? (status && changeStatus(status));
        }}
        confirmText="Potvrdiť"
        header={`Potvrďte ${
          status === 'ordered'
            ? 'objednávku'
            : status === 'delivered'
            ? 'doručenie'
            : status === 'canceled'
            ? 'zrušenie'
            : status === 'awaiting_order'
            ? 'vrátenie do prípravy'
            : status === 'delete'
            ? 'vymazanie'
            : `Unknown status ${status}`
        }`}
        variant={status === 'canceled' ? 'danger' : 'primary'}
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
              changeStatus(status, new Date(values.date));
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

      <div className="flex items-center justify-center gap-1">
        {active_icons[order.status]}
      </div>
    </>
  );
}

function ExpirationCell({
  order,
}: {
  order: Pick<Order, 'id' | 'status' | 'expires_at'>;
}) {
  const [changeExpirationModal, setChangeExpirationModal] =
    useState<boolean>(false);
  const expirationFormRef = useRef<FormikProps<any>>(null);
  const [confirmExpiredModal, setConfirmExpiredModal] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function changeExpiration(date: Date) {
    const formData = new FormData();
    formData.append('expiration_date', date.toISOString().split('T')[0]);

    // await fetch(modify_url + order.id.toString() + '/', {
    //   method: 'PATCH',
    //   body: formData,
    // })
    //   .then((response) => {
    //     if (response.ok) {
    //       return startTransition(() => window.location.reload());
    //     } else {
    //       return response.json();
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error: ', error);
    //     setErrorMessage('Nastala chyba pri spracovaní odpovede zo servera');
    //   });
  }

  async function setExpired() {
    const formData = new FormData();
    formData.append('is_expired', 'true');

    // await fetch(modify_url + order.id.toString() + '/', {
    //   method: 'PATCH',
    //   body: formData,
    // })
    //   .then((response) => {
    //     if (response.ok) window.location.reload();
    //     else {
    //       return response.json();
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error: ', error);
    //     setErrorMessage('Nastala chyba pri spracovaní odpovede zo servera');
    //   });
  }

  return (
    <div className="flex w-full items-center justify-around">
      <ConfirmationModal
        show={changeExpirationModal}
        onClose={() => setChangeExpirationModal(false)}
        onConfirm={() => expirationFormRef.current?.submitForm()}
        confirmText="Potvrdiť"
        header="Zmeniť dátum expirácie"
      >
        <Alert onClose={() => setErrorMessage(null)} variant="danger">
          {errorMessage}
        </Alert>
        <Formik
          innerRef={expirationFormRef}
          initialValues={{
            expiration_date: new Date(order.expires_at ?? new Date()),
          }}
          onSubmit={(values) => {
            changeExpiration(new Date(values.expiration_date));
          }}
        >
          <DateTimeInput label="Nový dátum expirácie" name="expiration_date" />
        </Formik>
      </ConfirmationModal>
      <ConfirmationModal
        show={confirmExpiredModal}
        onClose={() => setConfirmExpiredModal(false)}
        onConfirm={setExpired}
        confirmText="Potvrdiť"
        header={'Potvrdiť expiráciu'}
      >
        <Alert onClose={() => setErrorMessage(null)} variant="danger">
          {errorMessage}
        </Alert>
        <p>Ako dátum sa použije {order.expires_at}</p>
        <p>Táto akcia sa dá vrátiť iba vymazaním vytvoreného odpisu.</p>
      </ConfirmationModal>
      {order.status === 'expired' ? (
        <>
          {order.expires_at
            ? new Date(order.expires_at).toLocaleDateString('sk-SK')
            : 'NULL'}
        </>
      ) : (
        <a
          className="cursor-pointer hover:underline"
          onClick={() => setChangeExpirationModal(true)}
        >
          {order.expires_at
            ? new Date(order.expires_at).toLocaleDateString('sk-SK')
            : 'NULL'}
        </a>
      )}
      {order.status === 'delivered' && (
        <TrashIcon
          className="h-5 w-5 cursor-pointer rounded-full text-danger hover:bg-danger/10"
          onClick={() => setConfirmExpiredModal(true)}
        />
      )}
    </div>
  );
}

export default function OrdersTable({
  data,
}: {
  data: (Pick<
    Order,
    | 'id'
    | 'status'
    | 'ordered_at'
    | 'delivery_at'
    | 'expires_at'
    | 'amount'
    | 'unit'
    | 'in_stock'
    | 'cost'
    | 'ingredient_version'
  > & {
    unit: Pick<Unit, 'sign' | 'conversion_rate'>;
  })[];
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sort orders by the delivery_data

  const [orders, setOrders] = useState(data.slice(0, 5));

  function showAllOrders() {
    setOrders(data);
  }

  function hideAllOrders() {
    setOrders(data.slice(0, 5));
  }

  return (
    <>
      <Alert onClose={() => setErrorMessage(null)} variant="danger">
        {errorMessage}
      </Alert>
      {orders.length > 0 ? (
        <Table className="w-full table-auto pt-1">
          <Table.Head className="w-full justify-between text-xs uppercase">
            <Table.HeadCell className="!p-1 text-center">
              Dátum objednávky
            </Table.HeadCell>
            <Table.HeadCell className="!p-1 text-center">
              Dátum doručenia
            </Table.HeadCell>
            <Table.HeadCell className="!p-1 text-center">
              Expirácia
            </Table.HeadCell>
            <Table.HeadCell className="!p-1 text-center">
              Množstvo
            </Table.HeadCell>
            <Table.HeadCell className="!p-1 text-center">
              Na sklade
            </Table.HeadCell>
            <Table.HeadCell className="!p-1 text-center">Cena</Table.HeadCell>
            <Table.HeadCell className="!p-1 text-center">Akcie</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {orders.map((order, index) => (
              <Table.Row
                key={index}
                className={
                  order.status === 'awaiting_order'
                    ? 'bg-yellow-300/10'
                    : order.status === 'ordered'
                    ? 'bg-green-100/20'
                    : order.status === 'delivered'
                    ? 'bg-green-500/10'
                    : order.status === 'expired'
                    ? 'bg-gray-300/10'
                    : order.status === 'canceled'
                    ? 'bg-red-300/30'
                    : 'bg-red-500'
                }
              >
                <Table.Cell className="!p-1 text-center text-sm">
                  {order.ordered_at ? (
                    <Tooltip
                      content={new Date(order.ordered_at).toLocaleTimeString(
                        'sk-SK'
                      )}
                      style="dark"
                      placement="bottom"
                      arrow={false}
                    >
                      {new Date(order.ordered_at).toLocaleDateString('sk-SK')}
                    </Tooltip>
                  ) : (
                    'NULL'
                  )}
                </Table.Cell>
                <Table.Cell className="!p-1 text-center text-sm">
                  {order.delivery_at ? (
                    <Tooltip
                      content={new Date(order.delivery_at).toLocaleTimeString(
                        'sk-SK'
                      )}
                      style="dark"
                      placement="bottom"
                      arrow={false}
                    >
                      {new Date(order.delivery_at).toLocaleDateString('sk-SK')}
                    </Tooltip>
                  ) : (
                    'NULL'
                  )}
                </Table.Cell>
                <Table.Cell className="flex items-center justify-center !p-1 text-center text-sm">
                  <ExpirationCell order={order} />
                </Table.Cell>
                <Table.Cell className="!p-1 text-center text-sm">
                  {order.amount} {order.unit}
                </Table.Cell>
                <Table.Cell className="!p-1 text-center text-sm">
                  {/* {order.in_stock} {order.unit} ({Math.round((order.in_stock / order.amount) * 100)}%) */}
                  {order.in_stock != 0 ? (
                    <>
                      {order.in_stock} {order.unit} (
                      {Math.round((order.in_stock / order.amount) * 100)}%)
                      <Progress
                        progress={(order.in_stock / order.amount) * 100}
                        size="sm"
                        color="green"
                      />
                    </>
                  ) : (
                    <> - </>
                  )}
                </Table.Cell>
                <Table.Cell className="!p-1 text-center text-sm">
                  {order.cost} €
                </Table.Cell>
                <Table.Cell className="!p-1 text-center text-sm">
                  <StatusActions order={order} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p className="w-full text-center text-sm text-gray-500">
          Žiadne objednávky
        </p>
      )}
      <div className="flex justify-between">
        {orders.length == 5 && data.length > 5 ? (
          <a
            onClick={showAllOrders}
            className="w-full cursor-pointer pt-1 text-center text-sm text-gray-600 hover:underline"
          >
            Zobraziť všetky
          </a>
        ) : orders.length > 5 ? (
          <a
            onClick={hideAllOrders}
            className="w-full cursor-pointer pt-1 text-center text-sm text-gray-600 hover:underline"
          >
            Zobraziť menej
          </a>
        ) : null}
      </div>
    </>
  );
}
