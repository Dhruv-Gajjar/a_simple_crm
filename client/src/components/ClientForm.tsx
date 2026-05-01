import { useClientStore } from "@/stores/clientStore";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import * as z from "zod";
import { CLIENT_STATUS } from "@/types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import useClientManager from "@/hooks/use-client-manager";
import { Spinner } from "./ui/spinner";

const formSchema = z.object({
  name: z.string().min(4).max(50),
  email: z.email(),
  source: z.string().min(4).max(50),
  status: z.enum([
    CLIENT_STATUS.Active,
    CLIENT_STATUS.InActive,
    CLIENT_STATUS.Lead,
    CLIENT_STATUS.Rejected,
  ]),
  phoneNumber: z.string().min(14),
  remarks: z.optional(z.string()),
});

const defaultFormValues = {
  name: "",
  email: "",
  source: "",
  status: CLIENT_STATUS.Lead,
  phoneNumber: "",
  remarks: "",
};

const ClientForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });
  const { createNewClient } = useClientManager();
  const setOpen = useClientStore((state) => state.setOpenCreateClient);

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("DATA: ", data);
    createNewClient.mutate({
      name: data.name,
      email: data.email,
      soruce: data.source,
      status: data.status,
      phoneNumber: data.phoneNumber,
      remarks: data.remarks ? data.remarks : "",
    });

    if (createNewClient.isError) {
      toast(`Failed to add new client: ${createNewClient.error.message}`, {
        duration: 4000,
      });
      return;
    }

    if (createNewClient.isPending) {
      <div>
        <p>Adding new client...</p>
        <Spinner />
      </div>;
    }
    setOpen();
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

  return (
    <form id="form-client" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="-mx-4 no-scrollbar max-h-[50vh] rounded-sm overflow-y-auto px-4">
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-client-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="form-client-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter the client's name."
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-client-email">Email</FieldLabel>
                <Input
                  {...field}
                  type="email"
                  id="form-client-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter the client's email address."
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="source"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Soruce</FieldLabel>
                <Input
                  {...field}
                  id="client-form-soruce"
                  aria-invalid={fieldState.invalid}
                  placeholder="Found via network."
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
                  <FieldLabel htmlFor="form-client-status">Status</FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value !== CLIENT_STATUS.Rejected) {
                      form.setValue("remarks", "");
                    }
                  }}
                >
                  <SelectTrigger
                    id="form-client-status"
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Client Status" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="in_active">In Active</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>{" "}
              </Field>
            )}
          />
          {form.watch("status") === CLIENT_STATUS.Rejected && (
            <Controller
              name="remarks"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-client-remarks">Remakrs</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-client-remarks"
                      placeholder="Rejected due to different tech stack."
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
          )}
          <Controller
            name="phoneNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-client-phone-number">
                  Phone Number
                </FieldLabel>
                <Input
                  {...field}
                  id="form-client-phone-number"
                  aria-invalid={fieldState.invalid}
                  placeholder="+11 1234567890"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>
    </form>
  );
};

export default ClientForm;
