import { immer } from 'zustand/middleware/immer';
import { FetchedData } from './fetchData';
import { create } from 'zustand';

interface IngredientVersionStore extends FetchedData {
  // getOrder: (id: number) => FetchedData['currentVersion']['orders'][0];
}

export const useIngredientVersionStore = create<IngredientVersionStore>()(
  immer<IngredientVersionStore>((set, get) => ({} as FetchedData))
);
