"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import "react-quill-new/dist/quill.snow.css";

export default function NoteEditor() {
   const [editorValue, setEditorValue] = useState("");
   const [notes, setNotes] = useState([]);
   const router = useRouter();

   const { id: noteId } = useParams();

   useEffect(() => {
      const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
      setNotes(storedNotes);
   }, []);

   useEffect(() => {
      if (notes.length > 0 && noteId) {
         const note = notes.find((note) => note.id.toString() === noteId);
         if (note) {
            setEditorValue(note.content);
         }
      }
   }, [notes, noteId]);

   const handleChange = (value) => {
      setEditorValue(value);
      const updatedNotes = notes.map((note) =>
         note.id.toString() === noteId ? { ...note, content: value } : note
      );
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
   };

   return (
      <>
         <main className="pt-[10vh!important] md:max-w-6xl w-full m-auto md:p-0 p-4">
            <button className="btn-orange my-2 inline-flex" onClick={() => router.back()}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
               </svg>
               Back
            </button>

            <div className="editor-container bg-zinc-800 min-h-[70vh]">
               <ReactQuill
                  value={editorValue}
                  onChange={handleChange}
                  theme="snow"
               />
            </div>
         </main>
      </>
   );
}
