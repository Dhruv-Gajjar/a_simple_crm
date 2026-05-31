import { create } from "zustand";

type State = {
  selectedClientID: string | null;
  clientName: string;
  selectedStatus: string;
};

type Action = {
  setClientID: (clientID: string) => void;
  setClientName: (clientName: string) => void;
  setSelectedStatus: (status: string) => void;
};

export const useClientStore = create<State & Action>((set) => ({
  selectedClientID: null,
  clientName: "",
  selectedStatus: "",

  setClientID: (clientID: string) =>
    set({
      selectedClientID: clientID,
    }),

  setClientName: (clientName: string) =>
    set({
      clientName: clientName,
    }),

  setSelectedStatus: (status: string) =>
    set({
      selectedStatus: status,
    }),
}));
