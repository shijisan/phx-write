"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiPlus, HiTrash } from "react-icons/hi";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [localNotes, setLocalNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMerged, setHasMerged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNotes, setModalNotes] = useState([]);
  const [isDraggingNote, setIsDraggingNote] = useState(false);
  const [draggedNoteId, setDraggedNoteId] = useState(null);
  const [isOverDeleteZone, setIsOverDeleteZone] = useState(false);
  const router = useRouter();

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/notes/get");
      const data = await response.json();

      if (data.status === "merge_required" && !hasMerged) {
        setNotes(data.dbNotes || []);
        setLocalNotes(data.localNotes || []);
        setModalNotes(data.localNotes || []);
        setIsModalOpen(true);
      } else if (data.status === "success") {
        setNotes(data.notes || []);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const mergeLocalNotes = async (localNotesToMerge) => {
    try {
      const response = await fetch("/api/notes/merge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ localNotes: localNotesToMerge }),
      });

      if (response.ok) {
        const data = await response.json();
        deleteLocalNotes();
        setNotes(data.notes || []);
        setHasMerged(true);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to merge notes:", err);
    }
  };

  const deleteLocalNotes = () => {
    document.cookie = "notes=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setLocalNotes([]);
  };

  const addNote = async () => {
    try {
      const response = await fetch("/api/notes/post", {
        method: "POST",
      });
      if (response.redirected) {
        router.push(response.url);
      }
    } catch (err) {
      console.error("Failed to create a new note:", err);
    }
  };

  const handleNoteClick = (noteId) => {
    router.push(`/note/${noteId}`);
  };

  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`/api/notes/delete/${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchNotes();
      } else {
        console.error("Failed to delete note");
      }
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  // Drag handlers
  const handleDragStart = (e, noteId) => {
    e.dataTransfer.setData("noteId", noteId);
    setIsDraggingNote(true);
    setDraggedNoteId(noteId);

    // Create a custom drag image
    const draggedNote = e.target.cloneNode(true);

    // Set styles for the cloned drag image
    draggedNote.style.width = `${e.target.offsetWidth}px`;
    draggedNote.style.height = `${e.target.offsetHeight}px`;
    draggedNote.style.position = 'absolute';
    draggedNote.style.top = '-1000px';  // Move off-screen initially
    draggedNote.style.opacity = '1';  // Make it semi-transparent (or 1 for full opacity)
    draggedNote.style.pointerEvents = 'none'; // Ensure the clone doesn't interact with other elements
    draggedNote.style.zIndex = '9999'; // Ensure it's on top of everything else

    // Append the cloned dragged note to the body
    document.body.appendChild(draggedNote);

    // Use the custom drag image
    e.dataTransfer.setDragImage(draggedNote, e.target.offsetWidth / 2, e.target.offsetHeight / 2);

    // Remove the cloned element after the drag starts
    setTimeout(() => {
      document.body.removeChild(draggedNote);
    }, 0);
  };

  const handleDragEnd = () => {
    setIsDraggingNote(false);
    setDraggedNoteId(null);
    setIsOverDeleteZone(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (isOverDeleteZone) {
      const noteId = e.dataTransfer.getData("noteId");
      await deleteNote(noteId);
      setIsDraggingNote(false);
      setDraggedNoteId(null);
      setIsOverDeleteZone(false);
    }
  };

  const handleTouchMove = (e) => {
    const deleteZone = document.getElementById("delete-zone");
    const deleteZoneRect = deleteZone.getBoundingClientRect();
    const touch = e.touches[0];
    if (
      touch.clientX >= deleteZoneRect.left &&
      touch.clientX <= deleteZoneRect.right &&
      touch.clientY >= deleteZoneRect.top &&
      touch.clientY <= deleteZoneRect.bottom
    ) {
      setIsOverDeleteZone(true);
    } else {
      setIsOverDeleteZone(false);
    }
  };

  const handleTouchEnd = async (e) => {
    if (isOverDeleteZone) {
      const noteId = draggedNoteId;
      await deleteNote(noteId);
      setIsDraggingNote(false);
      setDraggedNoteId(null);
      setIsOverDeleteZone(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (hasMerged) {
      fetchNotes();
    }
  }, [hasMerged]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-[10vh] justify-center items-center flex-col m-auto">
        <p className="text-center m-auto">Loading notes...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-[10vh] p-4 relative">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold my-4 tracking-wide">Notes</h1>

        {notes.length > 0 ? (
          <ul className="flex flex-wrap justify-start">
            {notes.map((note) => (
              <li
                key={note.id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, note.id)}
                onDragEnd={handleDragEnd}
                onClick={() => handleNoteClick(note.id)}
                className={`p-3 bg-white shadow rounded-lg cursor-pointer hover:shadow-md text-black border note font-sans m-4 overflow-hidden transition-all md:w-auto w-full
                  ${draggedNoteId === note.id ? 'opacity-0' : 'hover:scale-105'}`}
              >
                <div
                  className="prose prose-sm md:w-max w-full max-w-80 max-h-40"
                  dangerouslySetInnerHTML={{
                    __html: note.content || "Untitled Note",
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No notes yet. Create your first note!</p>
        )}

        <button
          onClick={addNote}
          className="fixed bottom-8 right-8 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-400 transition-all inline-flex items-center justify-center"
        >
          <HiPlus className="me-1" />
          Add Note
        </button>

        {/* Delete drop zone - only visible when dragging */}
        <div
          id="delete-zone"
          className={`fixed bottom-8 left-8 p-6 rounded-full transition-all duration-300 flex items-center justify-center ${isOverDeleteZone ? 'bg-red-500 opacity-100 scale-100' : 'bg-transparent opacity-0 scale-95 pointer-events-none'}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <HiTrash className="text-white text-2xl mr-2" />
          <span className="text-white font-medium">Drop to Delete</span>
        </div>

        {localNotes.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-700">
              You have {localNotes.length} local note(s) stored.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold">Merge Local Notes</h2>
            <p className="mt-4">
              You have local notes detected. Do you want to merge them with your database notes?
            </p>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => {
                  mergeLocalNotes(modalNotes);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Merge
              </button>
              <button
                onClick={() => {
                  deleteLocalNotes();
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-red-500 text-black rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
