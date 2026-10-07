// ─── Zustand UI Store ────────────────────────────────────────

import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  celebrationEventId: string | null;
  activeSplash: boolean;
  isOnline: boolean;
  // MEDIUM FIX: Keep private-unlock flag in memory ONLY.
  // sessionStorage is readable/writable by any JS on the page (XSS risk).
  // In-memory state resets automatically on tab close — the correct behavior for a session lock.
  isPrivateUnlocked: boolean;
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  triggerCelebration: (eventId: string | null) => void;
  setSplashActive: (active: boolean) => void;
  setOnline: (online: boolean) => void;
  setPrivateUnlocked: (unlocked: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  celebrationEventId: null,
  activeSplash: true,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isPrivateUnlocked: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  triggerCelebration: (eventId) => set({ celebrationEventId: eventId }),
  setSplashActive: (active) => set({ activeSplash: active }),
  setOnline: (online) => set({ isOnline: online }),
  setPrivateUnlocked: (unlocked) => set({ isPrivateUnlocked: unlocked }),
}));
