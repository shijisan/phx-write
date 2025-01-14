import { checkAuth } from "@/utils/checkAuth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { isAuthenticated, user } = await checkAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { localNotes } = await req.json();

    // Save each local note to the database
    for (let note of localNotes) {
      await prisma.note.create({
        data: {
          content: note.content || "", // Default to empty string
          userId: user.id,
        },
      });
    }

    // Clear the 'notes' cookie after merging
    const cookieStore = await cookies();
    cookieStore.delete('notes'); // Remove the 'notes' cookie

    return NextResponse.json({ message: "Notes merged successfully." });
  } catch (err) {
    console.error("Failed to merge notes:", err);
    return NextResponse.json({ error: "Failed to merge notes." }, { status: 500 });
  }
}
