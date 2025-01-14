import { checkAuth } from "@/utils/checkAuth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  const { id } = await params; // Get the note ID from URL params
  const { content } = await req.json(); // Get the content of the note from the request body

  try {
    // Check if user is authenticated
    const { isAuthenticated, user } = await checkAuth(req);
    const cookieStore = await cookies();

    if (isAuthenticated) {
      // Save the note to the database if the user is authenticated
      const updatedNote = await prisma.note.update({
        where: { id: parseInt(id) }, // Convert the ID to an integer
        data: { content }, // Update the note content
      });

      return NextResponse.json({ note: updatedNote });
    } else {
      // Fetch existing local notes or initialize an empty array if not available
      const localNotes = cookieStore.get("notes")?.value
        ? JSON.parse(cookieStore.get("notes").value)
        : [];

      // Find the note and update its content
      const updatedLocalNotes = localNotes.map((note) =>
        note.id === parseInt(id) ? { ...note, content } : note
      );

      // Save the updated notes back to the cookie
      const response = NextResponse.json({ note: { id: parseInt(id), content } });
      response.cookies.set("notes", JSON.stringify(updatedLocalNotes), {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }
  } catch (err) {
    console.error("Error saving note:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
