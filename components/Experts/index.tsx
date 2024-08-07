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
import Link from "next/link";

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


  return (
    <>
      <div>
        <Sidenav />
        <main className="lg:pl-72">
          <div className="xl:pr-96">
            <div className="px-4 py-12  sm:px-6 lg:px-8 flex flex-col justify-center items-center">
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Experts</h1>
              <div className="flex flex-wrap justify-center flex-col w-full gap-4 mt-24 max-w-3xl">
                {/* {groupCardNew()} */}
                <div className="flex w-full justify-between items-baseline border-b-2 pb-2 border-blue-300">
                  <div className="text-blue-500 text-lg">{user.groups?.length || "..."} Experts</div>
                  <button onClick={() => setOpen(true)} className="bg-primary rounded-lg px-8 py-1 text-white">Create new</button>
                </div>
                
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
          <div className='flex flex-col px-4 gap-4'>
            <Image src="/lilybw.jpg" width={500} height={500} alt="lily image" />
            <h2 className='text-center text-neutral-600 font-medium text-lg'>Introducing Coach Lily</h2>
            <p className='text-neutral-600 text-center'>An AI Life Coach - who grows alongside you on your journey</p>
            <div className='flex justify-center w-full mt-8'>
              <Link href={'https://coachlily.com'} className='bg-black text-center w-full px-12 py-3 text-white rounded-xl'>Start Chat</Link>
            </div>
          </div>

          <br /><br />
          <p className="hidden">If the experiment is successful, you will soon see experts which are monetized and allows our users to generate income.</p>
         
        </aside>
      </div>
    </>
  )
}