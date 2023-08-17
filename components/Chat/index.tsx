"use client";
import { toast } from 'react-toastify';
import Sidenav from '../Sidenav';
import MessageWindow from './MessageWindow';
import backend from '@/utils/app/axios';
import { useState } from 'react';


export default function Chat() {
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
            <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 flex justify-center h-screen">
              <MessageWindow />
            </div>
          </div>
        </main>

        <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
          <div className='flex flex-col h-full gap-4 text-gray-500'>
            <div className='flex flex-col gap-4 flex-1'>
              <h1 className='text-primary text-center font-bold'>Meet Mr.Brown</h1>
              <img src='https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1752&q=80'/>
              <h2 className='text-center'>Superman of Harold M. Brathwaite Public School</h2>
              <p>Mr.Brown has helped countless students overcome their fears in math. He helped them excel at different algebra topics and calculus through his innovative methods. He's an inspiration to the young generation.</p>
            </div>
            <div className='flex flex-col gap-4'>
              <button className='py-4 px-6 bg-dark rounded-lg text-white hover:bg-dark/80'>Add to Collection</button>
              <button className='py-4 px-6 bg-white border border-3 shadow-md rounded-lg text-black hover:bg-black/5'>Share</button>
            </div>
            
          </div>
        </aside>
      </div>
    </>
  )
}
