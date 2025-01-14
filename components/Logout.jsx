"use client"

import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  // Handle logout
  const handleLogout = async () => {
    try {
      // Make an API request to clear the authToken and log out the user
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // Redirect to login page or home page after successful logout
        router.push('/login'); // or any route you want
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-full py-1 px-4 shadow-sm text-sm text-white bg-orange-500 hover:bg-orange-400 transition-all"
    >
      Log Out
    </button>
  );
}
