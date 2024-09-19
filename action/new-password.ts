"use server";

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getUserByEmail } from "@/data/user";
import { newPasswordFormSchema, TnewPasswordFormData } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";

export const newPassword = async (data: TnewPasswordFormData, token: string | null) => {
   if (!token) {
      return { error: "Missing token!" };
   }

   const validatedFields = await newPasswordFormSchema.safeParseAsync(data);
   if (!validatedFields.success) {
      return {
         error: "Invalid input data!",
      };
   }
   const { password } = validatedFields.data;

   const existingToken = await getPasswordResetTokenByToken(token);
   if (!existingToken) {
      return {
         error: "Token not found!",
      };
   }

   const hasExpired = new Date(existingToken.expires) < new Date();
   if (hasExpired) {
      return {
         error: "Token has expired!",
      };
   }

   const existingUser = await getUserByEmail(existingToken.email);
   if (!existingUser) {
      return {
         error: "Email does not exist!",
      };
   }

   const hashedPassword = await bcrypt.hash(password, 10);
   await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
   });
   await prisma.passwordResetToken.delete({
      where: {
         id: existingToken.id,
      },
   });

   return {
      success: "Password updated successfully!",
   };
};