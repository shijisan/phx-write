"use client";

import { useRouter } from "next/navigation";
import { PiNotePencil } from "react-icons/pi";
import { useState, useEffect } from "react";

export default function Home() {
	const router = useRouter();

	// State to track the current visible image
	const [currentImage, setCurrentImage] = useState(0);

	useEffect(() => {
		// Set interval to switch images every 3 seconds
		const interval = setInterval(() => {
			setCurrentImage((prev) => (prev + 1) % 3); // Cycle between 0, 1, 2
		}, 8000);

		// Cleanup interval on component unmount
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<main className="h-[101vh] flex justify-center items-center flex-col">
				<div className="max-w-6xl w-full flex md:flex-row flex-col pt-[10vh] items-center justify-center h-full p-4">
					<div className="md:w-1/2 w-full md:h-96 h-full flex flex-col md:justify-between justify-evenly md:items-start items-center">
						<div>
							<h1 className="md:text-8xl text-5xl font-medium ubuntu mb-2">Hold Up!</h1>
							<h2 className="md:text-3xl ubuntu">Your Writing is This <span className="text-orange-500">Fire 🔥</span>?</h2>
							<button className="w-fit font-medium bg-orange-500 text-sm hover:bg-orange-400 py-2 transition-all mt-6 px-4 rounded-full inline-flex justify-center items-center" onClick={() => router.push("/notes")}>
								<span><PiNotePencil className="size-6 me-1" /></span>Try Our Notes App
							</button>
						</div>

						<div className="border-s-4 border-orange-500 text-white ps-8">
							<p className="max-w-md leading-relaxed">With our notes app, you get the perfect balance of style and security. Enjoy seamless access and a smooth user experience powered by Quill.js, while knowing your data is fully encrypted and only accessible by YOU.</p>
						</div>
					</div>
					<div className="md:w-1/2 md:flex hidden flex-col justify-center items-center h-80">
						<img src="/home-1.svg" className={`h-full ${currentImage === 0 ? "block" : "hidden"}`} />
						<img src="/home-2.svg" className={`h-full ${currentImage === 1 ? "block" : "hidden"}`} />
						<img src="/home-3.svg" className={`h-full ${currentImage === 2 ? "block" : "hidden"}`} />
					</div>
				</div>
			</main>
		</>
	);
}
