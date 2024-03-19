"use client";

import { selectUser, setUserData } from "@/redux/features/UserSlice"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react";
import Sidebar from "./Sidebar";
import { baseurl, experaiId } from "@/utils/app";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import { useRouter } from "next/navigation";
import HomeSelect from "./Sidebar/HomeSelect";
import SidebarContext from "./Sidebar/SidebarContent";
import SidebarMobile from "./Sidebar";


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
      <SidebarMobile open={open} setOpen={handleUploadOpen} />
    </div>
  )
}