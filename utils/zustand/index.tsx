import { create } from 'zustand';

import { UnitsSlice, createUnitsSlice } from './slices/units';
import { AlergensSlice, createAlergensSlice } from './slices/alergens';

export interface Store extends UnitsSlice, AlergensSlice {}

export const useStore = create<Store>()((...a) => ({
  ...createAlergensSlice(...a),
  ...createUnitsSlice(...a),
}));
