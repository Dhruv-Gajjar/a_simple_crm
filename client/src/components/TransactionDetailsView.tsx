"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  Folder,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Printer,
  Receipt,
  Share2,
  Trash2,
  User,
  Wallet,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import TransactionDialog from "@/components/TransactionDialog";
import DeleteDialog from "@/components/DeleteDialog";
import useTransaction from "@/hooks/use-transactions";
import { useGlobalStore } from "@/stores/globalStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { TRANSACTION_STATUS, Transactions } from "@/types";

interface TransactionDetailsViewProps {
  transactionId: string;
}

export const TransactionDetailsView: FC<TransactionDetailsViewProps> = ({
  transactionId,
}) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  // Global store actions
  const setOpenTransactionDialog = useGlobalStore(
    (state) => state.setOpenTransactionDialog,
  );
  const setIsEditMode = useGlobalStore((state) => state.setIsEditMode);
  const setOpenDeleteDialog = useGlobalStore(
    (state) => state.setOpenDeleteDialog,
  );

  // Transaction store actions
  const setSelectedTransactionId = useTransactionStore(
    (state) => state.setSelectedTransactionId,
  );

  const {
    transactionData,
    isTransactionLoading,
    isTransactionError,
    transactionError,
    updateTransaction,
  } = useTransaction();

  const transaction = transactionData?.result;

  const handleCopy = (text: string, label: string = "ID") => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenEdit = () => {
    if (!transaction) return;
    setSelectedTransactionId(transaction.id);
    setIsEditMode();
    setOpenTransactionDialog();
  };

  const handleOpenDelete = () => {
    if (!transaction) return;
    setSelectedTransactionId(transaction.id);
    setOpenDeleteDialog();
  };

  const handleStatusChange = (newStatus: TRANSACTION_STATUS) => {
    if (!transaction) return;
    updateTransaction.mutate(
      {
        ...transaction,
        status: newStatus,
      },
      {
        onSuccess: () => {
          toast.success(`Transaction marked as ${newStatus}`);
        },
        onError: (err) => {
          toast.error(`Failed to update status: ${err.message}`);
        },
      },
    );
  };

  const formatDate = (date: Date | string | undefined, includeTime = false) => {
    if (!date) return "N/A";
    try {
      return format(
        new Date(date),
        includeTime ? "MMM dd, yyyy 'at' hh:mm a" : "MMM dd, yyyy",
      );
    } catch {
      return "N/A";
    }
  };

  const getPaymentMethodIcon = (method: string | undefined) => {
    const m = (method || "").toLowerCase();
    if (
      m.includes("card") ||
      m.includes("stripe") ||
      m.includes("visa") ||
      m.includes("mastercard")
    ) {
      return <CreditCard className="size-4" />;
    }
    if (
      m.includes("bank") ||
      m.includes("wire") ||
      m.includes("transfer") ||
      m.includes("ach")
    ) {
      return <Building2 className="size-4" />;
    }
    if (
      m.includes("wallet") ||
      m.includes("paypal") ||
      m.includes("apple") ||
      m.includes("google")
    ) {
      return <Wallet className="size-4" />;
    }
    return <DollarSign className="size-4" />;
  };

  const statusConfig: Record<
    TRANSACTION_STATUS,
    {
      badgeClass: string;
      icon: typeof CheckCircle2;
      label: string;
      desc: string;
    }
  > = {
    [TRANSACTION_STATUS.Paid]: {
      badgeClass:
        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
      icon: CheckCircle2,
      label: "Paid",
      desc: "Funds successfully settled and verified.",
    },
    [TRANSACTION_STATUS.Pending]: {
      badgeClass:
        "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
      icon: Clock,
      label: "Pending",
      desc: "Payment initiated and awaiting confirmation.",
    },
    [TRANSACTION_STATUS.Failed]: {
      badgeClass:
        "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20",
      icon: XCircle,
      label: "Failed",
      desc: "Transaction could not be completed.",
    },
  };

  if (isTransactionLoading) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-3">
        <Spinner className="size-8" />
        <p className="text-sm text-muted-foreground">
          Loading transaction details...
        </p>
      </div>
    );
  }

  if (isTransactionError || !transaction) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/transactions">
            <ArrowLeft className="mr-2 size-4" />
            Back to transactions
          </Link>
        </Button>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
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
            <Button asChild variant="outline">
              <Link href="/transactions">Return to Transactions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStatus =
    statusConfig[transaction.status] ||
    statusConfig[TRANSACTION_STATUS.Pending];
  const StatusIcon = currentStatus.icon;

  // Project budget calculations
  const project = transaction.project;
  const client = project?.client;
  const projectTotal = project?.totalAmount ?? project?.total_cost ?? 0;
  const transactionAmount = transaction.amount ?? transaction.amountPaid ?? 0;
  const budgetPercentage =
    projectTotal > 0
      ? Math.min(Math.round((transactionAmount / projectTotal) * 100), 100)
      : 0;

  return (
    <div className="space-y-6 mx-auto pb-12 w-full">
      {/* 1. Header Navigation & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/transactions">
              <ArrowLeft className="mr-1 size-4" />
              Transactions
            </Link>
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium font-mono text-muted-foreground">
            {transaction.id.slice(0, 8)}...
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <StatusIcon className="size-3.5" />
                <span>Status: {currentStatus.label}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusChange(TRANSACTION_STATUS.Paid)}
              >
                <CheckCircle2 className="mr-2 size-4 text-emerald-600" />
                Mark as Paid
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange(TRANSACTION_STATUS.Pending)}
              >
                <Clock className="mr-2 size-4 text-amber-600" />
                Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange(TRANSACTION_STATUS.Failed)}
              >
                <XCircle className="mr-2 size-4 text-rose-600" />
                Mark as Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Print / Download Receipt */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5"
          >
            <Printer className="size-4" />
            <span className="hidden sm:inline">Print Receipt</span>
          </Button>

          {/* Edit Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenEdit}
            className="gap-1.5"
          >
            <Pencil className="size-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>

          {/* Delete Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenDelete}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      {/* 2. Hero Summary Banner */}
      <Card className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-xs">
        <CardHeader className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Receipt className="size-4 text-primary" />
                <span>Transaction Record</span>
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  ${transactionAmount.toLocaleString()}
                </h1>
                <Badge
                  variant="outline"
                  className={`${currentStatus.badgeClass} flex items-center gap-1.5 px-3 py-1 text-sm font-medium`}
                >
                  <StatusIcon className="size-3.5" />
                  {currentStatus.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {currentStatus.desc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="rounded-lg border bg-background/80 p-3 shadow-xs min-w-50">
                <p className="text-xs text-muted-foreground font-medium">
                  Transaction ID
                </p>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="font-mono text-xs font-semibold truncate max-w-35">
                    {transaction.id}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => handleCopy(transaction.id, "Transaction ID")}
                  >
                    <Copy className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Payment Date</p>
                <p className="font-medium">
                  {formatDate(transaction.paymentDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-primary/10 text-primary shrink-0">
                {getPaymentMethodIcon(transaction.paymentMethod)}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment Method</p>
                <p className="font-medium">
                  {transaction.paymentMethod || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Recorded On</p>
                <p className="font-medium">
                  {formatDate(transaction.createdAt, true)}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 3. Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Financial Breakdown & Lifecycle */}
        <div className="lg:col-span-2 space-y-6">
          {/* Digital Receipt Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="size-5 text-primary" />
                Payment Breakdown & Details
              </CardTitle>
              <CardDescription>
                Itemized view of this transaction milestone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Base Payment Amount
                  </span>
                  <span className="font-semibold">
                    ${transactionAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Processing / Platform Fee
                  </span>
                  <span className="text-muted-foreground">$0.00</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-base font-bold">
                  <span>Net Received</span>
                  <span className="text-primary">
                    ${transactionAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Channel / Gateway
                  </p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    {getPaymentMethodIcon(transaction.paymentMethod)}
                    {transaction.paymentMethod || "Direct"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Settlement Status
                  </p>
                  <Badge
                    variant="outline"
                    className={`${currentStatus.badgeClass} text-xs font-normal`}
                  >
                    {currentStatus.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lifecycle & Audit Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                Transaction Timeline
              </CardTitle>
              <CardDescription>
                Chronological record of status changes and payment events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {/* Event 1: Created */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 flex size-4 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
                  <p className="text-sm font-semibold">Transaction Recorded</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(transaction.createdAt, true)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Entry created in the system for project{" "}
                    {project?.name || "N/A"}.
                  </p>
                </div>

                {/* Event 2: Payment Date / Settlement */}
                <div className="relative">
                  <div
                    className={`absolute -left-6 top-1 flex size-4 items-center justify-center rounded-full ring-4 ring-background ${
                      transaction.status === TRANSACTION_STATUS.Paid
                        ? "bg-emerald-500"
                        : transaction.status === TRANSACTION_STATUS.Failed
                          ? "bg-rose-500"
                          : "bg-amber-500"
                    }`}
                  />
                  <p className="text-sm font-semibold">
                    {transaction.status === TRANSACTION_STATUS.Paid
                      ? "Payment Settled"
                      : transaction.status === TRANSACTION_STATUS.Failed
                        ? "Payment Failed"
                        : "Awaiting Settlement"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(transaction.paymentDate, true)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Marked as {transaction.status} via{" "}
                    {transaction.paymentMethod || "standard payment"}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Associated Project & Client Cards */}
        <div className="space-y-6">
          {/* Project Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Folder className="size-4 text-primary" />
                  Associated Project
                </CardTitle>
                {project?.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    asChild
                  >
                    <Link href={`/projects/${project.id}`}>
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {project ? (
                <>
                  <div className="space-y-1">
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-semibold text-primary hover:underline block truncate"
                    >
                      {project.name}
                    </Link>
                    {project.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Project Status
                    </span>
                    <Badge variant="outline" className="capitalize text-xs">
                      {project.status?.replace("_", " ") || "Active"}
                    </Badge>
                  </div>

                  {/* Project Budget Progress */}
                  {projectTotal > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Project Budget
                        </span>
                        <span className="font-semibold">
                          ${projectTotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>This Payment Share</span>
                          <span>{budgetPercentage}%</span>
                        </div>
                        <Progress value={budgetPercentage} className="h-2" />
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  {(project.startDate || project.endDate) && (
                    <div className="pt-2 border-t text-xs space-y-1.5 text-muted-foreground">
                      {project.startDate && (
                        <div className="flex justify-between">
                          <span>Start Date:</span>
                          <span className="font-medium text-foreground">
                            {formatDate(project.startDate)}
                          </span>
                        </div>
                      )}
                      {project.endDate && (
                        <div className="flex justify-between">
                          <span>End Date:</span>
                          <span className="font-medium text-foreground">
                            {formatDate(project.endDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No linked project found.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Client Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  Client Information
                </CardTitle>
                {client?.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    asChild
                  >
                    <Link href={`/clients/${client.id}`}>
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {client ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {client.name?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div>
                      <Link
                        href={`/clients/${client.id}`}
                        className="font-medium hover:underline block leading-tight text-sm"
                      >
                        {client.name}
                      </Link>
                      {client.status && (
                        <Badge
                          variant="outline"
                          className="mt-1 capitalize text-[10px] py-0"
                        >
                          {client.status}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-xs">
                    {client.email && (
                      <a
                        href={`mailto:${client.email}`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground truncate"
                      >
                        <Mail className="size-3.5 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </a>
                    )}
                    {(client.phoneNumber || client.phone_number) && (
                      <a
                        href={`tel:${client.phoneNumber || client.phone_number}`}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <Phone className="size-3.5 shrink-0" />
                        <span>{client.phoneNumber || client.phone_number}</span>
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    Client information not attached directly to this
                    transaction.
                  </p>
                  {project?.clientId && (
                    <p className="font-mono text-[11px]">
                      Client ID: {project.clientId}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Global Dialog Modals */}
      <TransactionDialog />
      <DeleteDialog name={`Transaction #${transaction.id.slice(0, 8)}`} />
    </div>
  );
};

export default TransactionDetailsView;
