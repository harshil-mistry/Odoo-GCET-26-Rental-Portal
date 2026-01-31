import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Paths that require authentication
const protectedPaths = ["/dashboard", "/admin", "/vendor", "/profile"];

// Role-based access control
const rolePaths: Record<string, string[]> = {
    admin: ["/admin"],
    vendor: ["/vendor"],
    customer: ["/profile", "/cart"],
};

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // 1. Check if path requires auth
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    if (isProtected) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Since verifyToken uses jsonwebtoken which might not run on Edge Runtime depending on version/config,
        // For middleware in Next.js, it's often safer to use 'jose' or just check existence for now
        // and let the API routes/Server Components do the deep validation.
        // However, if we assume Node runtime for middleware (configured in next.config or not possible), 
        // we might need 'jose'. Let's do a basic existence check here and letting APIs handle validation 
        // to avoid edge runtime issues with 'jsonwebtoken'.

        // For stricter middleware auth, we would need 'jose' library.
        // For this prototype, we check token existence.
        return NextResponse.next();
    }

    // 2. Public paths (login/signup) - redirect to dashboard if already logged in?
    // Optional: functionality

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/vendor/:path*", "/profile/:path*"],
};
