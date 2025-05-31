import z from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .nonempty({ message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),

  password: z.string().nonempty({ message: "Password is required" }).trim(),
});

export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .nonempty({ message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),

  username: z
    .string()
    .min(5, {
      message: "Min 5 character is required",
    })
    .max(32, { message: "Max 32 characters are allowed" })
    .nonempty({ message: "Username is required" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(32, { message: "Max 32 characters are allowed" })
    .nonempty({ message: "Password is required" })
    .trim(),
});

export type signInSchemaType = z.infer<typeof signInSchema>;
export type signUpSchemaType = z.infer<typeof signUpSchema>;
