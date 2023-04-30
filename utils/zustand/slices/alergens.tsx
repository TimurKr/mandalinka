import { StateCreator, create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

import { Alergen } from '@/utils/db.types';

export interface AlergensSlice {
  alergens: Pick<Alergen, 'id' | 'label'>[];
}

export const createAlergensSlice: StateCreator<
  any,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [['zustand/devtools', never], ['zustand/immer', never]],
  AlergensSlice
> = devtools(
  immer<AlergensSlice>((set) => ({
    alergens: [],
  }))
);
