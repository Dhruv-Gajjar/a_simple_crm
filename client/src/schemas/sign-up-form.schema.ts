import * as z from "zod";

export const signupFormSchema = z.object({
  username: z
    .string({ error: "username is required" })
    .min(4, { error: "Username must be 4 characters" })
    .max(100, { error: "Username can be 100 characters max" }),
  email: z.email({ error: "Email is required" }),
  firstName: z
    .string()
    .min(4, { error: "First name must be 4 characters." })
    .max(120, { error: "First name must be 120 characters max." }),
  lastName: z
    .string()
    .min(4, { error: "Last name must be 4 characters." })
    .max(120, { error: "Last name must be 120 characters max." }),
  passwordHash: z
    .string({ error: "Password is required" })
    .min(4, { error: "Password must be 4 characters" })
    .max(12, { error: "Password can be 120 characters max." }),
});

export const signupFormDefaultValues = {
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  passwordHash: "",
};
