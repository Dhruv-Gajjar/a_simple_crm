"use client";

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
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  defaultWorkspaceValues,
  workspaceSchema,
} from "@/schemas/workspace.schema";
import { WorkspaceService } from "@/services/workspace.service";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function Workspace() {
  const [slugMessage, setSlugMessage] = useState<string | null>("");
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: defaultWorkspaceValues,
  });

  const setActiveWorkspaceId = useWorkspaceStore(
    (state) => state.setActiveWorkspaceId,
  );

  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  async function onSubmit(data: z.infer<typeof workspaceSchema>) {
    setIsLoading(true);
    const slugAvailable = await WorkspaceService.checkSlugAvailability(
      form.getValues("slug"),
    );
    if (slugAvailable.result) {
      const newWorkspce = await WorkspaceService.createWorkspace(data);

      if (!newWorkspce.result) {
        toast.error(newWorkspce.message);
        return;
      }

      setActiveWorkspaceId(newWorkspce.result.id);
      setIsSlugAvailable(true);
      setSlugMessage(slugAvailable.result);
      setIsLoading(false);
      toast.success(newWorkspce.message);
      console.log({ activeWorkspaceId });
      redirect("/");
    } else {
      setIsSlugAvailable(false);
      setSlugMessage(slugAvailable.message);
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center mx-auto w-full">
        <Card className="container">
          <CardHeader>
            <CardTitle className="text-xl">Create a workspace</CardTitle>
            <CardDescription>Move your work between teams.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="form-workspace" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="form-workspace-name">
                        Name
                      </FieldLabel>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);

                          const generateSlug = e.target.value;
                          form.setValue("slug", generateSlug, {
                            shouldValidate: true,
                          });
                        }}
                        id="form-workspace-name"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="slug"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="form-workspace-slug">URL</FieldLabel>
                      <InputGroup>
                        <InputGroupAddon className="rounded-l-md px-2 bg-muted text-muted-foreground text-sm">
                          <InputGroupText>simple-crm.app/</InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          aria-invalid={fieldState.invalid}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                          placeholder="workspace name"
                          className="pl-0.5!"
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      <p
                        className={cn(
                          "text-xs font-medium",
                          isSlugAvailable
                            ? "text-green-400"
                            : "text-destructive",
                        )}
                      >
                        {slugMessage}
                      </p>
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <Button
                type="submit"
                className="w-full py-2 rounded-lg"
                form="form-workspace"
                disabled={isLoading}
              >
                Create workspace
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
      <div className="mt-40"></div>
    </>
  );
}
