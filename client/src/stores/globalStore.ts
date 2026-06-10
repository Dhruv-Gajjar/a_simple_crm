import { create } from "zustand";

type State = {
  isClientDialogOpen: boolean;
  isProjectDialogOpen: boolean;
  isInvoiceDialogOpen: boolean;
  isTransactionDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isEditMode: boolean;
  isComboBoxOpen: boolean;
  page: number;
};

type Action = {
  setOpenClientDialog: () => void;
  setOpenProjectDialog: () => void;
  setOpenTransactionDialog: () => void;
  setOpenInvoiceDialog: () => void;
  setOpenDeleteDialog: () => void;
  setIsEditMode: () => void;
  setIsComboBoxOpen: () => void;
  setPage: (page: number) => void;
};

export const useGlobalStore = create<State & Action>((set) => ({
  isClientDialogOpen: false,
  isProjectDialogOpen: false,
  isInvoiceDialogOpen: false,
  isTransactionDialogOpen: false,
  isDeleteDialogOpen: false,
  isEditMode: false,
  isComboBoxOpen: false,
  page: 1,

  setOpenClientDialog: () =>
    set((state) => ({
      isClientDialogOpen: !state.isClientDialogOpen,
    })),
  setOpenProjectDialog: () =>
    set((state) => ({
      isProjectDialogOpen: !state.isProjectDialogOpen,
    })),
  setOpenTransactionDialog: () =>
    set((state) => ({
      isTransactionDialogOpen: !state.isTransactionDialogOpen,
    })),
  setOpenInvoiceDialog: () =>
    set((state) => ({
      isInvoiceDialogOpen: !state.isInvoiceDialogOpen,
    })),
  setOpenDeleteDialog: () =>
    set((state) => ({
      isDeleteDialogOpen: !state.isDeleteDialogOpen,
    })),
  setIsEditMode: () =>
    set((state) => ({
      isEditMode: !state.isEditMode,
    })),
  setIsComboBoxOpen: () =>
    set((state) => ({
      isComboBoxOpen: !state.isComboBoxOpen,
    })),
  setPage: (page: number) =>
    set(() => ({
      page,
    })),
}));
