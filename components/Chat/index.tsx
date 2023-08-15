import Link from "next/link";
import Header from "../Header";

export default function Chat() {
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center  mt-24">
        <div className="border border-gray-500 rounded-lg max-w-3xl p-24 w-full h-96 shadow-inner shadow-indigo-200">
          <div className="text-center">
            <h1 className="text-8xl font-bold text-primary text-center">Hey!</h1>
            <h2 className="text-3xl mt-6 text-center">How can I help?</h2>
          </div>
          
        </div>
        <p className="mt-2 text-gray-500">From: https://google.com?q=heyHowIs</p>
        <div className="mt-8 flex gap-4">
          <button className="rounded-md text-center bg-black/20 py-4 w-48 px-8 text-base font-semibold text-black duration-300 ease-in-out hover:bg-black/30 dark:bg-white/20 dark:text-white dark:hover:bg-white/30">Add source</button>
          <Link href={'/'} className="rounded-md text-center bg-black/20 py-4 w-48 px-8 text-base font-semibold text-black duration-300 ease-in-out hover:bg-black/30 dark:bg-white/20 dark:text-white dark:hover:bg-white/30">Create New</Link>
        </div>
        <div className="flex flex-col w-full">
          <div className=' w-full flex justify-center mx-2 mt-12'>
            
            <input autoFocus className='bg-white text-black cursor-text mx-2 rounded-3xl py-3 px-4 max-w-4xl w-full border-2 shadow-lg shadow-gray' placeholder="What's your question?..."></input>
        </div>
        </div>
      </div>
    </div>
  )
}