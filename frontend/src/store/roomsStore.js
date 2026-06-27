import { create } from "zustand";

/**
 * Zustand store for rooms UI state.
 * React Query handles the server/cache layer;
 * this store holds client-only UI state (selected category filter).
 */
export const useRoomsStore = create((set) => ({
  categoryFilter: "All",
  setCategoryFilter: (cat) => set({ categoryFilter: cat }),
}));
