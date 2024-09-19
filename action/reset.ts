"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken, } from "@/lib/tokens";
import { resetFormSchema, TresetFormData, } from "@/schemas";

export const reset = async (data: TresetFormData) => {
   const validatedFields = resetFormSchema.safeParse(data);

   if (!validatedFields.success) {
      return {
         error: "Invalid Email"
      };
   }

   const { email } = validatedFields.data;

   const existingUser = await getUserByEmail(email);
   if (!existingUser) {
      return {
         error: "Email not found"
      };
   }

   const passwordResetToken = await generatePasswordResetToken(email);
   await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
   );


   return {
      success: "Password Reset email sent!"
   };

};
