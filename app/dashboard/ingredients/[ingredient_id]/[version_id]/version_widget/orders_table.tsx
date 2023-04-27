'use client';

import Alert from '@/lib/ui/alert';
import ConfirmationModal from '@/lib/ui/confirmation_modal';
import DateTimeInput from '@/lib/forms/date_time';
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  ArrowUturnLeftIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Table, Tooltip } from 'flowbite-react';
import { Formik, FormikProps } from 'formik';
import { useRouter } from 'next/navigation';
import { startTransition, useRef, useState, useTransition } from 'react';
import { IngredientVersionOrder } from '@/lib/database.types';
import { Menu } from '@headlessui/react';

type Order = IngredientVersionOrder;

function ChangeStatus({
  modify_url,
  order,
}: {
  modify_url: string;
  order: Pick<Order, 'status' | 'amount' | 'in_stock'>;
}) {
  const [status, setStatus] = useState<Order['status'] | null>(null);
  const formRef = useRef<FormikProps<any>>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (order.status == 'delivered' && order.amount !== order.in_stock)
    return <></>;

  async function changeStatus(status: Order['status'], date?: Date) {
    // Require sate for delivered and ordered
    if ((status === 'delivered' || status === 'ordered') && !date) {
      setErrorMessage('Dátum doručenia je povinný');
      return;
    }

    // TODO:
    setIsSubmitting(true);
    console.log(
      'Snažím sa zmeniť stav doručenia, ale ešte to Timko nenaprogramoval'
    );
    setIsSubmitting(false);
    setStatus(null);
  }

  return (
    <>
      <ConfirmationModal
        show={status !== null}
        onClose={() => setStatus(null)}
        onConfirm={() =>
          formRef.current?.submitForm() ?? (status && changeStatus(status))
        }
        confirmText="Potvrdiť"
        header={
          status
            ? `Potvrďte zmenu stavu z "${order.status}" na "${status}"`
            : 'Potvrďte vymazanie receptu'
        }
        variant={status === 'canceled' ? 'danger' : 'primary'}
        disableConfirm={isSubmitting}
      >
        <Alert onClose={() => setErrorMessage(null)} variant="danger">
          {errorMessage}
        </Alert>
        {status === 'ordered' || status === 'delivered' ? (
          <Formik
            innerRef={formRef}
            initialValues={{
              delivery_date: new Date(),
            }}
            onSubmit={(values) => {
              status && changeStatus(status, new Date(values.delivery_date));
            }}
          >
            <DateTimeInput label="Dátum doručenia" name="delivery_date" time />
          </Formik>
        ) : (
          <></>
        )}
      </ConfirmationModal>
      <Menu>
        <Menu.Button>More</Menu.Button>
        <Menu.Items>
          <Menu.Item>
            {({ active }) => (
              <ArrowLeftOnRectangleIcon
                className={`mr-2 h-5 w-5 cursor-pointer text-primary ${
                  active && 'bg-primary-200'
                }`}
              />
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <ArrowRightOnRectangleIcon
                className={`mr-2 h-5 w-5 cursor-pointer text-primary ${
                  active && 'bg-primary-200'
                }`}
              />
            )}
          </Menu.Item>
          <Menu.Item disabled>
            <span className="opacity-75">Invite a friend (coming soon!)</span>
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </>
  );
}

// function DeleteOrder({
//   modify_url,
//   order,
// }: {
//   modify_url: string;
//   order: Order;
// }) {
//   if (order.amount !== order.in_stock_amount) return <></>;
//   const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);

//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   async function deleteOrder() {
//     setIsSubmitting(true);
//     fetch(modify_url + order.id.toString() + '/', {
//       method: 'DELETE',
//     })
//       .then((response) =>
//         parseInvalidResponse(
//           response,
//           (field, errorMsg) =>
//             setErrorMessage(errorMessage + '\n' + field + ': ' + errorMsg),
//           setErrorMessage,
//           true
//         )
//       )
//       .catch((error) => {
//         console.log('Error: ', error);
//         setErrorMessage('Nastala chyba pri spracovaní odpovede zo servera');
//       })
//       .finally(() => setIsSubmitting(false));
//   }

