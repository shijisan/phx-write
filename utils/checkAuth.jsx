import { jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

export async function checkAuth() {
  try {
    // Get token from cookies or Authorization header using new Next.js 15 methods
    const cookieStore = await cookies();
    const headerStore = await headers();
    
    const token = 
      cookieStore.get("authToken")?.value || 
      headerStore.get("authorization")?.split(" ")[1];

    if (!token) {
      return { isAuthenticated: false, user: null };
    }

    // Verify JWT token
    const { payload } = await jwtVerify(
      token, 
      new TextEncoder().encode(JWT_SECRET)
    );

    if (!payload.userId) {
      return { isAuthenticated: false, user: null };
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
      }
    });

    if (!user) {
      return { isAuthenticated: false, user: null };
    }

    return { isAuthenticated: true, user };

  } catch (err) {
    console.error("Authentication check failed:", err);
    return { isAuthenticated: false, user: null };
  }
}