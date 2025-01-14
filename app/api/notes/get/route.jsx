import { checkAuth } from "@/utils/checkAuth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { isAuthenticated, user } = await checkAuth();  // Remove req parameter

    // Debug logging
    console.log("Auth status:", isAuthenticated);
    console.log("User data:", user);

    const cookieStore = await cookies();
    const localNotesStr = cookieStore.get("notes")?.value;
    
    // Add debug logging for cookies
    console.log("Local notes cookie:", localNotesStr);
    
    const localNotes = localNotesStr ? JSON.parse(localNotesStr) : [];

    if (isAuthenticated && user) {
      // Debug logging for database query
      console.log("Attempting to fetch notes for user:", user.id);
      
      const dbNotes = await prisma.note.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },  // Add sorting if needed
        include: {  // Include any related data you might need
          // Add fields you want to include
        }
      });
      
      // Debug logging for database results
      console.log("Retrieved database notes:", dbNotes);

      if (localNotes.length > 0) {
        return NextResponse.json({
          status: "merge_required",
          message: "Local notes detected. Merge or delete them?",
          dbNotes,
          localNotes,
        });
      }

      return NextResponse.json({
        status: "success",
        notes: dbNotes
      });
    }

    // For unauthenticated users, return local notes
    return NextResponse.json({
      status: "success",
      notes: localNotes
    });

  } catch (err) {
    console.error("Error in GET /api/notes:", err);
    
    return NextResponse.json(
      { 
        status: "error",
        message: "Failed to retrieve notes.",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined 
      },
      { status: 500 }
    );
  }
}
