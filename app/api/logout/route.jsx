// /app/api/logout/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();

    // Clear the authToken cookie
    cookieStore.delete('authToken'); // This deletes the authToken cookie

    // Respond with a success message
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Error logging out:', err);
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}
