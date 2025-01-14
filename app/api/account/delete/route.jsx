import { checkAuth } from "@/utils/checkAuth";
import prisma from "@/lib/prisma";

export async function DELETE(req) {
  const user = await checkAuth(req);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const deletedUser = await prisma.user.delete({
    where: { id: user.id },
  });

  return new Response(JSON.stringify({ message: "User deleted successfully", deletedUser }), {
    headers: { "Content-Type": "application/json" },
  });
}
