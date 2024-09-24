import {
   DEFAULT_LOGIN_REDIRECT,
   apiAuthPrefix,
   authRoutes,
   publicRoutes,
} from "@/routes";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
const { auth } = NextAuth(authConfig);

export default auth((req: any) => {
   const { nextUrl } = req;
   const isLoggedIn = !!req.auth;
   const isAuthRoute = authRoutes.includes(nextUrl.pathname);
   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

   if (isApiAuthRoute) {
      return undefined;
   }

   if (isAuthRoute) {
      if (isLoggedIn) {
         return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return undefined;
   }

   if (!isLoggedIn && !isPublicRoute) {
      return Response.redirect(new URL(
         "/sign-in",
         nextUrl
      ));
   }

   return undefined;
});

export const config = {
   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
