import { create } from 'zustand';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  show: boolean;
}

interface UIState {
  activeTab: string;
  toast: ToastState;
  badgeCelebration: string | null;
  setActiveTab: (tab: string) => void;
  showToast: (message: string, type: ToastState['type'], durationMs?: number) => void;
  hideToast: () => void;
  showBadgeCelebration: (badgeId: string) => void;
  dismissBadgeCelebration: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'summary',
  toast: { message: '', type: 'info', show: false },
  badgeCelebration: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  showToast: (message, type, durationMs = 4000) => {
    if (toastTimer) clearTimeout(toastTimer);

    set({ toast: { message, type, show: true } });

    toastTimer = setTimeout(() => {
      set((state) => ({ toast: { ...state.toast, show: false } }));
      toastTimer = null;
    }, durationMs);
  },
  hideToast: () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    set((state) => ({ toast: { ...state.toast, show: false } }));
  },
  showBadgeCelebration: (badgeId) => set({ badgeCelebration: badgeId }),
  dismissBadgeCelebration: () => set({ badgeCelebration: null }),
}));
