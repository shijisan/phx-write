"use client";

import { HiMail, HiKey, HiUserCircle } from "react-icons/hi";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
   const router = useRouter();
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      const formData = new FormData(e.target);
      const firstName = formData.get('firstName');
      const lastName = formData.get('lastName');
      const fullName = `${firstName} ${lastName}`.trim();
      const email = formData.get('email');
      const password = formData.get('password');

      try {
         const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               email,
               password,
               fullName,
            }),
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
         }

         // Successful registration
         router.push('/notes'); // or wherever you want to redirect after registration
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         <main className="min-h-screen flex flex-col justify-center items-center pt-[10vh]">
            <div className="max-w-6xl flex flex-col justify-center items-center h-full w-full">
               <form className="form w-full max-w-sm" onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  {error && <div className="error-message">{error}</div>}
                  <div>
                     <div>
                        <label htmlFor="fullName">Full Name</label>
                        <label className="hidden" htmlFor="firstName"></label>
                        <label className="hidden" htmlFor="lastName"></label>
                        <input className="iconed" type="text" name="firstName" id="firstName" placeholder="First Name" required />
                        <HiUserCircle className="icon" />
                        <input className="iconed" type="text" name="lastName" id="lastName" placeholder="Last Name" required />
                        <HiUserCircle className="icon" />
                     </div>
                  </div>
                  <div>
                     <label htmlFor="email">Email</label>
                     <input className="iconed" type="email" name="email" id="email" placeholder="you@example.com" required />
                     <HiMail className="icon" />
                  </div>
                  <div>
                     <label htmlFor="password">Password</label>
                     <input className="iconed" type="password" name="password" id="password" placeholder="********" required />
                     <HiKey className="icon" />
                  </div>

                  <div>
                     <button type="submit" className="primary-btn" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                     </button>
                  </div>
                  <div className="mt-3">
                     <small className="text-center">Already have an account? <a className="text-blue-600 underline hover:text-blue-500" href="/login">Log In</a></small>
                  </div>
               </form>
            </div>
         </main>
      </>
   );
}