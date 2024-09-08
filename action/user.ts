"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { TloginFormData, TregisterFormData } from "@/schemas";
import { getUserByEmail, prisma, loginFormSchema, registerFormSchema, } from "@/export";

export const login = async (data: TloginFormData) => {
   const validatedFields = loginFormSchema.safeParse(data);

   if (!validatedFields.success) {
      return {
         error: "Invalid Fields"
      };
   }

   const { email, password } = validatedFields.data;

   const existingUser = await getUserByEmail(email);
   if (!existingUser) {
      return {
         error: "Email already exists"
      };
   }

   try {
      await signIn("credentials", {
         email,
         password,
         redirectTo: "/setting",
      });
   } catch (error) {
      if (error instanceof AuthError) {
         switch (error.type) {
            case "CredentialsSignin":
               return {
                  error: "Invalid Credentials"
               };
            default:
               return {
                  error: "Something went wrong"
               };
         }
      }
      throw error;
   };
};
export const registerData = async (data: TregisterFormData) => {
   const validatedFields = registerFormSchema.safeParse(data);

   if (!validatedFields.success) {
      return {
         error: "Invalid Fields"
      };
   }

   const { email, password, firstName, lastName } = validatedFields.data;

   try {
      await prisma?.user.create({
         data: {
            email,
            password,
            lastName,
            firstName
         }
      });
   } catch (error) {
      if (error instanceof AuthError) {
         switch (error.type) {
            case "CredentialsSignin":
               return {
                  error: "Invalid Credentials"
               };
            default:
               return {
                  error: "Something went wrong"
               };
         }
      }
      throw error;
   };
};