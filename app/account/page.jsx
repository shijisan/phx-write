"use client"

import { useEffect, useState } from "react";
import Logout from "@/components/Logout";
import { HiTrash } from "react-icons/hi";

export default function Account() {
   const [user, setUser] = useState(null);
   const [error, setError] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [confirmationText, setConfirmationText] = useState("");

   useEffect(() => {
      // Fetch user data
      async function fetchUser() {
         try {
            const response = await fetch("/api/account/get");
            if (!response.ok) {
               throw new Error("Failed to fetch user data");
            }
            const userData = await response.json();
            setUser(userData);
         } catch (err) {
            setError(err.message);
         }
      }

      fetchUser();
   }, []);

   const handleDelete = async () => {
      if (confirmationText !== "I understand") {
         alert("Please type 'I understand' to confirm.");
         return;
      }

      const confirmation = window.confirm("Are you sure you want to delete your account?");
      if (confirmation) {
         try {
            const response = await fetch("/api/account/delete", {
               method: "DELETE",
            });
            if (!response.ok) {
               throw new Error("Failed to delete account");
            }
            alert("Account deleted successfully");
            // Optionally, redirect to home or log out
            window.location.href = "/";
         } catch (err) {
            alert(err.message);
         }
      }
   };

   return (
      <main className="pt-[10vh] flex justify-center items-center">
         <div className="w-full max-w-6xl min-h-screen">
            {error && <p>Error: {error}</p>}
            {user ? (
               <div className="p-4">
                  <div className="mb-8">
                     <h1 className="text-3xl mb-2">Welcome, {user.email}.</h1>
                     <p>This is your account page, from here you can choose to log out of your account or permanently delete your account.</p>
                  </div>
                  <h1 className="text-3xl mb-2">Privacy & Your Data</h1>
                  <p>Your data is encrypted with <b>aes-256-cbc</b> algorithm to make sure that your account and notes are safe, where you and only you can view your data.</p>

                  <div className="flex items-center mt-8 space-x-8">
                     <button onClick={() => setIsModalOpen(true)} className="rounded-full py-1 px-4 text-sm bg-red-600 hover:bg-red-500 text-white w-fit inline-flex justify-center items-center transition-all">
                        <span>
                           <HiTrash className="me-1" />
                        </span>
                        Delete Account
                     </button>
                     <Logout />
                  </div>
               </div>
            ) : (
               <p>Loading user data...</p>
            )}

            {/* Modal */}
            {isModalOpen && (
               <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-black">
                     <h2 className="text-lg font-semibold mb-4">Confirm Account Deletion</h2>
                     <p>Your account will be deleted and this process can't be undone. To delete your account, type "I understand" in the input below:</p>
                     <input
                        type="text"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        className="mt-2 p-2 border border-gray-300 rounded w-full"
                        placeholder="Type 'I understand'"
                     />
                     <div className="mt-4 flex justify-end space-x-4">
                        <button
                           onClick={() => setIsModalOpen(false)}
                           className="px-4 py-2 bg-gray-300 text-black rounded"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={handleDelete}
                           disabled={confirmationText !== "I understand"}
                           className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                           Confirm Delete
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>

      </main>
   );
}
