"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Receipt,
  Layers,
  User,
  Mail,
  Phone,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useProject from "@/hooks/use-project";
import { useProjectStore } from "@/stores/projectStore";
import { PROJECT_STATUS, INVOICES_STATUS } from "@/types";

const projectStatusColors: Record<string, string> = {
  [PROJECT_STATUS.Completed]:
    "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  [PROJECT_STATUS.InProgress]:
    "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400",
  [PROJECT_STATUS.Todo]:
    "bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-400",
  [PROJECT_STATUS.OnHold]:
    "bg-purple-500/15 text-purple-700 border-purple-500/30 dark:text-purple-400",
  [PROJECT_STATUS.Canceled]:
    "bg-destructive/15 text-destructive border-destructive/30",
};

const invoiceStatusColors: Record<string, string> = {
  [INVOICES_STATUS.Paid]:
    "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  [INVOICES_STATUS.Sent]:
    "bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-400",
  [INVOICES_STATUS.Draft]: "bg-muted text-muted-foreground border-border",
  [INVOICES_STATUS.Overdue]:
    "bg-destructive/15 text-destructive border-destructive/30",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date | string | undefined) => {
  if (!date) return "N/A";
  try {
    return format(new Date(date), "MMM dd, yyyy");
  } catch {
    return "N/A";
  }
};

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { projectData, isProjectLoading, isProjectError, projectError } =
    useProject();

  const setProjectID = useProjectStore((state) => state.setSelectedProjectId);
  const [currentDate] = useState(() => new Date());

  useEffect(() => {
    setProjectID(slug);
  }, [slug, setProjectID]);

  if (isProjectLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-36" />
        </div>
        <Skeleton className="h-44 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (isProjectError || !projectData?.result) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects">
            <ArrowLeft className="size-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="size-5" />
              Project Not Found
            </CardTitle>
            <CardDescription>
              {typeof projectError === "string"
                ? projectError
                : "Unable to find the project details for this ID."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/projects">Return to Projects</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const project = projectData.result;
  const totalAmount = project.totalAmount ?? project.total_cost ?? 0;
  const transactions = project.transactions ?? [];
  const notes = project.notes ?? [];
  const invoices = project.invoices ?? [];

  const totalPaid = transactions.reduce((acc, t) => {
    const val = t.amountPaid ?? t.amount ?? 0;
    return acc + Number(val);
  }, 0);

  const remainingAmount = Math.max(0, totalAmount - totalPaid);
  const paymentPercentage =
    totalAmount > 0
      ? Math.min(100, Math.round((totalPaid / totalAmount) * 100))
      : 0;

  const startDate = new Date(project.startDate || project.start_date);
  const endDate = new Date(project.endDate || project.end_date);

  let timelineProgress = 0;
  if (project.status === PROJECT_STATUS.Completed) {
    timelineProgress = 100;
  } else if (project.status === PROJECT_STATUS.Todo) {
    timelineProgress = 0;
  } else {
    const totalTime = endDate.getTime() - startDate.getTime();
    const elapsedTime = currentDate.getTime() - startDate.getTime();
    if (totalTime > 0) {
      timelineProgress = Math.min(
        100,
        Math.max(0, Math.round((elapsedTime / totalTime) * 100)),
      );
    }
  }

  const isOverdue =
    currentDate > endDate &&
    project.status !== PROJECT_STATUS.Completed &&
    project.status !== PROJECT_STATUS.Canceled;

  const diffDays = Math.ceil(
    (endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const durationDays = Math.max(
    1,
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects">
            <ArrowLeft className="size-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
      </div>

      <Card className="bg-linear-to-r from-purple-500/10 via-blue-500/5 to-transparent border">
        <CardHeader className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {project.name}
                </h1>
                <Badge
                  variant="outline"
                  className={`${
                    projectStatusColors[project.status] ||
                    "bg-secondary text-secondary-foreground"
                  } capitalize font-medium`}
                >
                  {project.status.replace("_", " ")}
                </Badge>
                {project.iterations > 0 && (
                  <Badge variant="secondary" className="gap-1 font-normal">
                    <Layers className="size-3" />
                    Iteration {project.iterations}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Project ID: <span className="font-mono">{project.id}</span>
              </p>
            </div>
            {project.client && (
              <div className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-xs">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="size-4" />
                </div>
                <div className="text-sm">
                  <p className="font-medium leading-none">
                    {project.client.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {project.client.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" />
                <span>Start: {formatDate(startDate)}</span>
              </div>
              <Separator
                orientation="vertical"
                className="h-4 hidden sm:block"
              />
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" />
                <span>Target: {formatDate(endDate)}</span>
              </div>
              <Separator
                orientation="vertical"
                className="h-4 hidden sm:block"
              />
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-primary" />
                <span>Duration: {durationDays} days</span>
              </div>
            </div>

            <div>
              {project.status === PROJECT_STATUS.Completed ? (
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                >
                  Completed
                </Badge>
              ) : isOverdue ? (
                <Badge variant="destructive">
                  {Math.abs(diffDays)} days overdue
                </Badge>
              ) : (
                <Badge variant="secondary">{diffDays} days remaining</Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Budget
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Project contract total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Amount Paid
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <CreditCard className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {formatCurrency(totalPaid)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Collected</span>
                <span className="font-medium">{paymentPercentage}%</span>
              </div>
              <Progress value={paymentPercentage} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remaining Balance
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(remainingAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {remainingAmount === 0 ? "Fully paid off" : "Pending collection"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Timeline Progress
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">{timelineProgress}%</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Schedule</span>
                <span>{project.status.replace("_", " ")}</span>
              </div>
              <Progress value={timelineProgress} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions" className="gap-2">
            Transactions
            <Badge variant="secondary" className="px-1.5 py-0 text-xs">
              {transactions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            Notes
            <Badge variant="secondary" className="px-1.5 py-0 text-xs">
              {notes.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="gap-2">
            Invoices
            <Badge variant="secondary" className="px-1.5 py-0 text-xs">
              {invoices.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About this project</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {project.description || "No description provided."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Timeline</CardTitle>
                  <CardDescription>
                    Tracking project schedule and progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Overall completion
                    </span>
                    <span className="font-semibold">{timelineProgress}%</span>
                  </div>
                  <Progress value={timelineProgress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span>Started: {formatDate(startDate)}</span>
                    <span>Target: {formatDate(endDate)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Client Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {project.client ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium">{project.client.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            Status: {project.client.status}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="size-4" />
                          <span className="truncate">
                            {project.client.email}
                          </span>
                        </div>
                        {(project.client.phoneNumber ||
                          project.client.phone_number) && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="size-4" />
                            <span>
                              {project.client.phoneNumber ||
                                project.client.phone_number}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Client ID:</p>
                      <p className="font-mono text-xs break-all bg-muted p-2 rounded">
                        {project.clientId}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Project Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Iterations</span>
                    <span className="font-medium">{project.iterations}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Transactions</span>
                    <span className="font-medium">{transactions.length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Notes count</span>
                    <span className="font-medium">{notes.length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Invoices count
                    </span>
                    <span className="font-medium">{invoices.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Transaction History</CardTitle>
                <CardDescription>
                  Payments recorded for this project
                </CardDescription>
              </div>
              <div className="text-sm font-medium">
                Total Collected:{" "}
                <span className="text-primary font-bold">
                  {formatCurrency(totalPaid)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium">
                            {formatDate(
                              tx.paymentDate || tx.payment_date || tx.createdAt,
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {tx.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {tx.paymentMethod ||
                                tx.payment_method ||
                                "Payment"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(Number(tx.amount ?? 0))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                    <CreditCard className="size-6" />
                  </div>
                  <h3 className="font-semibold text-base">
                    No transactions recorded
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1">
                    Transactions and payments made for this project will be
                    listed here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Notes</CardTitle>
              <CardDescription>
                Internal documentation, remarks, and progress updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-lg border bg-muted/30 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <FileText className="size-3.5" />
                          <span>Note</span>
                        </div>
                        <span>{formatDate(note.createdAt)}</span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                    <FileText className="size-6" />
                  </div>
                  <h3 className="font-semibold text-base">No notes yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1">
                    Add notes to keep track of decisions, ideas, and meeting
                    summaries.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoices</CardTitle>
              <CardDescription>
                Billing and invoice records for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-medium">
                            #{inv.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${
                                invoiceStatusColors[inv.status] ||
                                "bg-secondary text-secondary-foreground"
                              } capitalize`}
                            >
                              {inv.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(inv.issueDate)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(inv.dueDate)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(Number(inv.amount))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                    <Receipt className="size-6" />
                  </div>
                  <h3 className="font-semibold text-base">No invoices found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1">
                    Invoices linked to this project will appear here once
                    generated.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
