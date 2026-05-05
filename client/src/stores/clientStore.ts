import { create } from "zustand";

type State = {
  selectedClientID: string | null;
  clientName: string;
};

type Action = {
  setClientID: (clientID: string) => void;
  setClientName: (clientName: string) => void;
};

export const useClientStore = create<State & Action>((set) => ({
  selectedClientID: null,
  clientName: "",

  setClientID: (clientID: string) =>
    set({
      selectedClientID: clientID,
    }),

  setClientName: (clientName: string) =>
    set({
      clientName: clientName,
    }),
}));
