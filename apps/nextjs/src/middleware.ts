import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/register/(.*)", "/api/(.*)", "/preenchimento(.*)"],
  afterAuth(auth, req, evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
    // rededirect them to organization selection page
    if (req.nextUrl.pathname == "/criarempresa" && auth.orgId) {
      const orgSelection = new URL("/", req.url);
      return NextResponse.redirect(orgSelection);
    }
    if (
      !auth.orgId &&
      req.nextUrl.pathname !== "/criarempresa" &&
      auth.userId &&
      req.nextUrl.pathname !== "/api/trpc/empresa.createEmpresa" &&
      req.nextUrl.pathname !== "/api/trpc/empresa.insertClerkIdIntoEmpresa"
    ) {
      console.log("sdas");
      console.log(req.nextUrl.pathname);
      const orgSelection = new URL("/criarempresa", req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
});
// Stop Middleware running on static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/image (image optimization files)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     * - public /images folder
     * - public /assets folder
     */
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
    "/",
    "/(.*?trpc.*?)",
    "/(.*?api.*?)",
    "/(.*?api.*?trpc.*?)",
  ],
};
