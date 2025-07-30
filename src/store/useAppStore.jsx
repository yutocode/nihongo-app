// src/store/useAppStore.jsx
import { create } from 'zustand';

export const useAppStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  xp: 0,
  level: 1,
  setXP: (xp) => set({ xp }),
  setLevel: (level) => set({ level }),
}));


