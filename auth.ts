import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

export const { handlers, auth, signIn, signOut } = NextAuth({
   callbacks: {
      async signIn({ user, account }) {
         if (account?.provider !== "credentials") return true;

         const existingUser = await getUserById(user.id);
         if (!existingUser?.emailVerified) return false;

         if (existingUser.isTwoFactorEnabled) {
            const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
            if (!twoFactorConfirmation) return false;

            await prisma.twoFactorConfirmation.delete({
               where: {
                  id: twoFactorConfirmation.id
               }
            });
         }

         return true;
      },
      async session({ session, token }) {
         if (token.sub && session.user) {
            session.user.id = token.sub;
         }
         if (token.role && session.user) {
            session.user.role = token.role as UserRole;
         }
         return session;
      },
      async jwt({ token }) {
         if (!token.sub) return token;

         const existingUser = await getUserById(token.sub);

         if (!existingUser) return token;

         token.role = existingUser.role;

         return token;
      }
   },
   debug: true,
   adapter: PrismaAdapter(prisma),
   session: {
      strategy: "jwt"
   },
   pages: {
      signIn: "/sign-in",
      signOut: "/",
   },
   ...authConfig
});