"use client";

import { selectUser, setUserData } from "@/redux/features/UserSlice"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react";
import Sidebar from "./Sidebar";
import { baseurl, experaiId } from "@/utils/app";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/navigation";


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
  const router = useRouter();

  const dispatch = useDispatch();

  const handleUploadOpen = (open: boolean) => {
    mixpanel.track('Custom context clicked');
    dispatch(setUserData({contextUploadOpen: open}))
  }

  const handleShare = () => {
    mixpanel.track('Chat share button clicked');
    const group = user.activeGroup;
    if (!group?.creatorId) throw toast.error("Please start a new session to share");
    navigator.clipboard.writeText(`${baseurl}/chat?name=${user.activeGroup?.name}&eid=${user.activeGroup?.npcId?.npcId}&cid=${user.activeGroup.creatorId}`);
    toast.info('Link Copied');
  }

  const handleNewExpert = () => {
    mixpanel.track('New expert button clicked');
    dispatch(setUserData({ newExpertModal: { open: true } }));
    router.push('/experts');
  }

  return (
    <div className="h-full">
      <div className='flex flex-col h-full gap-4 text-gray-500'>
        <div className='flex flex-col gap-4 flex-1'>
          <h1 className='text-primary text-center font-bold'>Power View</h1>
          {/* {user?.webSources?.length > 0 && user?.webSources?.map((source: WebResults) => resultCard(source))} */}
          <p>Pro tip! ADD custom context to your experts by uploading PDFs or audio and ask questions! </p>
        </div>
        <div className='flex flex-col gap-4'>
          <Sidebar open={open} setOpen={handleUploadOpen} />
          <button onClick={()=>handleUploadOpen(true)} className='py-4 px-6 bg-dark rounded-lg text-white hover:bg-dark/80'>Custom context</button>
          {user.activeGroup?.npcId?.npcId !== experaiId ? <button onClick={handleShare} className='py-4 px-6 bg-white border border-gray-300 shadow-md rounded-lg text-black hover:bg-black/5'>Share</button>
            : <button onClick={handleNewExpert} className='py-4 px-6 bg-primary border border-gray-300 shadow-md rounded-lg text-white hover:bg-primary/80'>New Expert</button>}
        </div>      
      </div>
    </div>
  )
}