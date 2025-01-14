import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function middleware(request) {

    if (request.nextUrl.pathname.startsWith('/account')) {
        const cookieStore = await cookies();
        const token = cookieStore.get("authToken")?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));

        }

        try {
            const { payload } = await jwtVerify(
                token,
                new TextEncoder().encode(process.env.JWT_SECRET)
            );

            const requestHeaders = new Headers(request.headers);

            requestHeaders.set('x-user-data', JSON.stringify(payload));

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                }
            });
        } catch (err) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/account/:path*']
}