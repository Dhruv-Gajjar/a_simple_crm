import { Client } from "@/types";
import { create } from "zustand";

type State = {
  selectedClientID: string | null;
  isCreateClientModalOpen: boolean;
  isEditClientModalOpen: boolean;
  setOpenCreateClient: () => void;
  setOpenEditClient: () => void;
};

export const useClientStore = create<State>((set) => ({
  selectedClientID: null,
  isCreateClientModalOpen: false,
  isEditClientModalOpen: false,
  setOpenCreateClient: () =>
    set((state) => ({
      isCreateClientModalOpen: !state.isCreateClientModalOpen,
    })),
  setOpenEditClient: () =>
    set((state) => ({
      isEditClientModalOpen: !state.isEditClientModalOpen,
    })),
}));
