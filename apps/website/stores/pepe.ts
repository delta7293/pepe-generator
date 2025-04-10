import getTraits from '@/utils/getTraits';
import axios from 'axios';
import { StateCreator, create } from 'zustand';

type AppState = PepeState;

export interface Pepe {
  id: number;
  imageUrl?: string;
  isApproved: boolean;
  labels: string[];
  metadata?: string;
  traits: Array<{
    id: number;
    index: number;
    optionId: number;
    folder: string;
    file: string;
    imageUrl?: string;
    name: string;
    value: string;
  }>;
}

export interface Trait {
  id: number;
  folder: string;
  name: string;
  options: Array<{
    id: number;
    file: string;
    name: string;
  }>;
}

export interface PepeState {
  isFetching: boolean;
  setIsFetching: (isFetching: boolean) => void;

  isInitialized: boolean;
  setIsInitialized: (isInitialized: boolean) => void;

  traits: Trait[];
  setTraits: (traits: Trait[]) => void;

  fetchTraits: () => Promise<void>;
  reset: () => void;
}

export const createPepeSlice: StateCreator<PepeState> = (set, get) => ({
  isFetching: false,
  setIsFetching: (isFetching) => set(() => ({ isFetching })),

  isInitialized: false,
  setIsInitialized: (isInitialized) => set(() => ({ isInitialized })),

  traits: [],
  setTraits: (traits) => set(() => ({ traits })),

  fetchTraits: async () => {
    const traits = await getTraits();

    set({ traits });
  },

  reset: () => {
    set({ isFetching: false, isInitialized: false, traits: [] });
  },
});

export const usePepeStore = create<AppState>()((...args) => ({
  ...createPepeSlice(...args),
}));
