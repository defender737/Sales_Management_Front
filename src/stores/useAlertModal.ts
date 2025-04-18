import { create } from 'zustand'

interface AlertModalState {
    isOpen : boolean;
    content : string;
    buttonCount ?: 1| 2;
    cancleText ?: string,
    confirmText ?: string,
    onConfirm?: () => void;
    open : (
        payload :{
            content : string;
            buttonCount?: 1|2;
            onConfirm?: () => void;
            confirmText?: string,
            cancleText?: string
        }) => void
    close: () => void;
}

export const useAlertModal = create<AlertModalState>((set) => ({
    isOpen: false,
    content: '',
    buttonCount: 2,
    onConfirm: undefined,
    cancleText : undefined,
    confirmText : undefined,
    open: ({ content, buttonCount = 2, onConfirm, confirmText, cancleText }) => 
        set({ isOpen: true, content, buttonCount, onConfirm, confirmText, cancleText }),
    close: () => {
        set((state) => ({ ...state, isOpen: false, onConfirm: undefined }));
        setTimeout(() => {
          set({ content: '', cancleText : undefined, confirmText : undefined});
        }, 300);
      }
  }));