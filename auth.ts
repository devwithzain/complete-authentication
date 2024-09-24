import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

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

         if (session.user) {
            session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
         }

         if (session.user && typeof token.name === "string" && typeof token.email === "string") {
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.isOAuth = token.isOAuth as boolean;
         }

         return session;
      },

      async jwt({ token }) {
         if (!token.sub) return token;

         const existingUser = await getUserById(token.sub);

         if (!existingUser) return token;

         const existingAccount = await getAccountByUserId(
            existingUser.id
         );

         token.isOAuth = !!existingAccount;
         token.email = existingUser.email;
         token.name = existingUser.name;
         token.role = existingUser.role;
         token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

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