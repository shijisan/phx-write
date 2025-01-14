import { checkAuth } from "@/utils/checkAuth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { decryptText } from "@/utils/crypto";

export async function GET(req, { params }) {
  const { id } = await params; // Get the note ID from URL params

  try {
    const { isAuthenticated, user } = await checkAuth(req);
    const cookieStore = await cookies();

    if (isAuthenticated) {
      // Fetch the note from the database if the user is authenticated
      const note = await prisma.note.findUnique({
        where: { id: parseInt(id) }, // Convert the ID to an integer for the query
      });

      if (!note) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }

      if (note.content) {
        note.content = decryptText(note.content);
      }

      return NextResponse.json({ note });
    } else {
      // Fetch the note from local cookies if the user is not authenticated
      const localNotes = cookieStore.get("notes")?.value
        ? JSON.parse(cookieStore.get("notes").value)
        : [];

      const localNote = localNotes.find((note) => note.id === parseInt(id)); // Find the note with the matching ID

      if (!localNote) {
        return NextResponse.json({ error: "Note not found in local storage" }, { status: 404 });
      }

      return NextResponse.json({ note: localNote });
    }
  } catch (err) {
    console.error("Error fetching note:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
