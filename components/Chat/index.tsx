"use client";

import Link from "next/link";
import Header from "../Header";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import backend from "@/utils/app/axios";
import { ToastContainer, toast } from "react-toastify";

export default function Chat() {

  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [urlHash, setUrlHash] = useState('');
  const [coverage, setCoverage] = useState('-');
  const [input, setInput] = useState('');

  const respond = async () => {
    if (!input) return toast.error('Please enter input');
    setLoading(true)
    const data = await backend.post('/respond', { urlHash, search: input }).then(res => res.data).catch(err => {
      console.log('err', err);
      toast.error('Something went wrong');
    });
    if (data) {
      setResponse(data.answer);
      setCoverage(`${Math.round(data.confidence*100)}%`)
    }
    setLoading(false);
  }

  const loadUrl = async () => {

    const data = await backend.post('/load', { url }).then(res => res.data).catch(err => {
      console.log('err: ', err);
      toast.error('Could not load webpage');
    });
    setLoading(false);
    if (data) {
      setUrlHash(data.urlHash)
    }
  }

  useEffect(() => {
    if (!url) router.push('/');
    loadUrl();
  }, [])

  console.log('url: ', url);

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      respond();
    }
  }

  return (
    <div>
      <ToastContainer />
      <Header />
      <div className="flex flex-col items-center  mt-24">
        <div className="border border-gray-500 flex flex-col rounded-lg max-w-3xl md:p-12 p-4 w-full h-96 shadow-inner shadow-indigo-200">
          {loading && <div className="text-3xl text-primary">Reading url<span className="animate-ping">...</span></div>}
          {!response && !loading && <div className="text-center flex-1">
            <h2 className="text-3xl mt-6 text-center">How can I help?</h2>
            <div className="mt-8 text-gray-500 font-bold">
              Built with Mindplug
            </div>
          </div>}
          {
            response && (
              <div className="h-full flex-1 flex flex-col">
                <div className="text-start flex-1 h-full overflow-y-scroll whitespace-pre-wrap">
                  {response}
                </div>
                <div className="flex flex-wrap md:gap-4 whitespace-nowrap">
                  <p className="mt-2 text-gray-500 w-72 overflow-clip text-ellipsis"><span className="font-medium">From:</span> {url}</p>
                  <p className="mt-2 text-gray-500"><span className="font-medium">Confidence:</span> {coverage}</p>
                </div>
              </div>
            )
          }
          
          
        </div>
        
        
        <div className="flex flex-col w-full">
          <div className=' w-full flex justify-center mx-2 mt-12'>
            <input onKeyDown={handleKeyDown} value={input} onChange={(e) => setInput(e.target.value)} autoFocus className='bg-white text-black cursor-text mx-2 rounded-3xl py-3 px-4 max-w-4xl w-full border-2 shadow-lg shadow-gray' placeholder="What's your question?..."></input>
          </div>
        </div>
        <div>
          <button onClick={respond} disabled={loading} className="rounded-md text-center bg-primary py-4 w-48 px-8 text-base font-semibold mt-12 duration-300 ease-in-out hover:bg-primary/80 text-white">Ask</button>

          <div className="mt-8 flex gap-4 justify-center underline">
            <Link href={'/'} className="text-gray-500 text-lg text-center">Create New</Link>
          </div>
        </div>

      </div>
    </div>
  )
}