import { create } from "zustand";

type State = {
  selectedInvoiceId: string;
  invoiceName: string;
};

type Action = {
  setSelectedInvoiceId: (invoiceId: string) => void;
  setInvoiceName: (invoiceName: string) => void;
};

export const useInvoiceStore = create<State & Action>((set) => ({
  selectedInvoiceId: "",
  invoiceName: "",

  setSelectedInvoiceId: (invoiceId: string) =>
    set({
      selectedInvoiceId: invoiceId,
    }),

  setInvoiceName: (invoiceName: string) =>
    set({
      invoiceName: invoiceName,
    }),
}));
