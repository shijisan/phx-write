"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Notes() {
	const [notes, setNotes] = useState([]);
	const [draggedNote, setDraggedNote] = useState(null);
	const [dragging, setDragging] = useState(false);
	const [draggingOverTrash, setDraggingOverTrash] = useState(false);
	const [longPress, setLongPress] = useState(false);
	const [pressTimer, setPressTimer] = useState(null);
	const [noteToDelete, setNoteToDelete] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
		setNotes(storedNotes);
	}, []);

	useEffect(() => {
		if (notes.length > 0) {
			localStorage.setItem("notes", JSON.stringify(notes));
		}
	}, [notes]);

	const handleNewNote = () => {
		const newNote = {
			id: Date.now(),
			content: "",
		};
		setNotes((prevNotes) => [...prevNotes, newNote]);
	};

	const handleNoteClick = (id) => {
		if (!longPress) {
			router.push(`/notes/${id}`);
		}
	};

	const handleDragStart = (event, note) => {
		setDraggedNote(note);
		setDragging(true);
		event.dataTransfer.setData("note", JSON.stringify(note));
		event.target.style.opacity = "0";
	};

	const handleDragEnd = (event) => {
		event.target.style.opacity = "1";
		setDragging(false);
	};

	const handleDragOver = (event, note) => {
		event.preventDefault();
		if (event.target.classList.contains("note-item")) {
			const draggedOverNoteId = event.target.getAttribute("data-id");
			setNotes((prevNotes) => {
				const draggedNoteIndex = prevNotes.findIndex(
					(n) => n.id === draggedNote.id
				);
				const draggedOverNoteIndex = prevNotes.findIndex(
					(n) => n.id === Number(draggedOverNoteId)
				);
				const newNotes = [...prevNotes];
				newNotes.splice(draggedNoteIndex, 1);
				newNotes.splice(draggedOverNoteIndex, 0, draggedNote);
				return newNotes;
			});
		}
	};

	const handleDrop = (event) => {
		event.preventDefault();
		setDragging(false);
	};

	const handleTrashDrop = (event) => {
		const droppedNote = JSON.parse(event.dataTransfer.getData("note"));
		setNotes((prevNotes) => prevNotes.filter((note) => note.id !== droppedNote.id));
		setDragging(false);
	};

	const handleTrashDragOver = (event) => {
		event.preventDefault();
		setDraggingOverTrash(true);
	};

	const handleTrashDragLeave = () => {
		setDraggingOverTrash(false);
	};

	const startPressTimer = (isTouchEvent) => {
		if (!isTouchEvent) return;
		const timer = setTimeout(() => {
			setLongPress(true);
			setNoteToDelete(draggedNote);
		}, 1000);
		setPressTimer(timer);
	};

	const cancelPressTimer = (isTouchEvent) => {
		if (!isTouchEvent) return;
		clearTimeout(pressTimer);
		setLongPress(false);
		setNoteToDelete(null);
	};

	const deleteNote = () => {
		setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteToDelete.id));
		setLongPress(false);
		setNoteToDelete(null);
	};

	const cancelDelete = () => {
		setLongPress(false);
		setNoteToDelete(null);
	};

	return (
		<main className="pt-[11vh] max-w-6xl m-auto">
			<div className="w-full min-h-[89vh] border rounded bg-zinc-800">
				<h1 className="my-4 px-4 text-3xl">Your Notes</h1>
				<div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4 px-4">
					<button
						onClick={handleNewNote}
						className="group rounded-xl btn-dark border self-start flex justify-center items-center aspect-square transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6 group-hover:hidden"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-6 group-hover:block hidden"
						>
							<path
								fillRule="evenodd"
								d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
								clipRule="evenodd"
							/>
						</svg>
					</button>

					{notes.map((note) => (
						<div
							key={note.id}
							className="note-item rounded-xl btn-dark cursor-pointer border self-start flex aspect-square"
							data-id={note.id}
							onClick={() => handleNoteClick(note.id)}
							draggable
							onDragStart={(event) => handleDragStart(event, note)}
							onDragOver={(event) => handleDragOver(event, note)}
							onDrop={handleDrop}
							onDragEnd={handleDragEnd}
							onTouchStart={() => startPressTimer(true)}
							onTouchEnd={() => cancelPressTimer(true)}
						>
							<div
								className="text-white p-4 note-content"
								dangerouslySetInnerHTML={{
									__html: note.content || "Empty Note",
								}}
							/>
						</div>
					))}
				</div>

				{dragging && (
					<div
						className={`fixed flex justify-center items-center bottom-10 right-10 p-4 w-32 h-32 bg-red-600 rounded-full text-center text-white font-bold cursor-pointer`}
						onDragOver={handleTrashDragOver}
						onDrop={handleTrashDrop}
						onDragLeave={handleTrashDragLeave}
					>
						<p className="text-xs">Drop to delete</p>
					</div>
				)}

				{longPress && noteToDelete && (
					<div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
						<div className="bg-zinc-800 p-6 rounded-xl">
							<p>Are you sure you want to delete this note?</p>
							<div className="flex justify-around mt-4">
								<button
									className="bg-red-500 text-white p-2 rounded"
									onClick={deleteNote}
								>
									Delete
								</button>
								<button
									className="bg-gray-500 text-white p-2 rounded"
									onClick={cancelDelete}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
