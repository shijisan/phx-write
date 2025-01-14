"use client";

import { HiMail, HiKey } from "react-icons/hi";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });
   
   const router = useRouter();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
         ...formData,
         [name]: value,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      const response = await fetch("/api/login", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
         router.push("/notes");
      } else {
         console.error(result.error); 
         alert(result.error);
      }
   };

   return (
      <>
         <main className="min-h-screen flex flex-col justify-center items-center pt-[10vh]">
            <div className="max-w-6xl flex flex-col justify-center items-center h-full w-full">
               <form className="form w-full max-w-sm" onSubmit={handleSubmit}>
                  <h1>Login</h1>
                  <div>
                     <label htmlFor="email">Email</label>
                     <input
                        className="iconed"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                     />
                     <HiMail className="icon" />
                  </div>
                  <div>
                     <label htmlFor="password">Password</label>
                     <input
                        className="iconed"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                        required
                     />
                     <HiKey className="icon" />
                  </div>
                  <div>
                     <button type="submit" className="primary-btn">
                        Log In
                     </button>
                  </div>
                  <div className="mt-3">
                     <small className="text-center">
                        Don't have an account?{" "}
                        <a
                           className="text-blue-600 underline hover:text-blue-500"
                           href="/register"
                        >
                           Register
                        </a>
                     </small>
                  </div>
               </form>
            </div>
         </main>
      </>
   );
}
