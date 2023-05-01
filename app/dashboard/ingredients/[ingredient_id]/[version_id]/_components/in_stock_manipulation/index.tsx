'use client';

import Button from '@/lib/ui/button';
import ConfirmationModal from '@/lib/ui/confirmation_modal';
import {
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusCircleIcon,
  MinusIcon,
  PlusCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useStore } from '@/utils/zustand';
import { useIngredientVersionStore } from '../store';
import RemoveModal from './removal_modal';
import OrderModal from './order_modal';

export default function InStockManipulation() {
  const [showRemoveModal, setRemoveModal] = useState(false);
  const [showOrderModal, setOrderModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const router = useRouter();

  const currentVersion = useIngredientVersionStore(
    (state) => state.currentVersion
  );

  const units = useStore((state) => state.units);

  const futureOrders = currentVersion.orders
    .filter((order) => order.status === 'ordered')
    .map((order) => ({
      ...order,
      amount: order.amount,
      date: new Date(order.delivery_at!)
        .toDateString()
        .split(' ')
        .slice(1, 3)
        .reverse()
        .join(' '),
      type: 'Objednávka',
      remains: 0,
    }));

  const futureExpirations = currentVersion.orders
    .filter((order) => order.status === 'delivered')
    .map((order) => ({
      ...order,
      date: new Date(order.expires_at!)
        .toDateString()
        .split(' ')
        .slice(1, 3)
        .reverse()
        .join(' '),
      type: 'Expirácia',
      remains: 0,
    }));

  let futureStockChanges = [...futureOrders, ...futureExpirations];

  futureStockChanges.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (let i = 0; i < futureStockChanges.length; i++) {
    if (i === 0) {
      futureStockChanges[i].remains =
        currentVersion.in_stock +
        futureStockChanges[i].amount *
          futureStockChanges[i].unit.conversion_rate;
    } else {
      futureStockChanges[i].remains =
        futureStockChanges[i - 1].remains +
        futureStockChanges[i].amount *
          futureStockChanges[i].unit.conversion_rate;
    }
  }

  return (
    <>
      <RemoveModal
        show={showRemoveModal}
        onClose={() => setRemoveModal(false)}
        units={units}
        ingredientVersion={currentVersion}
      />
      <OrderModal
        show={showOrderModal}
        onClose={() => setOrderModal(false)}
        units={units}
        ingredientVersion={currentVersion}
      />

      <div className="flex h-full items-center">
        <Button
          variant="danger"
          onClick={() => setRemoveModal(true)}
          className="w-auto flex-none !p-2"
          disabled={currentVersion.in_stock === 0}
        >
          <MinusIcon className="h-3 w-3" />
        </Button>
        <p className="flex-none px-3">
          {currentVersion.in_stock} {currentVersion.unit.sign || 'Wrong unit'}
        </p>

        <Button
          variant="success"
          onClick={() => setOrderModal(true)}
          className="w-auto flex-none !p-2"
          disabled={currentVersion.status !== 'active'}
        >
          <PlusIcon className="h-3 w-3" />
        </Button>
        {expanded && futureStockChanges.length > 0 && (
          <div className="ml-4 mr-2 flex gap-4 overflow-x-auto">
            {futureStockChanges.map((data, index) => (
              <div
                key={index}
                className={`flex-basis-6 flex shrink-0 flex-col items-center ${
                  data.amount < 0 ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {data.amount > 0 ? (
                  <PlusIcon className="h-5 w-5 rounded-full bg-green-300/30 p-0.5" />
                ) : (
                  <MinusIcon
                    className="h-5 w-5 cursor-pointer rounded-full bg-red-300/30 p-1"
                    onClick={() => setRemoveModal(true)}
                  />
                )}
                <p className="font-semibold">
                  {data.amount > 0 ? '+' : '-'}
                  {data.amount} {data.unit.sign}
                </p>
                <p className="text-sm">{data.date}</p>
                <p className="text-sm">
                  {data.remains} N/A
                  {/* {ingredientVersion.unit.base_unit?.sign ||
                    ingredientVersion.unit.sign} */}
                </p>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500"
        >
          {expanded ? (
            <ChevronLeftIcon className="h-7 w-7 rounded-md p-1 hover:bg-black/5" />
          ) : (
            <ChevronRightIcon className="h-7 w-7 rounded-md p-1 hover:bg-black/5" />
          )}
        </button>
      </div>
    </>
  );
}
