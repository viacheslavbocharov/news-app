import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export type LoginForm = z.infer<typeof loginSchema>;
