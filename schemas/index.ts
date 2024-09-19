import * as z from "zod";

export const resetFormSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const newPasswordFormSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const registerFormSchema = z.object({
  firstName: z.string().min(1, {
    message: "First Name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export type TloginFormData = z.infer<typeof loginFormSchema>;
export type TresetFormData = z.infer<typeof resetFormSchema>;
export type TregisterFormData = z.infer<typeof registerFormSchema>;
export type TnewPasswordFormData = z.infer<typeof newPasswordFormSchema>;