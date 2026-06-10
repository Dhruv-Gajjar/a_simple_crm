"use client";

import { FC } from "react";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { INVOICES_STATUS } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { CircleAlert, PlusIcon, Trash2 } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import { Card, CardContent } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

const invoiceFormSchema = z.object({
  invoiceNumber: z.string(),
  invoiceStatus: z.enum([
    INVOICES_STATUS.Draft,
    INVOICES_STATUS.Paid,
    INVOICES_STATUS.Sent,
    INVOICES_STATUS.Overdue,
  ]),
  issueDate: z.date(),
  dueDate: z.date(),
  project: z.string(),
  client: z.string(),
  amount: z.number(),
  note: z.string().max(100),
});

const defaultValues: z.infer<typeof invoiceFormSchema> = {
  invoiceNumber: "",
  invoiceStatus: INVOICES_STATUS.Draft,
  issueDate: new Date(),
  dueDate: new Date(),
  project: "",
  client: "",
  amount: 0,
  note: "",
};

const InvoiceForm: FC = () => {
  const form = useForm<z.infer<typeof invoiceFormSchema>>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: defaultValues,
  });

  return (
    <Card className="-mx-2 no-scrollbar max-h-[95vh] rounded-sm overflow-y-auto px-2 shadow h-[95vh] ">
      <CardContent>
        <form id="form-invoice">
          <FieldGroup>
            <div className="flex items-center gap-4">
              <Controller
                name="client"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-invoice-client">
                      Client Name
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <Input
                      {...field}
                      id="form-invoice-client"
                      aria-invalid={fieldState.invalid}
                      placeholder="Client Name..."
                      required
                    />
                  </Field>
                )}
              />
              <Controller
                name="project"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-invoice-project">
                      Project Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-invoice-project"
                      aria-invalid={fieldState.invalid}
                      placeholder="Project Name..."
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="invoiceNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="form-invoice-invoice-number">
                      Invoice Number
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <InputGroup>
                    <InputGroupAddon className="text-xl font-semibold">
                      #
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="form-invoice-invoice-number"
                      aria-invalid={fieldState.invalid}
                      placeholder="0000"
                      required
                      autoComplete="off"
                    />
                  </InputGroup>
                </Field>
              )}
            />
            <div className="flex items-center gap-4">
              <Controller
                name="issueDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-invoice-issue-date">
                      Issue Date
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="form-invoice-issue-date"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          aria-invalid={fieldState.invalid}
                        >
                          <CalendarIcon />
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
                name="dueDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-invoice-due-date">
                      Due Date
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="form-invoice-due-date"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          aria-invalid={fieldState.invalid}
                        >
                          <CalendarIcon />
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
            </div>
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-invoice-amount">Amount</FieldLabel>
                  <Input
                    {...field}
                    id="form-invoice-amount"
                    aria-invalid={fieldState.invalid}
                    placeholder="1000"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <>
              <div className="grid grid-cols-5 rounded bg-muted/50 font-medium border-b p-3">
                <div>Item</div>
                <div className="pr-8">Qty</div>
                <div>Price</div>
                <div>Amount</div>
              </div>
              <div
                // key={index}
                className="grid grid-cols-5 gap-4 border-b pb-2"
              >
                <Input placeholder="Web Design" />
                <Input placeholder="Quantity" />
                <Input placeholder="Price" />
                <Input placeholder="Amount" disabled className="w-24" />
                <Trash2 className="w-10 h-10 pb-4 pl-6" />
              </div>
              <Button variant="outline" className="w-full" type="button">
                <PlusIcon />
                Add Item
              </Button>
            </>
            <Controller
              name="note"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-invoice-note">Note</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-invoice-note"
                      placeholder="Note for this invoice."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value && field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
