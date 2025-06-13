import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const url = new URL(req.url);
    const pathname = url.pathname;

    // Redirect unauthenticated users to /login
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If authenticated, allow only access to /u/* routes
    if (!pathname.startsWith("/u")) {
        return NextResponse.redirect(new URL("/u/dashboard", req.url));
    }

    return NextResponse.next();
}

// Middleware only runs on specific routes
export const config = {
    matcher: ["/u/:path*"],
};
