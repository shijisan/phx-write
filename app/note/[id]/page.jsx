"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { HiChevronLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";



// Dynamically import ReactQuill with ssr: false to ensure it runs only on the client side
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import "react-quill-new/dist/quill.snow.css"; // Import Quill styles

export default function NotePage() {
  const router = useRouter();
  const { id } = useParams(); // Get the 'id' from URL params
  const [noteContent, setNoteContent] = useState("");
  const [loading, setLoading] = useState(true); // For showing loading state

  useEffect(() => {
    // Fetch the note content from the API when the component is mounted
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/note/get/${id}`);
        const data = await response.json();

        if (data.note) {
          setNoteContent(data.note.content); // Set the content from the API response
        } else {
          // Handle case if no note is found
          console.error("Note not found");
        }
      } catch (err) {
        console.error("Error fetching note:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]); // Re-run if 'id' changes

  const handleChange = async (value) => {
    setNoteContent(value); // Update the note content as the user types

    try {
      // Send updated note content to the API (PUT request)
      await fetch(`/api/note/put/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: value }),
      });
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-[10vh]">
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-[10vh] w-full items-center flex flex-col">
      <div className="max-w-6xl flex flex-col w-full h-full mt-4">

        <h1 className="absolute bottom-8 right-8">Note {id}</h1>

        <button className="inline-flex w-fit items-center justify-center py-1 px-4 text-sm bg-orange-500 hover:bg-orange-400 rounded-full transition-all my-4" onClick={() => router.back()}>
          <HiChevronLeft className="me-1 size-6" />
          Back
        </button>

        <ReactQuill
          value={noteContent}
          onChange={handleChange}
          theme="snow"
          placeholder="Start writing your note..."
          className="w-full h-full bg-white text-black quill rounded-lg"
        />
      </div>

    </main>
  );
}
