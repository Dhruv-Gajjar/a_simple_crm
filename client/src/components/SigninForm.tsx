"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useAuth } from "@/hooks/use-auth-context";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import {
  signinFormDefaultValues,
  signinFormSchema,
} from "@/schemas/sign-in-form.schema";

export default function SigninForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: signinFormDefaultValues,
  });

  const { setUser } = useAuth();

  async function onSubmit(data: z.infer<typeof signinFormSchema>) {
    if (!data) {
      toast.error("Please fill the sign in form.");
    }
    const newUser = await AuthService.signin(data);

    if (!newUser.result) {
      toast.error(newUser.message);
      console.log("Error creating user: ", newUser.error);
      return;
    }

    setUser(newUser.result);
    toast.success("User logged in.");
    router.push("/");
  }

  return (
    <form id="form-sign-in" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="-mx-4 no-scrollbar max-h-[50vh] rounded-sm overflow-y-auto px-4">
        <FieldGroup>
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-sign-in-username">
                  Username
                </FieldLabel>
                <Input
                  {...field}
                  id="form-sign-in-username"
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
            name="passwordHash"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-sign-in-password">
                  Password
                </FieldLabel>
                <Input
                  {...field}
                  type="password"
                  id="form-sign-in-password"
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
