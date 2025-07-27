import { create } from "zustand";

export type SortDirection = "asc" | "desc" | false;

interface SortingState {
  sortBy: string | null;
  sortDirection: SortDirection;
}

interface SortingStore {
  sorting: SortingState;
  setSorting: (sortBy: string | null, sortDirection: SortDirection) => void;
  resetSorting: () => void;
}

export const useSortingStore = create<SortingStore>((set) => ({
  sorting: { sortBy: null, sortDirection: false },
  setSorting: (sortBy: string | null, sortDirection: SortDirection) =>
    set({ sorting: { sortBy, sortDirection } }),
  resetSorting: () =>
    set({ sorting: { sortBy: null, sortDirection: false } }),
})); 