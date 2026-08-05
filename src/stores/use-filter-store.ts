import { create } from "zustand";

export interface FilterState {
  search: string;
  dest: string;
  type: string;
  minPrice: number;
  maxPrice: number;
  duration: number;
  minRating: number;
  sort: string;
  page: number;
  limit: number;

  setSearch: (search: string) => void;
  setDest: (dest: string) => void;
  setType: (type: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setDuration: (days: number) => void;
  setMinRating: (rating: number) => void;
  setSort: (sort: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const initialFilters = {
  search: "",
  dest: "",
  type: "",
  minPrice: 0,
  maxPrice: Infinity,
  duration: 0,
  minRating: 0,
  sort: "recommended",
  page: 1,
  limit: 6,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialFilters,

  setSearch: (search) => set({ search, page: 1 }),
  setDest: (dest) => set({ dest, page: 1 }),
  setType: (type) => set({ type, page: 1 }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice, page: 1 }),
  setDuration: (duration) => set({ duration, page: 1 }),
  setMinRating: (minRating) => set({ minRating, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ ...initialFilters }),
}));
