import bcrypt from 'bcryptjs';
import { loginFormSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/get-user";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

export default {
   providers: [
      Google({
         clientId: process.env.AUTH_GOOGLE_ID,
         clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
      Github({
         clientId: process.env.GITHUB_CLIENT_ID as string,
         clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      }),
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