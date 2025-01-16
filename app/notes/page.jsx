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
  const [contextMenu, setContextMenu] = useState(null);
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

  const handleTouchStart = (e, noteId) => {
    const timer = setTimeout(() => {
      const touch = e.touches[0];
      const menuWidth = 150;
      const menuHeight = 100;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = touch.clientX;
      let y = touch.clientY;

      if (x + menuWidth > viewportWidth) x = viewportWidth - menuWidth - 10;
      if (y + menuHeight > viewportHeight) y = viewportHeight - menuHeight - 10;
      if (x < 10) x = 10;
      if (y < 10) y = 10;

      setContextMenu({ visible: true, noteId: noteId, x, y });
    }, 600);

    const handleTouchEnd = () => {
      clearTimeout(timer);
    };

    e.target.addEventListener("touchend", handleTouchEnd, { once: true });
  };

  const handleDeleteFromContextMenu = async () => {
    if (contextMenu) {
      await deleteNote(contextMenu.noteId);
      setContextMenu(null);
    }
  };

  const closeContextMenu = () => {
    setContextMenu(null);
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
                onTouchStart={(e) => handleTouchStart(e, note.id)}
                onClick={() => handleNoteClick(note.id)}
                className={`p-3 bg-white shadow rounded-lg peer cursor-pointer border-indigo-900 hover:shadow-md text-black border note font-sans m-4 overflow-hidden transition-all md:w-auto w-full ${contextMenu?.visible && contextMenu?.noteId === note.id
                    ? "border-4"
                    : "border-0"
                  }`}
              >
                <div
                  className="prose prose-sm md:w-max w-full max-w-80 max-h-40 select-none"
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

        {contextMenu && contextMenu.visible && (
          <div
            className="absolute bg-indigo-500 bg-opacity-50 shadow-lg p-4 rounded-lg visible"
            style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          >
            <button
              onClick={handleDeleteFromContextMenu}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 text-sm flex items-center"
            >
              <HiTrash className="me-1" />
              Delete Note
            </button>
            <button
              onClick={closeContextMenu}
              className="px-4 py-2 mt-2 bg-gray-300 text-black rounded-full hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        )}

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
                onClick={() => mergeLocalNotes(modalNotes)}
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
