"use client"


export default function HomePage() {
	return (
		<>
			<main className="min-h-screen pt-[10vh] flex justify-center items-center">
				<div className="flex lg:flex-row flex-col w-full min-h-[70vh] max-w-6xl bg-zinc-800 rounded shadow">
					<div className="lg:w-1/2 w-full lg:h-auto h-[35vh] flex flex-col justify-center items-center bg-gradient-to-b from-blue-950 via-zinc-800 to-zinc-800 md:p-0 p-4">
						<div className="flex flex-col space-y-3">
							<h1 className="text-3xl">Continue as Guest</h1>
							<p className="text-sm text-red-500">Warning: clearing localStorage will erase your data!</p>
							<a href="/notes" className="btn-orange w-fit inline-flex items-center">
								<span className="me-1">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
										<path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
									</svg>

								</span>
								Continue as Guest</a>
						</div>
					</div>
					<div className="lg:w-1/2 w-full lg:h-auto h-[35vh] flex flex-col justify-center items-center bg-gradient-to-b from-orange-500 via-neutral-800 to-neutral-800 md:p-0 p-4">
						<div className="flex flex-col space-y-3">
							<h1 className="text-3xl">Use an Account</h1>
							<p className="text-sm text-green-500">Register and Log In an account to save your data online!</p>
							<div className="flex flex-row justify-between items-center w-full gap-2">
								<a href="/login" className="btn-blue w-1/2">Login</a>
								<a href="/register" className="btn-orange w-1/2">Register</a>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	)
}