import { checkAuth } from "@/utils/checkAuth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { encryptText } from "@/utils/crypto";

export async function POST(req) {
  try {
    const { isAuthenticated, user } = await checkAuth(req);
    const defaultContent = ""; // Default value for the new note
    const cookieStore = await cookies();

    // Generate base URL dynamically
    const baseUrl = `${req.headers.get('X-Forwarded-Proto') || 'http'}://${req.headers.get('host')}`;

    if (isAuthenticated) {
      // Create a new note in the database
      const newNote = await prisma.note.create({
        data: {
          content: encryptText(defaultContent),
          userId: user.id,
        },
      });

      // Redirect to the note page using absolute URL
      return NextResponse.redirect(`${baseUrl}/note/${newNote.id}`);
    } else {
      // Fetch existing local notes or initialize an empty array
      const localNotes = cookieStore.get("notes")?.value
        ? JSON.parse(cookieStore.get("notes").value)
        : [];

      // Generate a unique ID for the local note
      const newNoteId = Date.now(); // A simple unique identifier (you can enhance this as needed)

      // Add the new note to the local notes
      localNotes.push({ id: newNoteId, content: defaultContent });

      // Save updated notes back to cookies
      const response = NextResponse.redirect(`${baseUrl}/note/${newNoteId}`);
      response.cookies.set(
        "notes",
        JSON.stringify(localNotes),
        {
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        }
      );

      return response;
    }
  } catch (err) {
    console.error("Error creating note:", err);
    return NextResponse.json(
      { error: "Failed to create note." },
      { status: 500 }
    );
  }
}
