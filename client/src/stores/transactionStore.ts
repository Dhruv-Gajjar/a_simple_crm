import { create } from "zustand";

type State = {
  selectedTransactionId: string;
  transactionName: string;
};

type Action = {
  setSelectedTransactionId: (transactionId: string) => void;
  setTransactionName: (transactionName: string) => void;
};

export const useTransactionStore = create<State & Action>((set) => ({
  selectedTransactionId: "",
  transactionName: "",

  setSelectedTransactionId: (transactionId: string) =>
    set({
      selectedTransactionId: transactionId,
    }),

  setTransactionName: (transactionName: string) =>
    set({
      transactionName: transactionName,
    }),
}));
