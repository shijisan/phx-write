import { checkAuth } from "@/utils/checkAuth";  // Import authentication check utility
import { NextResponse } from "next/server";  // Import Next.js response utility
import { cookies } from "next/headers";  // Access cookies in Next.js
import prisma from "@/lib/prisma";  // Prisma ORM for database interaction

export async function DELETE(req, { params }) {
  try {
    // Extract note ID from the URL params
    const { id } = await params;
    const cookieStore = await cookies();  // Get cookies to check for local notes

    // Check if the note ID exists
    if (!id) {
      return NextResponse.json(
        { status: "error", message: "Note ID is missing" },
        { status: 400 }
      );
    }

    // Check if the user is authenticated
    const { isAuthenticated, user } = await checkAuth(req);

    if (isAuthenticated) {
      // If authenticated, delete the note from the database
      await prisma.note.delete({
        where: { id: parseInt(id) },  // Parse ID as an integer
      });

      // Return success response after deletion
      return NextResponse.json(
        { status: "success", message: "Note deleted successfully" },
        { status: 200 }
      );
    } else {
      // If not authenticated, handle the deletion of local notes
      const localNotes = cookieStore.get("notes")?.value
        ? JSON.parse(cookieStore.get("notes").value)  // Parse local notes from cookies
        : [];

      // Filter out the note with the matching ID (for local notes)
      const updatedLocalNotes = localNotes.filter((note) => note.id !== parseInt(id));

      // If local notes were updated (note deleted), save the updated notes back to cookies
      if (updatedLocalNotes.length !== localNotes.length) {
        const response = NextResponse.json(
          { status: "success", message: "Local note deleted successfully" },
          { status: 200 }
        );

        response.cookies.set("notes", JSON.stringify(updatedLocalNotes), {
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",  // Ensure secure cookie for production
        });

        return response;
      } else {
        // Return error if the note was not found in local notes
        return NextResponse.json(
          { status: "error", message: "Note not found in local storage" },
          { status: 404 }
        );
      }
    }
  } catch (err) {
    console.error("Error deleting note:", err);
    return NextResponse.json(
      { status: "error", message: "Failed to delete note" },
      { status: 500 }
    );
  }
}
