import * as z from "zod";

export const workspaceSchema = z.object({
  name: z
    .string()
    .min(4, { error: "Minimum 4 characters required" })
    .max(12, { error: "Maximum 12 characters allowrd" }),
  slug: z.string({ error: "URL is required" }),
});

export const defaultWorkspaceValues = {
  name: "",
  slug: "",
};
