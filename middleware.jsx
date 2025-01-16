import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

// Middleware to protect routes and verify JWT tokens
export async function middleware(request) {
    if (!request.nextUrl.pathname.startsWith('/account')) {
        return NextResponse.next();
    }

    try {
        const token = request.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // To generate a secure secret key, run in terminal:
        // openssl rand -base64 32
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        
        await jwtVerify(token, secret);
        
        return NextResponse.next();
    } catch (error) {
        request.cookies.delete('authToken');
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: '/account/:path*'
}