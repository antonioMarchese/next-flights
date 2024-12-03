import { create } from "zustand";

export type ModalStore = {
  isOpen: boolean;
  isFrom: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsFrom: (isFrom: boolean) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set(() => ({ isOpen })),
  isFrom: false,
  setIsFrom: (isFrom: boolean) => set(() => ({ isFrom })),
}));
