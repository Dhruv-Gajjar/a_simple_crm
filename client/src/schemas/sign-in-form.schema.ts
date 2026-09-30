import * as z from "zod";

export const signinFormSchema = z.object({
  username: z
    .string({ error: "username is required" })
    .min(4, { error: "Username must be 4 characters" })
    .max(100, { error: "Username can be 100 characters max" }),
  passwordHash: z
    .string({ error: "Password is required" })
    .min(4, { error: "Password must be 4 characters" })
    .max(12, { error: "Password can be 120 characters max." }),
});

export const signinFormDefaultValues = {
  username: "",
  passwordHash: "",
};