//   return (
//     <>
//       <ConfirmationModal
//         show={confirmDeleteModal}
//         onClose={() => setConfirmDeleteModal(false)}
//         onConfirm={deleteOrder}
//         confirmText="Potvrdiť"
//         header="Potvďte zmazanie"
//         variant="danger"
//         disableConfirm={isSubmitting}
//       >
//         <Alert onClose={() => setErrorMessage(null)} variant="danger">
//           {errorMessage}
//         </Alert>
//         <p>
//           Naozaj chcete zmazať objednávku {order.id}? Táto akcia je nevratná.
//         </p>
//       </ConfirmationModal>
//       <button
//         onClick={() => {
//           setConfirmDeleteModal(true);
//         }}
//       >
//         <TrashIcon className="h-5 w-5 text-danger" />
//       </button>
//     </>
//   );
// }

// function ActionsCell({
//   modify_url,
//   order,
// }: {
//   modify_url: string;
//   order: Order;
// }) {
//   return (
//     <>
//       <ToggleDelivered modify_url={modify_url} order={order} />
//       <DeleteOrder modify_url={modify_url} order={order} />
//     </>
//   );
// }

function ExpirationCell({
  modify_url,
  order,
}: {
  modify_url: string;
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

    await fetch(modify_url + order.id.toString() + '/', {
      method: 'PATCH',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return startTransition(() => window.location.reload());
        } else {
          return response.json();
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
        setErrorMessage('Nastala chyba pri spracovaní odpovede zo servera');
      });
  }

  async function setExpired() {
    const formData = new FormData();
    formData.append('is_expired', 'true');

    await fetch(modify_url + order.id.toString() + '/', {
      method: 'PATCH',
      body: formData,
    })
      .then((response) => {
        if (response.ok) window.location.reload();
        else {
          return response.json();
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
        setErrorMessage('Nastala chyba pri spracovaní odpovede zo servera');
      });
  }

  return (
    <>
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
            expiration_date: new Date(order.expires_at),
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
        <p>{order.expires_at}</p>
      ) : (
        <a
          className="cursor-pointer hover:underline"
          onClick={() => setChangeExpirationModal(true)}
        >
          {order.expires_at}
        </a>
      )}
      {order.status === 'delivered' && (
        <TrashIcon
          className="h-5 w-5 cursor-pointer rounded-full text-danger hover:bg-danger/10"
          onClick={() => setConfirmExpiredModal(true)}
        />
      )}
    </>
  );
}

export default function OrdersTable({
  data,
  modify_url,
}: {
  data: Pick<
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
  >[];
  modify_url: string;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sort orders by the delivery_data

  const [orders, setOrders] = useState(data.slice(0, 2));

  function showAllOrders() {
    setOrders(data);
  }

  function hideAllOrders() {
    setOrders(data.slice(0, 2));
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
            <Table.HeadCell>
              <span className="sr-only !p-1">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {orders.map((order, index) => (
              <Table.Row
                key={index}
                className={`${
                  order.status === 'awaiting_order'
                    ? 'bg-blue/10'
                    : order.status === 'ordered'
                    ? 'bg-yellow/10'
                    : 'bg-slate/10'
                }`}
              >
                <Table.Cell className="!p-1 text-center text-sm">
                  {order.ordered_at}
                </Table.Cell>
                <Table.Cell className="!p-1 text-center text-sm">
                  {order.delivery_at}
                </Table.Cell>
                <Table.Cell className="flex items-center justify-center !p-1 text-center text-sm">
                  <ExpirationCell modify_url={modify_url} order={order} />
                </Table.Cell>
                <Table.Cell className="!p-1 text-center text-sm">
                  {order.amount} {order.unit}
                </Table.Cell>
                <Table.Cell className="!p-1 text-center text-sm">
                  {order.in_stock} {order.unit}
                </Table.Cell>
                <Table.Cell className="!p-1 text-center text-sm">
                  {order.cost} €
                </Table.Cell>
                <Table.Cell className="!p-1 text-center text-sm">
                  <ChangeStatus modify_url={modify_url} order={order} />
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
        {orders.length == 2 && orders.length > 2 ? (
          <a
            onClick={showAllOrders}
            className="w-full cursor-pointer pt-1 text-center text-sm text-gray-600 hover:underline"
          >
            Zobraziť všetky
          </a>
        ) : orders.length > 2 ? (
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
