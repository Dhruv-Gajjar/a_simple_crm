import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  NewTransaction,
  Project,
  TRANSACTION_STATUS,
  Transactions,
} from "@/types";
import useProject from "@/hooks/use-project";
import { useGlobalStore } from "@/stores/globalStore";
import useTransaction from "@/hooks/use-transactions";
import { useTransactionStore } from "@/stores/transactionStore";
import { useEffect } from "react";
import { Spinner } from "./ui/spinner";

const transactionFormSchema = z.object({
  paymentDate: z.date(),
  projectId: z.string(),
  paymentMethod: z.string(),
  amount: z.string(),
  status: z.enum([
    TRANSACTION_STATUS.Pending,
    TRANSACTION_STATUS.Paid,
    TRANSACTION_STATUS.Failed,
  ]),
});

const defaultValues: z.infer<typeof transactionFormSchema> = {
  paymentDate: new Date(),
  projectId: "",
  paymentMethod: "",
  amount: "0",
  status: TRANSACTION_STATUS.Pending,
};

const TransactionForm = () => {
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: defaultValues,
  });

  const setOpen = useGlobalStore((state) => state.setOpenTransactionDialog);
  const isEditMode = useGlobalStore((state) => state.isEditMode);
  const setIsEditMode = useGlobalStore((state) => state.setIsEditMode);

  const selectedTransactionId = useTransactionStore(
    (state) => state.selectedTransactionId,
  );
  const setSelectedTransactionId = useTransactionStore(
    (state) => state.setSelectedTransactionId,
  );

  const { transactionsData, createNewTransaction, updateTransaction } =
    useTransaction();

  const { projectsData } = useProject();

  useEffect(() => {
    if (isEditMode && selectedTransactionId && transactionsData) {
      const transaction = transactionsData.result.find(
        (t: Transactions) => t.id === selectedTransactionId,
      ) as Transactions;

      if (transaction) {
        form.reset({
          paymentDate: new Date(
            transaction.paymentDate || transaction.payment_date || new Date(),
          ),
          projectId: transaction.projectId || transaction.project_id,
          paymentMethod:
            transaction.paymentMethod || transaction.payment_method,
          amount: String(transaction.amountPaid ?? transaction.amount ?? 0),
          status: transaction.status,
        });
      } else {
        toast.error("Transaction not found!", { duration: 3000 });
      }
    }
  }, [isEditMode, selectedTransactionId, transactionsData, form]);

  const createTransaction = (newTransaction: NewTransaction) => {
    if (newTransaction) {
      createNewTransaction.mutate(newTransaction, {
        onSuccess: () => {
          toast.success("Sucessfully created a transaction", {
            position: "bottom-right",
            duration: 3000,
          });
          form.reset();
          setOpen();
        },
        onError: (error) => {
          toast.error(`Failed to create new transaction: ${error.message}`, {
            position: "bottom-right",
            duration: 3000,
          });
        },
      });
    }
  };

  const editTransaction = (newTransaction: NewTransaction) => {
    if (selectedTransactionId && transactionsData) {
      const transaction = transactionsData.result.find(
        (t: Transactions) => t.id === selectedTransactionId,
      );

      if (transaction) {
        updateTransaction.mutate(
          {
            ...transaction,
            id: transaction.id || selectedTransactionId,
            paymentDate: newTransaction.paymentDate,
            paymentMethod: newTransaction.paymentMethod,
            projectId: newTransaction.projectId,
            amount: newTransaction.amount,
            status: newTransaction.status,
          } as Transactions,
          {
            onSuccess: (data) => {
              setIsEditMode();
              setSelectedTransactionId("");
              toast.success(
                data?.message || "Successfully updated transaction",
                {
                  duration: 3000,
                },
              );
              form.reset();
              setOpen();
            },
            onError: (error) => {
              toast.error(`Failed to update transaction: ${error.message}`, {
                duration: 3000,
              });
            },
          },
        );
      }
    }
  };

  function onSubmit(data: z.infer<typeof transactionFormSchema>) {
    if (data) {
      const transactionData: NewTransaction = {
        paymentDate: data.paymentDate,
        paymentMethod: data.paymentMethod,
        projectId: data.projectId,
        amount: parseInt(data.amount),
        status: data.status,
      };

      if (!isEditMode) {
        createTransaction(transactionData);
      } else {
        editTransaction(transactionData);
      }
    }
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-black">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
    });
  }

  if (createNewTransaction.isPending || updateTransaction.isPending) {
    return (
      <div className="w-full h-full flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <form id="form-transaction" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="-mx-4 no-scrollbar max-h-[50vh] rounded-sm overflow-y-auto px-4">
        <FieldGroup>
          <Controller
            name="paymentDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-transaction-payment-date">
                  Payment Date
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="form-transaction-payment-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      aria-invalid={fieldState.invalid}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="paymentMethod"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-transaction-payment-method">
                  Payment Method
                </FieldLabel>
                <Input
                  {...field}
                  id="form-transaction-payment-method"
                  aria-invalid={fieldState.invalid}
                  placeholder="Via Bank transfer..."
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-transaction-payment-amount">
                  Payment Amount
                </FieldLabel>
                <Input
                  {...field}
                  id="form-transaction-payment-amount"
                  aria-invalid={fieldState.invalid}
                  placeholder="Total amount for the transaction."
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="form-transaction-status">
                    Status
                  </FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Select
                  key={field.value}
                  name={field.name}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger
                    id="form-transaction-status"
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Transaction Status" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem value={TRANSACTION_STATUS.Pending}>
                      Pending
                    </SelectItem>
                    <SelectItem value={TRANSACTION_STATUS.Paid}>
                      Paid
                    </SelectItem>
                    <SelectItem value={TRANSACTION_STATUS.Failed}>
                      Failed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            name="projectId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="form-transaction-projects">
                    Projects
                  </FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Select
                  key={field.value}
                  name={field.name}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger
                    id="form-transaction-projects"
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Project Name" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {projectsData?.result?.map((project: Project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </FieldGroup>
      </div>
    </form>
  );
};

export default TransactionForm;
