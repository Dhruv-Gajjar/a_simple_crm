import { TransactionService } from "@/services/transaction.service";
import { useGlobalStore } from "@/stores/globalStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { NewTransaction, ResponsePayload, Transactions } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useTransaction = () => {
  const queryClient = useQueryClient();

  const page = useGlobalStore((state) => state.page);
  const transactionID = useTransactionStore(
    (state) => state.selectedTransactionId,
  );

  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
    error: transactionsError,
  } = useQuery({
    queryKey: ["transactions", page],
    queryFn: async (): Promise<ResponsePayload<Transactions[]>> => {
      const transactions = await TransactionService.getAllTransactions();
      return transactions;
    },
  });

  const {
    data: transactionData,
    isLoading: isTransactionLoading,
    isError: isTransactionError,
    error: transactionError,
  } = useQuery({
    queryKey: ["transactions", transactionID],
    queryFn: async (): Promise<ResponsePayload<Transactions>> => {
      if (!transactionID) {
        console.log("ERROR_SERVICE: transaction id not found.!");
        throw new Error("Transaction ID not set.");
      }
      const transaction =
        await TransactionService.getTransactionByID(transactionID);
      return transaction;
    },
  });

  const createNewTransaction = useMutation({
    mutationKey: ["create_transaction"],
    mutationFn: TransactionService.createTransaction,
    onMutate: async (newTransaction: NewTransaction) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      const previousTransactions = queryClient.getQueryData<
        ResponsePayload<Transactions[]>
      >(["transactions", page]);
      if (previousTransactions) {
        queryClient.setQueryData<ResponsePayload<Transactions[]>>(
          ["transactions", page],
          {
            ...previousTransactions,
            result: [
              ...previousTransactions.result,
              newTransaction as Transactions,
            ],
          },
        );
      }
      return { previousTransactions };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["transactions", page],
        context?.previousTransactions,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const updateTransaction = useMutation({
    mutationKey: ["update_transaction"],
    mutationFn: TransactionService.updateTransaction,
    onMutate: async (updatedTransaction: Transactions) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      const previousTransactions = queryClient.getQueryData<
        ResponsePayload<Transactions[]>
      >(["transactions", page]);
      if (previousTransactions) {
        queryClient.setQueryData<ResponsePayload<Transactions[]>>(
          ["transactions", page],
          {
            ...previousTransactions,
            result: previousTransactions.result.map(
              (transaction: Transactions) =>
                transaction.id === updatedTransaction.id
                  ? updatedTransaction
                  : transaction,
            ),
          },
        );
      }
      return { previousTransactions };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["transactions", page],
        context?.previousTransactions,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const deleteTransaction = useMutation({
    mutationKey: ["delete_transaction"],
    mutationFn: TransactionService.deleteTransaction,
    onMutate: async (transactionId: string) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      const previousTransactions = queryClient.getQueryData<
        ResponsePayload<Transactions[]>
      >(["transactions", page]);
      if (previousTransactions) {
        queryClient.setQueryData<ResponsePayload<Transactions[]>>(
          ["transactions", page],
          {
            ...previousTransactions,
            result: previousTransactions.result.filter(
              (transaction) => transaction.id !== transactionId,
            ),
          },
        );
      }
      return { previousTransactions };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["transactions", page],
        context?.previousTransactions,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return {
    transactionsData,
    isTransactionsLoading,
    isTransactionsError,
    transactionsError,
    transactionData,
    isTransactionLoading,
    isTransactionError,
    transactionError,
    createNewTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

export default useTransaction;
