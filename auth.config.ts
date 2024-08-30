import bcrypt from 'bcryptjs';
import { loginFormSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/get-user";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
   providers: [
      Credentials({
         async authorize(credentials) {
            const validatedFields = loginFormSchema.safeParse(credentials);
            if (validatedFields.success) {
               const { email, password } = validatedFields.data;

               const user = await getUserByEmail(email);
               if (!user || !user.password) return null;

               const isPasswordValid = await bcrypt.compare(password, user.password);

               if (isPasswordValid) return user;
            }
            return null;
         }
      })
   ]
} satisfies NextAuthConfig;