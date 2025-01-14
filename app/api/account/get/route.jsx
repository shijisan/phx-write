import { checkAuth } from "@/utils/checkAuth";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const { isAuthenticated, user } = await checkAuth(req);

  if (!isAuthenticated || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userData) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify(userData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
