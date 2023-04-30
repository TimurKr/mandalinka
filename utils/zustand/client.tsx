'use client';

import { useStore } from '.';
import type { Store } from '.';

export default function ClientStore({ data }: { data: Partial<Store> }) {
  useStore.setState(data);
  return null;
}
