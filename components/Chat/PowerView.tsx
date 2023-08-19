"use client";

import { selectUser } from "@/redux/features/UserSlice"
import Link from "next/link";
import { useSelector } from "react-redux"
import parse from 'html-react-parser';
import { useState } from "react";
import Sidebar from "./Sidebar";


export type WebResults = {
  image: string,
  title: string,
  url: string,
  description: string,
  isVideo: boolean
}


export default function PowerView() {
  const [open, setOpen] = useState(true)

  const user = useSelector(selectUser);
  const resultCard = (result: WebResults) => {
    return (
      <Link href={result.url} key={result.title} target='blank' className=' p-4 rounded-lg cursor-pointer'>
        <div className="flex gap-4">
          <div className="w-12 h-12 relative flex flex-shrink-0">
            <img className="shadow-md rounded-full w-full h-full object-cover"
              src={result.image}
              alt=""
            />
          </div>
          <div>
            <h1 className='text-primary font-medium'>{result.title}</h1>
            <p className='text-slate-700 dark:text-gray-300'>{parse(result.description.substring(0, 90))}...</p>
            {/* <div className='flex gap-4'>
              <button className='bg-dark text-white px-4 rounded-lg hover:bg-dark/80'>Load</button>
              <button  className='bg-dark text-white px-4 rounded-lg hover:bg-dark/80'>Open</button>
            </div> */}
          </div>

        </div>
      </Link>
    )
  };

  return (
    <div className="h-full">
      <div className='flex flex-col h-full gap-4 text-gray-500'>
        <div className='flex flex-col gap-4 flex-1'>
          <h1 className='text-primary text-center font-bold'>Power View</h1>
          {user?.webSources?.length > 0 && user?.webSources?.map((source: WebResults) => resultCard(source))}
        </div>
        <div className='flex flex-col gap-4'>
          <Sidebar open={open} setOpen={setOpen} />
          <button onClick={()=>setOpen(true)} className='py-4 px-6 bg-dark rounded-lg text-white hover:bg-dark/80'>Add custom context</button>
          <button className='py-4 px-6 bg-white border border-3 shadow-md rounded-lg text-black hover:bg-black/5'>Share</button>
        </div>      
      </div>
    </div>
  )
}