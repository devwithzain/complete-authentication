import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type Extenduser = DefaultSession["user"] & {
   role: UserRole;
};

declare module "next-auth" {
   interface Session {
      user: Extenduser;
   }
}