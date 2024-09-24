"use server";
import bcrypt from "bcryptjs";
import { prisma } from '@/lib/prisma';
import { TsettingData } from "@/schemas";
import { currentUser } from "@/lib/current-user";
import { sendverificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail, getUserById } from "@/data/user";

export const settings = async (data: TsettingData) => {
   const user = await currentUser();

   if (!user) {
      return { error: "Unauthorized" };
   };

   const dbUser = await getUserById(user.id);

   if (!dbUser) {
      return { error: "User not found" };
   }

   if (user.isOAuth) {
      data.email = undefined;
      data.password = undefined;
      data.newPassword = undefined;
      data.isTwoFactorEnabled = undefined;
   }

   if (data.email && data.email !== user.email) {
      const existingUser = await getUserByEmail(data.email);
      if (existingUser && existingUser.id !== user.id) {
         return { error: "Email already in use!" };
      }
      const verificationToken = await generateVerificationToken(data.email);
      await sendverificationEmail(verificationToken.email, verificationToken.token);

      return { success: "Verification email sent" };
   }

   if (data.password && data.newPassword && dbUser.password) {

      const passwordsMatch = await bcrypt.compare(
         data.password,
         dbUser.password,
      );

      if (!passwordsMatch) {
         return { error: "Incorrect current password!" };
      }

      const isSameAsOldPassword = await bcrypt.compare(
         data.newPassword,
         dbUser.password,
      );

      if (isSameAsOldPassword) {
         return { error: "New password must be different!" };
      }

      const hashedPassword = await bcrypt.hash(
         data.newPassword,
         10,
      );
      data.password = hashedPassword;
      data.newPassword = undefined;
   }


   await prisma.user.update({
      where: {
         id: dbUser.id
      },
      data: {
         ...data
      }
   });

   return { success: "Settings Updated" };

};