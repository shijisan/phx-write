export default function Developer() {
   return (
      <>
         <main className="w-full min-h-screen pt-[11vh]">
            <div className=" bg-zinc-800 max-w-6xl m-auto min-h-[89vh] rounded">
               <div className="flex justify-center items-center w-full px-4 flex-col">
                  <img src="/dev.png" alt="Christian James Santos" className="w-64 rounded-full border-4 border-white bg-blue-950" />
                  <a className="text-white text-2xl font-semibold mt-6 hover:underline" href="https://github.com/shijisan?tab=repositories">shiji</a>
                  <div className="w-full mt-4 pt-4 border-t-2 border-white px-4">
                     <h1 className="text-xl font-medium">My Portfolio:</h1>
                     <a href="https://shijisan-portfolio.vercel.app/" className="ps-8 hover:underline" >https://shijisan-portfolio.vercel.app/</a>

                     <h1 className="text-xl mt-6 font-medium">About Me:</h1>
                     <p className="ps-8">One of the nealest riggas, sigma boy irl, tap in for big web dev motion</p>
                  </div>

                  <div className="w-full h-full mt-6 px-4">

                     <h1 className="text-xl font-medium">Donations:</h1>
                     <div className="ms-8">

                        <a href="https://www.paypal.com/paypalme/shijifmb" className="btn-orange inline-flex mt-2">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 me-1">
                              <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                              <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                           </svg>
                           Donate to Me
                        </a>
                     </div>

                  </div>


               </div>

            </div>
         </main>
      </>
   )
}