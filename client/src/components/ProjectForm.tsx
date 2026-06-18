import { Client, NewProject, Project, PROJECT_STATUS } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Input } from "./ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import { toast } from "sonner";
import useClientManager from "@/hooks/use-client-manager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import useProject from "@/hooks/use-project";
import { useGlobalStore } from "@/stores/globalStore";
import { Spinner } from "./ui/spinner";
import { useProjectStore } from "@/stores/projectStore";

const projectfFormSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(100),
  clientId: z.string(),
  totalAmount: z.string(),
  iterations: z.string(),
  status: z.enum([
    PROJECT_STATUS.Todo,
    PROJECT_STATUS.Completed,
    PROJECT_STATUS.Canceled,
    PROJECT_STATUS.InProgress,
    PROJECT_STATUS.OnHold,
  ]),
  startDate: z.date(),
  endDate: z.date(),
});

const defaultFormValues: z.infer<typeof projectfFormSchema> = {
  name: "",
  description: "",
  clientId: "",
  totalAmount: "0",
  iterations: "0",
  status: PROJECT_STATUS.Todo,
  startDate: new Date(),
  endDate: new Date(),
};

const ProjectForm = () => {
  const form = useForm<z.infer<typeof projectfFormSchema>>({
    resolver: zodResolver(projectfFormSchema),
    defaultValues: defaultFormValues,
  });
  const setOpen = useGlobalStore((state) => state.setOpenProjectDialog);
  const isEditMode = useGlobalStore((state) => state.isEditMode);
  const setIsEditMode = useGlobalStore((state) => state.setIsEditMode);

  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const setSelectedProjectId = useProjectStore(
    (state) => state.setSelectedProjectId,
  );

  const { clientsData } = useClientManager();
  const { projectsData, createNewProject, updateProject } = useProject();

  useEffect(() => {
    if (isEditMode && selectedProjectId && projectsData) {
      const project = projectsData?.result?.projects.find(
        (project: Project) => project.id === selectedProjectId,
      );

      if (project) {
        form.reset({
          name: project.name,
          description: project.description,
          clientId: project.clientId,
          totalAmount: String(project.total_cost ?? project.totalAmount ?? 0),
          iterations: String(project.iterations),
          status: project.status,
          startDate: new Date(project.start_date ?? project.startDate),
          endDate: new Date(project.end_date ?? project.endDate),
        });
      } else {
        toast.error("Project not found!", { duration: 3000 });
      }
    }
  }, [isEditMode, selectedProjectId, projectsData, form]);

  const createProject = (newProject: NewProject) => {
    if (newProject) {
      createNewProject.mutate(newProject, {
        onSuccess: () => {
          toast.success("Sucessfully created a project", {
            position: "bottom-right",
            duration: 3000,
          });
          form.reset();
          setOpen();
        },
        onError: (error) => {
          toast.error(`Failed to create new project: ${error.message}`, {
            position: "bottom-right",
            duration: 3000,
          });
        },
      });
    }
  };

  const editProject = (newProject: NewProject) => {
    if (selectedProjectId && projectsData) {
      const project = projectsData?.result?.projects.find(
        (p: Project) => p.id === selectedProjectId,
      );
      if (project) {
        updateProject.mutate(
          {
            ...project,
            name: newProject.name,
            description: newProject.description,
            clientId: newProject.clientId,
            status: newProject.status,
            totalAmount: newProject.totalAmount,
            iterations: newProject.iterations,
            startDate: newProject.startDate,
            endDate: newProject.endDate,
            start_date: newProject.startDate,
            end_date: newProject.endDate,
          },
          {
            onSuccess: (data) => {
              setIsEditMode();
              setSelectedProjectId("");
              toast.success(data?.message || "Successfully updated project", {
                duration: 3000,
              });
              form.reset();
              setOpen();
            },
            onError: (error) => {
              toast.error(`Failed to update project: ${error.message}`, {
                duration: 3000,
              });
            },
          },
        );
      }
    }
  };

  function onSubmit(data: z.infer<typeof projectfFormSchema>) {
    if (data) {
      const projectData: NewProject = {
        name: data.name,
        description: data.description,
        clientId: data.clientId,
        status: data.status,
        totalAmount: parseInt(data.totalAmount),
        iterations: parseInt(data.iterations),
        startDate: data.startDate,
        endDate: data.endDate,
      };

      if (!isEditMode) {
        createProject(projectData);
      } else {
        editProject(projectData);
      }
    }
  }

  if (createNewProject.isPending || updateProject.isPending) {
    return (
      <div className="w-full h-full flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <form id="form-project" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="-mx-4 no-scrollbar max-h-[50vh] rounded-sm overflow-y-auto px-4">
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-project-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="form-project-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter the project's name."
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-project-description">
                  Description
                </FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="form-project-description"
                    placeholder="Description of the project."
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
          <Controller
            name="clientId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="form-project-clients">
                    Clients
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
                    id="form-project-clients"
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Client Name" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {clientsData?.result?.clients.map((client: Client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            name="totalAmount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-project-total-amount">
                  Total Amount
                </FieldLabel>
                <Input
                  {...field}
                  id="form-project-total-amount"
                  aria-invalid={fieldState.invalid}
                  placeholder="Total amount for the project."
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="iterations"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-project-iterations">
                  Iterations
                </FieldLabel>
                <Input
                  {...field}
                  id="form-project-iterations"
                  aria-invalid={fieldState.invalid}
                  placeholder="No of iterations."
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
                  <FieldLabel htmlFor="form-project-status">Status</FieldLabel>
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
                    id="form-project-status"
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Project Status" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem value={PROJECT_STATUS.Todo}>Todo</SelectItem>
                    <SelectItem value={PROJECT_STATUS.Completed}>
                      Completed
                    </SelectItem>
                    <SelectItem value={PROJECT_STATUS.Canceled}>
                      Canceled
                    </SelectItem>
                    <SelectItem value={PROJECT_STATUS.InProgress}>
                      In Progress
                    </SelectItem>
                    <SelectItem value={PROJECT_STATUS.OnHold}>
                      On Hold
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            name="startDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-project-start-date">
                  Start Date
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="form-project-start-date"
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
            name="endDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-project-end-date">
                  End Date
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="form-project-end-date"
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
        </FieldGroup>
      </div>
    </form>
  );
};

export default ProjectForm;
