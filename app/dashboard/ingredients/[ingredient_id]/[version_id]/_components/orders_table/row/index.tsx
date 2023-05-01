import { Progress, Table, Tooltip } from 'flowbite-react';
import { useIngredientVersionStore } from '../../store';
import { StatusManipulationIcons } from './status_manipulation';

export default function OrderRow({ order_id }: { order_id: number }) {
  const order = useIngredientVersionStore((state) =>
    state.currentVersion.orders.find((order) => order.id === order_id)
  );

  if (!order) throw new Error(`Order with id: ${order_id} not found`);

  return (
    <Table.Row
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
            content={new Date(order.ordered_at).toLocaleTimeString('sk-SK')}
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
            content={new Date(order.delivery_at).toLocaleTimeString('sk-SK')}
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
        {/* <ExpirationCell order={order} /> */}
      </Table.Cell>
      <Table.Cell className="!p-1 text-center text-sm">
        {order.amount} {order.unit.sign}
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
        {/* @ts-expect-error Async Server Component */}
        <StatusManipulationIcons order_id={order.id} />
      </Table.Cell>
    </Table.Row>
  );
}
