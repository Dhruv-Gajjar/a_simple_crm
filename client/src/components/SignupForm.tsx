"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
  signupFormDefaultValues,
  signupFormSchema,
} from "@/schemas/sign-up-form.schema";
import { useAuth } from "@/hooks/use-auth-context";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: signupFormDefaultValues,
  });

  const { setUser } = useAuth();

  async function onSubmit(data: z.infer<typeof signupFormSchema>) {
    if (!data) {
      toast.error("Please fill the sign up form.");
    }
    const newUser = await AuthService.signup(data);

    if (!newUser.result) {
      toast.error(newUser.message);
      console.log("Error creating user: ", newUser.error);
      return;
    }

    setUser(newUser.result);
    toast.success("User created sucessfully");
    console.log("Sign_Up_Form: ", newUser, newUser.result.accessToken);
    router.push("/");
  }

  return (
    <form id="form-sign-up" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="-mx-4 no-scrollbar max-h-[50vh] rounded-sm overflow-y-auto px-4">
        <FieldGroup>
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-sign-up-username">
                  Username
                </FieldLabel>
                <Input
                  {...field}
                  id="form-sign-up-username"
                  aria-invalid={fieldState.invalid}
                  placeholder="John Doe"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-sign-up-first-name">
                  First Name
                </FieldLabel>
                <Input
                  {...field}
                  id="form-sign-up-first-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="John"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-sign-up-last-name">
                  Last Name
                </FieldLabel>
                <Input
                  {...field}
                  id="form-sign-up-last-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Doe"
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
                <FieldLabel htmlFor="form-sign-up-email">Email</FieldLabel>
                <Input
                  {...field}
                  type="email"
                  id="form-sign-up-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="testuser@email.com"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="passwordHash"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-sign-up-password">
                  Password
                </FieldLabel>
                <Input
                  {...field}
                  type="password"
                  id="form-sign-up-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter you password."
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
}
