import axiosInstance from "@/api";
import { NewTransaction, ResponsePayload, Transactions } from "@/types";

export const TransactionService = {
  getAllTransactions: async (): Promise<ResponsePayload<Transactions[]>> => {
    const transactions = await axiosInstance.get("transaction/");
    return transactions.data;
  },
  createTransaction: async (
    newTransaction: NewTransaction,
  ): Promise<ResponsePayload<Transactions>> => {
    const response = await axiosInstance.post("transaction/", newTransaction);
    return response.data;
  },
  updateTransaction: async (
    body: Transactions,
  ): Promise<ResponsePayload<Transactions>> => {
    const id = body.id;
    const response = await axiosInstance.patch(`transaction/${id}`, body);
    return response.data;
  },
  deleteTransaction: async (
    transactionId: string,
  ): Promise<ResponsePayload<Transactions>> => {
    const response = await axiosInstance.delete(`transaction/${transactionId}`);
    return response.data;
  },
};
