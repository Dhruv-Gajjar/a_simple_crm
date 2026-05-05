import { create } from "zustand";

type State = {
  isClientDialogOpen: boolean;
  // isEditClientModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  isEditMode: boolean;
};

type Action = {
  setOpenClientDialog: () => void;
  // setOpenEditClient: () => void;
  setOpenDeleteDialog: () => void;
  setIsEditMode: () => void;
};

export const useGlobalStore = create<State & Action>((set) => ({
  isClientDialogOpen: false,
  // isEditClientModalOpen: false,
  isDeleteDialogOpen: false,
  isEditMode: false,

  setOpenClientDialog: () =>
    set((state) => ({
      isClientDialogOpen: !state.isClientDialogOpen,
    })),
  // setOpenEditClient: () =>
  //   set((state) => ({
  //     isEditClientModalOpen: !state.isEditClientModalOpen,
  //   })),
  setOpenDeleteDialog: () =>
    set((state) => ({
      isDeleteDialogOpen: !state.isDeleteDialogOpen,
    })),
  setIsEditMode: () =>
    set((state) => ({
      isEditMode: !state.isEditMode,
    })),
}));
