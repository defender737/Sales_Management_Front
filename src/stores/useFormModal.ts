// stores/useFormModal.ts
import { create } from 'zustand';

interface FormModalState {
  isOpen: boolean;
  title: string;
  subTitle?: string;
  formComponent: React.ReactNode | null;
  open: (
    payload: {
        title: string;
        subTitle?: string;
        formComponent: React.ReactNode
    }) => void;
  close: () => void;
}

export const useFormModal = create<FormModalState>((set) => ({
  isOpen: false,
  title: '',
  subTitle: '',
  formComponent: null,
  open: ({ title, subTitle = '', formComponent }) => set({ isOpen: true, title, subTitle, formComponent }),
  close: () => {
    set((state) => ({ ...state, isOpen: false }));
    setTimeout(() => {
      set({ title: '', subTitle: '', formComponent: null });
    }, 300);
  }
}));