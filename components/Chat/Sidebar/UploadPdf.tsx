import { selectUser } from "@/redux/features/UserSlice";
import mindplug from "@/utils/setup/mindplug";
import supabase from "@/utils/setup/supabase";
import { ArrowLeftOnRectangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { createHash } from "crypto";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function UploadPdf({ setUploadType, limitHandler }: any) {
  const user = useSelector(selectUser);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (loading) return;
    if (!file) return toast.error('Please upload file');
   
    try {
      await limitHandler();
    } catch (e: any) {
      return;
    }

    setLoading(true);
    try {
      // await backend.post('/data/store/file', data);\
      const creatorId = user.activeGroup?.creatorId;
      if (creatorId !== user.id) throw toast.error('Not allowed for 3rd party groups');
      const urlHash = createHash('sha256').update(`${user.id}-${user.npcDetails.npcId}`).digest('hex');
      const data = await mindplug.storePDF({ file: file, db: 'experAi-contexts', collection: urlHash });
      const uploadId = data?.data?.uploadId;
      if (!uploadId) throw "Could not store file contents";
      await supabase.from('exp-contexts').upsert({ npcId: user.npcDetails.npcId, userId: user.id, uploadId: uploadId, name: file.name, type: file.type })

      toast('Complete!');
      setUploadType(false);
      
      e.target.reset();
    } catch (e: any) {
      console.log(e)
      if (typeof (e?.response?.data?.error) === 'string') setError(e?.response?.data?.error);
      toast.error('Process failed. Try again')
    }
    setLoading(false);
  }



  const onChangeHandler = async (event: any) => {
    const file: File = event.target.files[0];
    setFile(file);
  };
  const getDropboxContents = () => {
    if (file) {
      return (
        <div className="bg-green-500 w-full h-full flex justify-center items-center flex-col px-4">
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
          <p className="text-2xl">PDF Upload</p>
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
              <input onChange={onChangeHandler} type="file" accept=".pdf" name="file_upload" className="hidden" />
              
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