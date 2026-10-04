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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  defaultWorkspaceValues,
  workspaceSchema,
} from "@/schemas/workspace.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

export default function Workspace() {
  const form = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: defaultWorkspaceValues,
  });

  function onSubmit(data: z.infer<typeof workspaceSchema>) {
    console.log("Workspace_Form_Data: ", data);
  }

  return (
    <div className="flex items-center justify-center mx-auto w-full min-h-screen">
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
                    <FieldLabel htmlFor="form-workspace-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="form-workspace-name"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                  </Field>
                )}
              />
              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="form-workspace-slug">Slug</FieldLabel>
                    <Input
                      {...field}
                      id="form-workspace-slug"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button type="submit" className="w-full py-2 rounded-lg">
              Create workspace
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
