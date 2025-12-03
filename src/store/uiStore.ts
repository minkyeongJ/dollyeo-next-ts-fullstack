import { create } from "zustand";
import type { RouletteResult } from "@/types/data";

// ==================== UI Store ====================

interface UIStore {
  // 모달 상태
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;

  // 모달 액션
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;

  // 사이드바 상태
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // 모달 초기 상태
  isModalOpen: false,
  modalContent: null,

  // 모달 액션
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),

  // 사이드바 초기 상태
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));

// ==================== Roulette Store ====================

interface RouletteStore {
  // 상태
  items: string[];
  isSpinning: boolean;
  result: RouletteResult | null;

  // 액션
  setItems: (items: string[]) => void;
  addItem: (item: string) => void;
  removeItem: (index: number) => void;
  clearItems: () => void;
  startSpinning: () => void;
  stopSpinning: (result: RouletteResult) => void;
  resetResult: () => void;
}

export const useRouletteStore = create<RouletteStore>((set) => ({
  // 초기 상태
  items: [],
  isSpinning: false,
  result: null,

  // 액션 구현
  setItems: (items) => set({ items }),

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index),
    })),

  clearItems: () => set({ items: [], result: null }),

  startSpinning: () => set({ isSpinning: true, result: null }),

  stopSpinning: (result) => set({ isSpinning: false, result }),

  resetResult: () => set({ result: null }),
}));

