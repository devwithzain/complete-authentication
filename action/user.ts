"use server";

import bcrypt from 'bcryptjs';
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { sendTwoFactorTokenEmail, sendverificationEmail } from "@/lib/mail";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { loginFormSchema, registerFormSchema, TloginFormData, TregisterFormData } from "@/schemas";

export const login = async (data: TloginFormData) => {
   const validatedFields = loginFormSchema.safeParse(data);

   if (!validatedFields.success) {
      return {
         error: "Invalid Fields"
      };
   }

   const { email, password, code } = validatedFields.data;

   const existingUser = await getUserByEmail(email);
   if (!existingUser || !existingUser.email || !existingUser.password) {
      return {
         error: "Email does not exist"
      };
   }

   if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(existingUser.email);
      await sendverificationEmail(
         verificationToken.email,
         verificationToken.token,
      );
      return {
         success: "Confirmation email sent!"
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

      if (existingUser.isTwoFactorEnabled && existingUser.email) {
         // Fetch the stored token for the user (if it exists)
         const existingTwoFactorToken = await prisma.twoFactorToken.findFirst({
            where: {
               email: existingUser.email
            }
         });

         if (code) {
            // If user has provided the code, check if the existing token matches
            if (!existingTwoFactorToken) {
               return { error: "Invalid Code!" };
            }

            console.log("User-provided code:", code);
            console.log("Stored token:", existingTwoFactorToken.token);

            // Check if the provided code matches the token
            if (existingTwoFactorToken.token !== code) {
               return { error: "Invalid Code!" };
            }

            // Check if the token has expired
            const hasExpired = new Date(existingTwoFactorToken.expires) < new Date();
            if (hasExpired) {
               return { error: "Code has expired!" };
            }
            console.log("Has token expired:", hasExpired);

            // Delete the token after successful validation
            await prisma.twoFactorToken.delete({
               where: {
                  id: existingTwoFactorToken.id
               }
            });

            // Handle two-factor confirmation
            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
            if (existingConfirmation) {
               await prisma.twoFactorConfirmation.delete({
                  where: {
                     id: existingConfirmation.id
                  }
               });
            }

            await prisma.twoFactorConfirmation.create({
               data: {
                  userId: existingUser.id,
               }
            });

         } else {
            // If no code is provided, send a new two-factor token
            if (!existingTwoFactorToken) {
               const newTwoFactorToken = await generateTwoFactorToken(existingUser.email);
               await sendTwoFactorTokenEmail(
                  newTwoFactorToken.email,
                  newTwoFactorToken.token,
               );
            }

            return {
               twoFactor: true
            };
         }
      }


      await signIn("credentials", {
         email,
         password,
         redirectTo: DEFAULT_LOGIN_REDIRECT
      });

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

   const { email, password, name } = validatedFields.data;

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
            name
         }
      });

      const verificationToken = await generateVerificationToken(email);
      await sendverificationEmail(
         verificationToken.email,
         verificationToken.token,
      );

      return { success: "Confirmation email sent!" };
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