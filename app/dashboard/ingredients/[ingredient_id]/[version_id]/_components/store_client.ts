'use client';

import { useRef } from 'react';
import type { FetchedData } from './fetchData';
import { useIngredientVersionStore } from './store';

export default function ClientStore({ data }: { data: FetchedData }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useIngredientVersionStore.setState(data);
    initialized.current = true;
  }
  return null;
}
