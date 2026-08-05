import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (tourId: string) => void;
  isWishlisted: (tourId: string) => boolean;
  setWishlist: (tourIds: string[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: ["t1", "t3"],

      toggleWishlist: (tourId: string) => {
        const current = get().wishlistIds;
        if (current.includes(tourId)) {
          set({ wishlistIds: current.filter((id) => id !== tourId) });
        } else {
          set({ wishlistIds: [...current, tourId] });
        }
      },

      isWishlisted: (tourId: string) => {
        return get().wishlistIds.includes(tourId);
      },

      setWishlist: (wishlistIds: string[]) => {
        set({ wishlistIds });
      },
    }),
    {
      name: "tripgo_wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
