"use client";

import TransactionDetailsView from "@/components/TransactionDetailsView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import useTransaction from "@/hooks/use-transactions";
import { useTransactionStore } from "@/stores/transactionStore";
import { format, formatDate } from "date-fns";
import { AlertCircle, ArrowLeft, Calendar, Folder, Share, User } from "lucide-react";
import Link from "next/link";
import { use, useEffect } from "react";

export default function TransactionDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const setTransactionID = useTransactionStore((state) => state.setSelectedTransactionId);

  const {
    transactionData,
    isTransactionLoading,
    isTransactionError,
    transactionError,
  } = useTransaction();

  const { slug } = use(params);

  useEffect(() => {
    setTransactionID(slug);
  }, [slug, setTransactionID]);

  const transactionStatusColors: Record<string, string> = {
    paid: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
    failed: "bg-destructive/15 text-destructive border-destructive/20",
    pending: "bg-orange-400/15 text-orange-800 border-orange/20",
  };

  if (isTransactionLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[80%] mx-auto">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isTransactionError || !transactionData?.result) {
    return (
      <div className="space-y-6">
        <Button variant={"ghost"} size={"sm"} asChild>
          <Link href={"/transactions"}>
            <ArrowLeft className="size-4 mr-2" />
            Back to transactions
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertCircle className="size-5" />
              Transaction Not Found
            </CardTitle>
            <CardDescription>
              {typeof transactionError === "string"
                ? transactionError
                : "Unable to find transaction details for this ID."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant={"outline"}>
              <Link href="/transactions">Return to Transactions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const transaction = transactionData.result;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return "N/A";
    }
  };

  return (
    <TransactionDetailsView transactionId={transaction.id} key={transaction.id} />
  );
    {/* <div className="space-y-6"> */}
    {/*   <div className="flex items-center justify-between"> */}
    {/*     <Button variant={"ghost"} size={"sm"} asChild> */}
    {/*       <Link href={"/transactions"}> */}
    {/*         <ArrowLeft className="size-4" /> */}
    {/*         Back to transactions */}
    {/*       </Link> */}
    {/*     </Button> */}
    {/*   </div> */}
    {/**/}
    {/*   <Card className="bg-linear-to-r from-purple-500/10 via-blue-500/5 to-transparent border"> */}
    {/*     <CardHeader className="space-y-4"> */}
    {/*       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"> */}
    {/*         <div className="space-y-1"> */}
    {/*           <div className="flex items-center gap-3 flex-wrap"> */}
    {/*             <h1 className="text-2xl md:text-3xl font-bold tracking-tight"> */}
    {/*               $ {transaction.amount} */}
    {/*             </h1> */}
    {/*             <Badge */}
    {/*               variant="outline" */}
    {/*               className={`${ */}
    {/*                 transactionStatusColors[transaction.status] || */}
    {/*                 "bg-secondary text-secondary-foreground" */}
    {/*               } capitalize font-medium`} */}
    {/*             > */}
    {/*               {transaction.status.replace("_", " ")} */}
    {/*             </Badge> */}
    {/*           </div> */}
    {/*           <p className="text-sm text-muted-foreground"> */}
    {/*             Transaction ID:{" "} */}
    {/*             <span className="font-mono">{transaction.id}</span> */}
    {/*           </p> */}
    {/*         </div> */}
    {/*         {transaction.project && ( */}
    {/*           <div className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-xs"> */}
    {/*             <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary"> */}
    {/*               <User className="size-4" /> */}
    {/*             </div> */}
    {/*             <div className="text-sm"> */}
    {/*               <p className="font-medium leading-none"> */}
    {/*                 {transaction.project?.client?.name} */}
    {/*               </p> */}
    {/*               <p className="text-xs text-muted-foreground mt-1"> */}
    {/*                 {transaction.project?.client?.email} */}
    {/*               </p> */}
    {/*             </div> */}
    {/*           </div> */}
    {/*         )} */}
    {/*       </div> */}
    {/**/}
    {/*       <Separator /> */}
    {/**/}
    {/*       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-muted-foreground"> */}
    {/*         <div className="flex flex-wrap items-center gap-4"> */}
    {/*           <div className="flex items-center gap-1.5"> */}
    {/*             <Calendar className="size-4 text-primary" /> */}
    {/*             <span>Date: {formatDate(transaction.paymentDate)}</span> */}
    {/*           </div> */}
    {/*           <Separator */}
    {/*             orientation="vertical" */}
    {/*             className="h-4 hidden sm:block" */}
    {/*           /> */}
    {/*           <div className="flex items-center gap-1.5"> */}
    {/*             <Share className="size-4 text-primary" /> */}
    {/*             <span>Payment Method: {transaction.paymentMethod}</span> */}
    {/*           </div> */}
    {/*         </div> */}
    {/*       </div> */}
    {/*     </CardHeader> */}
    {/*   </Card> */}
    {/* </div> */}
}
