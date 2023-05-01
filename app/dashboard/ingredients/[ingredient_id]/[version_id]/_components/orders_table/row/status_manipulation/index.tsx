import { IngredientVersionOrder } from '@/utils/db.types';

import { IconParams, StatusManipulationIcon } from './icon';
import { useIngredientVersionStore } from '../../../store';

const allowedActions: Record<
  IngredientVersionOrder['status'],
  Omit<IconParams, 'order_id'>[]
> = {
  awaiting_order: [{ status: 'ordered' }, { status: 'delete' }],
  ordered: [
    { status: 'awaiting_order', revert: true },
    { status: 'delivered' },
    { status: 'canceled' },
  ],
  delivered: [{ status: 'ordered', revert: true }, { status: 'expired' }],
  expired: [],
  canceled: [{ status: 'ordered', revert: true }],
};

interface StatusManipulationParams {
  order_id: number;
}

export async function StatusManipulationIcons({
  order_id,
}: StatusManipulationParams) {
  const order = useIngredientVersionStore((state) =>
    state.currentVersion.orders.find((order) => order.id === order_id)
  );

  if (!order) throw new Error(`Order with id: ${order_id} not found`);

  const allowed = allowedActions[order!.status];

  return (
    <div className="flex flex-row justify-center">
      {allowed.map((status, index) => (
        <StatusManipulationIcon key={index} {...status} order_id={order_id} />
      ))}
    </div>
  );
}
