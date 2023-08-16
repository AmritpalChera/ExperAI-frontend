"use client";

import { checkUrl } from "@/utils/app";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

export default function Hero() {
  const [link, setLink] = useState('');
  const router = useRouter();
  const handleSubmit = () => {
    if (!checkUrl(link)) {
      return toast.error('Invalid URL')
    }
    else router.push(`/chat?url=${link}`);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className="flex w-full flex-col justify-center items-center">
      <ToastContainer />
      <h1 className="text-9xl font-bold text-primary mt-32">Web it Fast</h1>
      <h2 className="text-3xl mt-6">Enter any URL</h2>
      <div className=' w-full flex justify-center mx-2 mt-12'>
            
          <input onKeyDown={handleKeyDown} value={link} onChange={(e) => setLink(e.target.value)} autoFocus className='bg-white text-black cursor-text mx-2 rounded-3xl py-3 px-4 max-w-4xl w-full border-2 shadow-lg shadow-gray' placeholder={`https//medium.com/...`}></input>
      </div>

      <div className="flex flex-col space-y-4 mt-12 sm:flex-row sm:space-x-4 sm:space-y-0">
        <button
          onClick={handleSubmit}
          className="rounded-md text-center bg-primary w-48 py-4 px-8 text-base  font-semibold text-white duration-300 ease-in-out hover:bg-primary/80 cursor-pointer"
        >
          Search
        </button>
        {/* <Link
          href="https://docs.mindplug.io/javascript-sdk"
          className="rounded-md text-center bg-black/20 py-4 w-48 px-8 text-base font-semibold text-black duration-300 ease-in-out hover:bg-black/30 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
        >
          Random Chat
        </Link> */}
      </div>

    </div>
  )
}