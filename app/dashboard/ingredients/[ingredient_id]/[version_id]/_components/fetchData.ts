import 'server-only';

import React, { Suspense, cache } from 'react';

import { getServerSupabase } from '@/utils/supabase/server';
import { fetchUnits } from '@/utils/fetch';
import { getSingle, getArray } from '@/utils/fetch/helpers';

export const fetchData = cache(async (version_id: string) => {
  const supabase = getServerSupabase();

  const currentVersionPromise = supabase
    .from('ingredient_version')
    .select(
      `
      id,
      cost,
      created_at,
      expiration_period,
      in_stock,
      source,
      status,
      status_changed_at,
      ingredient (unit (*)),
      orders:ingredient_version_order (
        id,
        ingredient_version,
        status,
        ordered_at,
        delivery_at,
        expires_at,
        amount, 
        unit (*),
        in_stock,
        cost,
        status_changed_at
        ),
      removals:ingredient_version_removal (
        id,
        removed_at,
        amount,
        unit,
        reason,
        extra_info
        )
      `
    )
    .eq('id', version_id)
    .order('delivery_at', {
      foreignTable: 'ingredient_version_order',
      ascending: false,
    })
    .order('removed_at', {
      foreignTable: 'ingredient_version_removal',
      ascending: false,
    })
    .single()
    .throwOnError();

  const [{ data: currentVersionData }, units] = await Promise.all([
    currentVersionPromise,
    fetchUnits(),
  ]);

  const currentVersion = {
    ...currentVersionData!,
    unit: getSingle(getSingle(currentVersionData!.ingredient).unit),
    orders: getArray(currentVersionData!.orders)
      .map((order) => ({
        ...order,
        unit: getSingle(order.unit),
      }))
      .sort(
        // First, awaiting order, then ordered, then delivered then rest, secondly by status_changed_at
        (a, b) => {
          const statusOrder = {
            awaiting_order: 0,
            ordered: 1,
            delivered: 2,
            canceled: 3,
            expired: 3,
          };
          return (
            statusOrder[a.status] - statusOrder[b.status] ||
            (a.status_changed_at < b.status_changed_at ? 1 : -1)
          );
        }
      ),
    removals: getArray(currentVersionData!.removals),
    ingredient: getSingle(currentVersionData!.ingredient),
  };

  return {
    currentVersion: currentVersion,
    units: units,
  };
});

export type FetchedData = Awaited<ReturnType<typeof fetchData>>;
