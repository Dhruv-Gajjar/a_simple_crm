import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import * as z from "zod";
import { Client, CLIENT_STATUS, NewClient } from "@/types";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { useGlobalStore } from "@/stores/globalStore";
import { useClientStore } from "@/stores/clientStore";
import { useEffect } from "react";

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
  remarks: z.string().optional(),
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
  const watchValue = useWatch({
    control: form.control,
    name: "status",
  });
  const { clientsData, createNewClient, updateClient } = useClientManager();

  const clientID = useClientStore((state) => state.selectedClientID);
  const setClientID = useClientStore((state) => state.setClientID);

  const setOpen = useGlobalStore((state) => state.setOpenClientDialog);
  const isEditMode = useGlobalStore((state) => state.isEditMode);
  const setEditMode = useGlobalStore((state) => state.setIsEditMode);

  useEffect(() => {
    if (isEditMode && clientID && clientsData) {
      const client = clientsData?.result.find(
        (client: Client) => client.id === clientID,
      );

      if (client) {
        form.reset({
          name: client.name,
          email: client.email,
          source: client.source,
          status: client.status,
          phoneNumber: client.phoneNumber,
          remarks: client.remarks ? client.remarks : "",
        });
      } else {
        toast.error("Client not found.!", { duration: 3000 });
      }
    } else {
      return;
    }
  }, [isEditMode, clientID, clientsData, form]);

  function createClient(data: NewClient) {
    createNewClient.mutate(
      {
        name: data.name,
        email: data.email,
        source: data.source,
        status: data.status,
        phoneNumber: data.phoneNumber,
        remarks: data.remarks ? data.remarks : "",
      },
      {
        onSuccess: () => {
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
          form.reset();
          setOpen();
        },
        onError: (error) => {
          toast(`Failed to add new client: ${error.message}`, {
            duration: 4000,
          });
        },
      },
    );
  }

  function editClient(data: NewClient) {
    if (clientID && clientsData) {
      const client = clientsData?.result.find(
        (client: Client) => client.id === clientID,
      );

      if (client) {
        updateClient.mutate(
          {
            id: client.id,
            name: data.name,
            email: data.email,
            source: data.source,
            status: data.status,
            phoneNumber: data.phoneNumber,
            remarks: data.remarks ? data.remarks : "",
            projects: client.projects,
          },
          {
            onSuccess: (data) => {
              setEditMode();
              setClientID("");
              toast.success(data?.message, {
                duration: 3000,
              });
              form.reset();
              setOpen();
            },
            onError: (error) => {
              toast.error(error?.message, {
                duration: 3000,
              });
            },
          },
        );
      } else {
        console.log("ERROR: No client found in client FORM.!");
      }
    }
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (!isEditMode) {
      createClient(data);
    } else {
      editClient(data);
    }
  }

  if (createNewClient.isPending) {
    return (
      <div className="w-full h-full">
        <Spinner />
      </div>
    );
  }

  if (updateClient.isPending) {
    return (
      <div className="w-full h-full">
        <Spinner />
      </div>
    );
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
                <FieldLabel>Source</FieldLabel>
                <Input
                  {...field}
                  id="client-form-source"
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
                  key={field.value}
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
                    <SelectItem value={CLIENT_STATUS.Active}>Active</SelectItem>
                    <SelectItem value={CLIENT_STATUS.InActive}>
                      In Active
                    </SelectItem>
                    <SelectItem value={CLIENT_STATUS.Lead}>Lead</SelectItem>
                    <SelectItem value={CLIENT_STATUS.Rejected}>
                      Rejected
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          {watchValue === CLIENT_STATUS.Rejected && (
            <Controller
              name="remarks"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-client-remarks">Remarks</FieldLabel>
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
