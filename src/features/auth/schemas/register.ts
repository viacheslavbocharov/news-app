import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export type RegisterForm = z.infer<typeof registerSchema>;
