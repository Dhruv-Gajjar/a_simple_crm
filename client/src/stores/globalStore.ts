import { create } from "zustand";

type State = {
  isClientDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isEditMode: boolean;
  page: number;
};

type Action = {
  setOpenClientDialog: () => void;
  setOpenDeleteDialog: () => void;
  setIsEditMode: () => void;
  setPage: (page: number) => void;
};

export const useGlobalStore = create<State & Action>((set) => ({
  isClientDialogOpen: false,
  isDeleteDialogOpen: false,
  isEditMode: false,
  page: 1,

  setOpenClientDialog: () =>
    set((state) => ({
      isClientDialogOpen: !state.isClientDialogOpen,
    })),
  setOpenDeleteDialog: () =>
    set((state) => ({
      isDeleteDialogOpen: !state.isDeleteDialogOpen,
    })),
  setIsEditMode: () =>
    set((state) => ({
      isEditMode: !state.isEditMode,
    })),
  setPage: (page: number) =>
    set(() => ({
      page,
    })),
}));
