'use client';
import Alert from '@/lib/ui/alert';
import { Progress, Table, Tooltip } from 'flowbite-react';

import { StatusManipulationIcons } from './row/status_manipulation';
import { useCallback, useState } from 'react';
import { useImmer } from 'use-immer';
import { useIngredientVersionStore } from '../store';
import OrderRow from './row';

// function ExpirationCell({
//   order,
// }: {
//   order: Pick<Order, 'id' | 'status' | 'expires_at'>;
// }) {
//   const [changeExpirationModal, setChangeExpirationModal] =
//     useState<boolean>(false);
//   const expirationFormRef = useRef<FormikProps<any>>(null);
//   const [confirmExpiredModal, setConfirmExpiredModal] =
//     useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   async function changeExpiration(date: Date) {
//     const formData = new FormData();
//     formData.append('expiration_date', date.toISOString().split('T')[0]);

//     // await fetch(modify_url + order.id.toString() + '/', {
//     //   method: 'PATCH',
//     //   body: formData,
//     // })
//     //   .then((response) => {
//     //     if (response.ok) {
//     //       return startTransition(() => window.location.reload());
//     //     } else {
//     //       return response.json();
//     //     }
//     //   })
//     //   .catch((error) => {
//     //     console.error('Error: ', error);
//     //     setErrorMessage('Nastala chyba pri spracovaní odpovede zo servera');
//     //   });
//   }

//   async function setExpired() {
//     const formData = new FormData();
//     formData.append('is_expired', 'true');

//     // await fetch(modify_url + order.id.toString() + '/', {
//     //   method: 'PATCH',
//     //   body: formData,
//     // })
//     //   .then((response) => {
//     //     if (response.ok) window.location.reload();
//     //     else {
//     //       return response.json();
//     //     }
//     //   })
//     //   .catch((error) => {
//     //     console.error('Error: ', error);
//     //     setErrorMessage('Nastala chyba pri spracovaní odpovede zo servera');
//     //   });
//   }

//   return (
//     <div className="flex w-full items-center justify-around">
//       <ConfirmationModal
//         show={changeExpirationModal}
//         onClose={() => setChangeExpirationModal(false)}
//         onConfirm={() => expirationFormRef.current?.submitForm()}
//         confirmText="Potvrdiť"
//         header="Zmeniť dátum expirácie"
//       >
//         <Alert onClose={() => setErrorMessage(null)} variant="danger">
//           {errorMessage}
//         </Alert>
//         <Formik
//           innerRef={expirationFormRef}
//           initialValues={{
//             expiration_date: new Date(order.expires_at ?? new Date()),
//           }}
//           onSubmit={(values) => {
//             changeExpiration(new Date(values.expiration_date));
//           }}
//         >
//           <DateTimeInput label="Nový dátum expirácie" name="expiration_date" />
//         </Formik>
//       </ConfirmationModal>
//       <ConfirmationModal
//         show={confirmExpiredModal}
//         onClose={() => setConfirmExpiredModal(false)}
//         onConfirm={setExpired}
//         confirmText="Potvrdiť"
//         header={'Potvrdiť expiráciu'}
//       >
//         <Alert onClose={() => setErrorMessage(null)} variant="danger">
//           {errorMessage}
//         </Alert>
//         <p>Ako dátum sa použije {order.expires_at}</p>
//         <p>Táto akcia sa dá vrátiť iba vymazaním vytvoreného odpisu.</p>
//       </ConfirmationModal>
//       {order.status === 'expired' ? (
//         <>
//           {order.expires_at
//             ? new Date(order.expires_at).toLocaleDateString('sk-SK')
//             : 'NULL'}
//         </>
//       ) : (
//         <a
//           className="cursor-pointer hover:underline"
//           onClick={() => setChangeExpirationModal(true)}
//         >
//           {order.expires_at
//             ? new Date(order.expires_at).toLocaleDateString('sk-SK')
//             : 'NULL'}
//         </a>
//       )}
//       {order.status === 'delivered' && (
//         <TrashIcon
//           className="h-5 w-5 cursor-pointer rounded-full text-danger hover:bg-danger/10"
//           onClick={() => setConfirmExpiredModal(true)}
//         />
//       )}
//     </div>
//   );
// }

export default async function OrdersTable() {
  const orders = useIngredientVersionStore(
    (state) => state.currentVersion.orders
  );

  const defaultShow = 5;

  const setNumberShowing = useCallback(
    (number: number) => {
      return orders
        .sort((a, b) => {
          if (a.delivery_at && b.delivery_at)
            return (
              new Date(b.delivery_at).getTime() -
              new Date(a.delivery_at).getTime()
            );
          else if (a.delivery_at) return -1;
          return 0;
        })
        .slice(0, number);
    },
    [orders]
  );

  const [activeOrders, setActiveOrders] = useImmer(
    setNumberShowing(defaultShow)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function showAllOrders() {
    setActiveOrders(setNumberShowing(orders.length));
  }

  function hideAllOrders() {
    setActiveOrders(setNumberShowing(defaultShow));
  }

  return (
    <>
      <Alert onClose={() => setErrorMessage(null)} variant="danger">
        {errorMessage}
      </Alert>
      {activeOrders.length > 0 ? (
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
            {activeOrders.map((order, index) => (
              <OrderRow key={index} order_id={order.id} />
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p className="w-full text-center text-sm text-gray-500">
          Žiadne objednávky
        </p>
      )}
      <div className="flex justify-between">
        {activeOrders.length == defaultShow && orders.length > defaultShow ? (
          <a
            onClick={showAllOrders}
            className="w-full cursor-pointer pt-1 text-center text-sm text-gray-600 hover:underline"
          >
            Zobraziť všetky
          </a>
        ) : activeOrders.length > defaultShow ? (
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
