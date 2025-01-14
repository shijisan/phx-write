import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  // Extract the `id` from the URL parameters
  const { id } = await params;  // params.id should hold the note ID

  try {
    // Check if the `id` is valid and proceed with deleting the note
    if (!id) {
      return new Response(
        JSON.stringify({ status: "error", message: "Note ID is missing" }),
        { status: 400 }
      );
    }

    // Delete the note from the database using Prisma
    const deletedNote = await prisma.note.delete({
      where: {
        id: parseInt(id),  // Ensure id is treated as an integer (if it's a numeric ID)
      },
    });

    // If note is successfully deleted, return success response
    return new Response(
      JSON.stringify({ status: "success", message: "Note deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting note:", err);
    return new Response(
      JSON.stringify({ status: "error", message: "Failed to delete note" }),
      { status: 500 }
    );
  }
}
