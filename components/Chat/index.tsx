"use client";
import Sidenav from '../Sidenav';
import MessageWindow from './MessageWindow';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/features/UserSlice';
import PowerView from './PowerView';


export default function Chat() {
  const user = useSelector(selectUser);

  

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        <Sidenav />

        <main className="lg:pl-72">
          <div className="xl:pr-96">
            <div className="px-4  sm:px-6 lg:px-8 flex justify-center">
              <MessageWindow />
            </div>
          </div>
        </main>

        <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
          <PowerView />
        </aside>
      </div>
    </>
  )
}
