"use client";

import { selectUser, setUserData } from "@/redux/features/UserSlice"
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux"
import parse from 'html-react-parser';
import { useState } from "react";
import Sidebar from "./Sidebar";
import { baseurl } from "@/utils/app";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";


export type WebResults = {
  image: string,
  title: string,
  url: string,
  description: string,
  isVideo: boolean
}


export default function PowerView() {
  const [open, setOpen] = useState(false);
  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  const handleUploadOpen = (open: boolean) => {
    mixpanel.track('Custom context clicked');
    dispatch(setUserData({contextUploadOpen: open}))
  }

  const handleShare = () => {
    mixpanel.track('Chat share button clicked');
    navigator.clipboard.writeText(`${baseurl}/chat?name=${user.activeGroup?.name}&eid=${user.activeGroup?.npcId?.npcId}`);
    toast.info('Link Copied');
  }
  return (
    <div className="h-full">
      <div className='flex flex-col h-full gap-4 text-gray-500'>
        <div className='flex flex-col gap-4 flex-1'>
          <h1 className='text-primary text-center font-bold'>Power View</h1>
          {/* {user?.webSources?.length > 0 && user?.webSources?.map((source: WebResults) => resultCard(source))} */}
          <p>We&#39;re still exploring what to add here. If you have any ideas, drop them in the discord!</p>
        </div>
        <div className='flex flex-col gap-4'>
          <Sidebar open={open} setOpen={handleUploadOpen} />
          <button onClick={()=>handleUploadOpen(true)} className='py-4 px-6 bg-dark rounded-lg text-white hover:bg-dark/80'>Custom context</button>
          <button onClick={handleShare} className='py-4 px-6 bg-white border border-gray-300 shadow-md rounded-lg text-black hover:bg-black/5'>Share</button>
        </div>      
      </div>
    </div>
  )
}