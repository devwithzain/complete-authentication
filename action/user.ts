"use server";

import bcrypt from 'bcryptjs';
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
         error: "Email not found"
      };
   }

   try {
      if (!existingUser.password || typeof existingUser.password !== 'string') {
         return {
            error: "Invalid Credentials"
         };
      }

      const passwordsMatch = await bcrypt.compare(password, existingUser.password);

      if (!passwordsMatch) {
         return {
            error: "Passwords do not match"
         };
      }

      const result = await signIn("credentials", {
         email,
         password,
         redirect: false
      });

      if (result?.error) {
         return {
            error: result.error
         };
      }

      return { success: "LogIn" };
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
   }
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
      const hashedPassword = await bcrypt.hash(password, 12);

      const existingUser = await getUserByEmail(email);
      if (existingUser) {
         return {
            error: "Email already exists!"
         };
      }

      await prisma.user.create({
         data: {
            email,
            password: hashedPassword,
            lastName,
            firstName
         }
      });

      return { success: "Account Created!" };
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
      return {
         error: "Something went wrong"
      };
   }
};