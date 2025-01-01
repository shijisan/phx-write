"use client"

import { useState } from "react";

export default function NavBar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<>
			<nav className="flex flex-row bg-blue-950 w-full fixed top-0 h-[10vh] z-30 shadow-sm">
				<div className="w-1/2 flex flex-row space-x-2 text-orange-500 md:ps-0 ps-4 font-bold justify-center">
					<h1 className="text-2xl inline-flex items-center">
						PHX <span>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
								<path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
							</svg>
						</span> WRITE
					</h1>
				</div>


				<button
					className="md:hidden text-orange-500 w-1/2 flex justify-end pe-4 items-center"
					onClick={toggleMenu}
				>
					{isMenuOpen ? (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
							<path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
						</svg>

					) : (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
							<path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
						</svg>
					)}
				</button>

				<ul className="hidden md:flex justify-evenly items-center w-1/2 bg-orange-500 text-blue-950 font-medium">
					<li><a href="/">Home</a></li>
					<li><a href="/notes">Notes</a></li>
					<li><a href="/developer">About Dev</a></li>
					<li><a href="/account">Account</a></li>
				</ul>
			</nav>


			{isMenuOpen && (
				<div className="md:hidden bg-orange-500 text-blue-950 font-medium p-4 fixed top-[10vh] h-screen left-0 w-full">
					<ul className="space-y-4">
						<li><a href="/">Home</a></li>
						<li><a href="/notes">Notes</a></li>
						<li><a href="/developer">About Dev</a></li>
						<li><a href="/account">Account</a></li>
					</ul>
				</div>
			)}
		</>
	);
}
