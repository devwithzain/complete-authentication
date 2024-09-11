import {
   DEFAULT_LOGIN_REDIRECT,
   apiAuthPrefix,
   authRoutes,
   publicRoutes,
} from "@/routes";

export default async function middleware(req: any) {
   const { nextUrl } = req;
   const isLoggedIn = !!req.auth;

   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
   const isAuthRoute = authRoutes.includes(nextUrl.pathname);

   if (isApiAuthRoute) {
      return undefined; // No redirection for API auth routes
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
}

export const config = {
   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
