import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  currentRecipe: any | null;
  setCurrentRecipe: (recipe: any) => void;
  favorites: string[];
  toggleFavorite: (recipeId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentRecipe: null,
      setCurrentRecipe: (recipe) => set({ currentRecipe: recipe }),
      favorites: [],
      toggleFavorite: (recipeId) =>
        set((state) => ({
          favorites: state.favorites.includes(recipeId)
            ? state.favorites.filter((id) => id !== recipeId)
            : [...state.favorites, recipeId],
        })),
    }),
    {
      name: 'savora-storage',
    }
  )
);
