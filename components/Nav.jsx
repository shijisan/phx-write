"use client"

import { HiBars3, HiXMark } from "react-icons/hi2";
import { useState, useEffect, useRef } from "react";

export default function Nav() {
	const navRef = useRef(null);
	const navListRef = useRef(null);
	const closeNavListRef = useRef(null);
	const expandNavListRef = useRef(null);

	useEffect(() => {
		const handleScroll = () => {
			if (navRef.current) {
				if (window.scrollY === 0) {
					navRef.current.classList.add("md:bg-opacity-0");
					navRef.current.classList.remove("bg-opacity-100");
				} else {
					navRef.current.classList.remove("md:bg-opacity-0");
					navRef.current.classList.add("bg-opacity-100");
				}
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleMobileNavList = () => {
		if (navListRef.current && closeNavListRef.current && expandNavListRef.current) {
			navListRef.current.classList.toggle("flex");
			navListRef.current.classList.toggle("hidden");
			closeNavListRef.current.classList.toggle("hidden");
			expandNavListRef.current.classList.toggle("hidden");
		}
	};


	return (
		<nav
			className="h-[10vh] w-full z-30 fixed top-0 left-0 px-4 flex flex-row transition-all bg-indigo-900"
			ref={navRef}
		>
			<div className="flex justify-center items-center md:w-1/2 w-3/4 logo">
				<span className="text-3xl font-bold text-orange-500 tracking-wide inline-flex items-center">
					<img src="/logo.svg" className="size-8 me-1" />
					PHX/WRITE
				</span>
			</div>

			<div className="md:hidden inline-flex justify-center items-center md:w-0 w-1/4">
				<button onClick={toggleMobileNavList}>
					<HiBars3 ref={expandNavListRef} className="size-8" />
					<HiXMark ref={closeNavListRef} className="size-8 hidden" />
				</button>
			</div>

			<ul
				ref={navListRef}
				className="md:w-1/2 w-full md:h-auto h-[90vh] md:flex hidden md:flex-row flex-col justify-evenly items-center md:static fixed top-[10vh] left-0 md:bg-transparent bg-indigo-950"
			>
				<li><a href="/">Home</a></li>
				<li><a href="/notes">Notes</a></li>
				<li><a href="/account">Account</a></li>
			</ul>
		</nav>
	);
}
