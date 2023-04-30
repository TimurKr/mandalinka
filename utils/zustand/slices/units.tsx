import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

import { Unit } from '@/utils/db.types';

export interface UnitsSlice {
  units: Pick<Unit, 'sign' | 'property' | 'conversion_rate' | 'name'>[];
}

export const createUnitsSlice: StateCreator<
  any,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [['zustand/devtools', never], ['zustand/immer', never]],
  UnitsSlice
> = devtools(
  immer<UnitsSlice>((set) => ({
    units: [],
  }))
);
