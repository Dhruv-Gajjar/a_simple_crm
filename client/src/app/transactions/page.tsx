"use client";

import { transactionsColumns } from "@/components/AppTable/columns/transactions-columns";
import { AppDataTable } from "@/components/AppTable/data-table";
import TransactionDialog from "@/components/TransactionDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { Spinner } from "@/components/ui/spinner";
import useTransaction from "@/hooks/use-transactions";
import { useGlobalStore } from "@/stores/globalStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { FC } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Transactions: FC = () => {
  const {
    transactionsData,
    isTransactionsLoading,
    isTransactionsError,
    transactionsError,
  } = useTransaction();

  const setOpen = useGlobalStore((state) => state.setOpenTransactionDialog);
  const setEditMode = useGlobalStore((state) => state.setIsEditMode);
  const transactionName = useTransactionStore((state) => state.transactionName);
  const setTransactionID = useTransactionStore(
    (state) => state.setSelectedTransactionId,
  );

  const statusColors: Record<string, string> = {
    paid: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
    failed: "bg-destructive/15 text-destructive border-destructive/20",
    pending: "bg-orange-400/15 text-orange-800 border-orange/20",
  };

  if (isTransactionsLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  if (isTransactionsError) {
    return toast.error(`Error: ${transactionsError?.message}`, {
      duration: 4000,
    });
  }

  return (
    <div className="w-full h-full">
      <Tabs defaultValue="card" className="w-full">
        <TabsList>
          <TabsTrigger value="card">Card</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
        </TabsList>
        <TabsContent value="card">
          <div className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
            {transactionsData?.result.map((transaction) => (
              <Card
                key={transaction.id}
                className="min-w-75 shadow-lg cursor-pointer"
                onClick={() => {
                  setTransactionID(transaction.id);
                  setEditMode();
                  setOpen();
                }}
              >
                <CardHeader>
                  <CardTitle className="w-full">
                    <div className="flex items-center justify-between pb-2">
                      <p className="flex items-center gap-1">
                        Amount:
                        <span className="text-lg">$ {transaction.amount}</span>
                      </p>
                      <Badge
                        className={`${
                          statusColors[
                            transaction.status.toLowerCase() ||
                              "bg-secondary text-secondary-foreground"
                          ]
                        } font-medium capitalize shadow-none`}
                        variant={"outline"}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="flex items-center font-normal text-xs gap-1">
                      ID:- <span className="text-xs">{transaction.id}</span>
                    </p>
                  </CardTitle>
                </CardHeader>
                <Separator className="mx-auto max-w-[80%]" />
                <CardContent className="space-y-2">
                  <p className="flex items-center gap-2">
                    Type:- <span>{transaction.paymentMethod}</span>
                  </p>
                  <p className="flex items-center gap-2 pb-2">
                    Date:-{" "}
                    <span>
                      {format(
                        transaction?.paymentDate ?? new Date(),
                        "MMMM-dd-yyyy",
                      )}
                    </span>
                  </p>
                  <Link
                    href={`/transactions/${transaction.id}`}
                    onClick={() => {
                      setTransactionID("");
                      setEditMode();
                      setOpen();
                    }}
                  >
                    <Button variant={"ghost"}>
                      View More <ChevronRight />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <AppDataTable
            columns={transactionsColumns}
            data={transactionsData?.result ?? []}
            isPagination={true}
            showAddButton={true}
            addButtonText="Add Transaction"
            onAddClick={setOpen}
          />
        </TabsContent>
      </Tabs>
      <TransactionDialog />
      <DeleteDialog name={transactionName} />
    </div>
  );
};

export default Transactions;
