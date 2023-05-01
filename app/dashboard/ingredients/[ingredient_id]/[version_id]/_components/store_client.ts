'use client';

import type { FetchedData } from './fetchData';
import { useIngredientVersionStore } from './store';

export default function ClientStore({ data }: { data: FetchedData }) {
  useIngredientVersionStore.setState(data);
  return null;
}
