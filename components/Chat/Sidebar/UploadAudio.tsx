"use client";

import { selectUser } from "@/redux/features/UserSlice";
import backend from "@/utils/app/axios";
import initializeOpenai from "@/utils/setup/openai";
import { ArrowLeftOnRectangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function UploadAudio({ setUploadType }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const [project, setProject] = useState(params.get('project') || '');
  const [collection, setCollection] = useState(params.get('collection') || '');
  const router = useRouter();
  const user = useSelector(selectUser);
  const [openai] = useState(initializeOpenai());

  const onChangeHandler = async (event: any) => {
    const file: File = event.target.files[0];
    console.log('file uploaded is: ', file)
    setFile(file);
  };
  
  const handleSubmit = async (e: any) => {
    if (loading) return;
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps: any = Object.fromEntries(formData);
    
    if (!file) return toast.error('File not uploaded');
    if (file.size > 20000000) throw toast.error('File limit is 20MB');
    let content: string = '';

    console.log(file);
    return;

    const response = await openai.createTranscription(file!, 'whisper-1', undefined, 'json', 1, 'en');
    content = response.data?.text;

    if (!content) return toast.error('Could not transcribe audio');

    setLoading(false);
  };

  const getDropboxContents = () => {
    if (file) {
      return (
        <div className="bg-green-500 w-full h-full flex justify-center items-center flex-col">
          <CheckCircleIcon className="h-12 w-12" />
          {file.name}
        </div>
      )
    }
    return (
      <div className="flex flex-col items-center">
        <div>
          <span className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="font-medium text-gray-600">
                Drop files to Attach, or
                <span className="text-blue-600 underline ml-1">browse</span>
            </span>
                  
          </span>
        </div>
        <div className="text-gray-700 dark:text-primary mt-4 text-sm">Limited to 20MB</div>  
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-lg w-full">
        <div className="flex gap-4 items-center pb-8 font-bold justify-between">
          <p className="text-2xl">Audio Upload</p>
          <div onClick={()=>setUploadType('')} className="flex items-center text-primary cursor-pointer underline">
            <ArrowLeftOnRectangleIcon className="h-6 w-6"/>
            Return
          </div>
          
        </div>
        <div className="max-w-xl">
          <div>
            <label
              className="flex flex-col items-center justify-center w-full h-32 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
             {getDropboxContents()}
              <input onChange={onChangeHandler} type="file" accept=".mp3,.wav" name="file_upload" className="hidden" />
              
            </label> 
          </div>  
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center w-full">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md w-full text-center flex justify-center items-center bg-primary py-2 max-w-sm mt-12 px-8 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80 cursor-pointer"
            >
              {loading? <ThreeDots width="40px" height="24px" color="white"/>: 'Submit'}
            </button>
          </div>
        </form>
       {loading && <p className="w-full text-center mt-4 text-primary">Please do not refresh page</p>}
        
      </div>
    </div>
  )
}