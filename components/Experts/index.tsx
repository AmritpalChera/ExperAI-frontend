"use client";
import { useDispatch, useSelector } from "react-redux";
import Sidenav from "../Sidenav";
import { selectUser, setUserData } from "@/redux/features/UserSlice";
import { useRouter } from "next/navigation";
import NewExpert from "./NewExpert";
import { useEffect, useState } from "react";
import backend from "@/utils/app/axios";
import Menu from "./Menu";
import GroupCard from "./GroupCard";
import UpgradeModal from "../Chat/UpgradeModal";
import SigninModal from "../SigninModal";
import { ToastContainer } from "react-toastify";
import Image from "next/image";
import { experaiId } from "@/utils/app";
import { ThreeDots } from "react-loader-spinner";

export default function Experts() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();

  const setOpen = (isOpen: boolean) => {
    dispatch(setUserData({ newExpertModal: { open: isOpen } }));
  }

  const setActiveGroup = (group: any) => {
    dispatch(setUserData({ activeGroup: group }));
    router.push('/chat');
  }

  const reloadGroups = async () => {
    const groupsData = await backend.post('/user/listGroups', { userId: user.id });
    let groups = groupsData?.data?.data;
    dispatch(setUserData({ groups }));
  }

  useEffect(() => {
    if (user.id) reloadGroups();
    else dispatch(setUserData({ signinOpen: true }));
  }, []);

  
  const groupCardNew = () => {
    const flashing = user.groups?.length === 0 || (user.groups?.length === 1 && user.groups[0].groupId?.npcId?.npcId === experaiId);
    return (
      <div onClick={() => setOpen(true)} className="shadow relative w-full justify-center h-20 items-center flex gap-4 border p-4 text-white bg-dark hover:bg-dark/90 rounded-lg hover:shadow-lg cursor-pointer">
        <div>
          <h1 className="text-xl">Create New Expert</h1>
        </div>
        {flashing && <div className="absolute w-24 right-0 top-4">
          <Image
            src="/cursors.png"
            alt="index-image"
            height={150}
            width={150}
            className="mx-auto max-w-full lg:mr-0 animate-pulse"
          />
        </div>}
      </div>
    )
  }

  return (
    <>
      <div>
        <Sidenav />
        <main className="lg:pl-72">
          <div className="xl:pr-96">
            <div className="px-4 py-12  sm:px-6 lg:px-8 flex flex-col justify-center items-center">
              <h1 className="text-4xl font-bold text-primary">My Experts</h1>
              <div className="flex flex-wrap justify-center flex-col w-full gap-4 mt-24 max-w-3xl">
                {groupCardNew()}
                {user.groups && <div className="text-gray-700">{user.groups.length} Experts</div>}
                {
                  user.groups?.map((groupData: any, index: number) => <GroupCard key={groupData.groupId.groupId} group={groupData.groupId} index={index} setActiveGroup={setActiveGroup} />)
                }
                {user.email && !user.groups && <ThreeDots width="40px" height="24px" color="black"/>}
              </div>
            </div>
          </div>
        </main>
        <NewExpert setOpen={setOpen} />
        <UpgradeModal />
        <SigninModal />
        <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
          <h1 className="font-bold text-primary text-center mb-8">Announcements</h1>
            New improvements soon
          <br /><br />
          <p className="hidden">If the experiment is successful, you will soon see experts which are monetized and allows our users to generate income.</p>
         
        </aside>
      </div>
    </>
  )
}