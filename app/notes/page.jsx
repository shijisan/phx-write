"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiPlus } from "react-icons/hi";



export default function Notes() {
	const [notes, setNotes] = useState([]);
	const [localNotes, setLocalNotes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasMerged, setHasMerged] = useState(false); // Flag to track if merge has occurred
	const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
	const [modalNotes, setModalNotes] = useState([]); // Notes to merge in modal
	const router = useRouter();

	// Fetch notes from the API
	const fetchNotes = async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/notes/get");
			const data = await response.json();

			// Handle different response structures based on status
			if (data.status === "merge_required" && !hasMerged) {
				setNotes(data.dbNotes || []); // Ensure default empty array if no notes
				setLocalNotes(data.localNotes || []); // Ensure default empty array if no localNotes
				setModalNotes(data.localNotes || []); // Store the local notes to show in the modal
				setIsModalOpen(true); // Open the modal for merge confirmation
			} else if (data.status === "success") {
				setNotes(data.notes || []); // Ensure notes is always an array
			}
		} catch (err) {
			console.error("Failed to fetch notes:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Merge local notes into the database
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
				setNotes(data.notes || []); // Use the notes from the merge response, ensure default empty array
				setHasMerged(true); // Set merge status to true
				setIsModalOpen(false); // Close the modal
			}
		} catch (err) {
			console.error("Failed to merge notes:", err);
		}
	};

	// Delete local notes
	const deleteLocalNotes = () => {
		document.cookie = "notes=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		setLocalNotes([]); // Ensure localNotes is set to an empty array
	};

	// Add a new note via the API
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

	// Redirect to the note's page on click
	const handleNoteClick = (noteId) => {
		router.push(`/note/${noteId}`);
	};

	// Delete a note via the API
	const deleteNote = async (noteId) => {
		try {
			const response = await fetch(`/api/notes/delete/${noteId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setNotes(notes.filter((note) => note.id !== noteId)); // Remove deleted note from UI
			} else {
				console.error("Failed to delete note");
			}
		} catch (err) {
			console.error("Error deleting note:", err);
		}
	};

	useEffect(() => {
		fetchNotes();
	}, []); // Empty dependency array to run only once when the component mounts

	// Trigger re-fetching the notes if they were updated or merged
	useEffect(() => {
		if (hasMerged) {
			fetchNotes(); // Re-fetch notes after merge
		}
	}, [hasMerged]);

	if (isLoading) {
		return (
			<main className="min-h-screen pt-[10vh]">
				<div className="text-center">Loading notes...</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen pt-[10vh] p-4">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold my-4 tracking-wide">Notes</h1>

				{notes.length > 0 ? (
					<ul className="flex flex-wrap justify-between">
						{notes.map((note) => (
							<li
								key={note.id}
								onClick={() => handleNoteClick(note.id)}
								className="p-3 bg-white shadow rounded-lg cursor-pointer hover:shadow-md text-black border note font-sans m-4 overflow-hidden hover:scale-105 transition-all md:w-auto w-full"
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

				{localNotes.length > 0 && (
					<div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
						<p className="text-yellow-700">
							You have {localNotes.length} local note(s) stored.
						</p>
					</div>
				)}
			</div>

			{/* Modal for merge confirmation */}
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
									setIsModalOpen(false); // Close the modal if declined
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
