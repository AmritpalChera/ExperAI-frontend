"use client";
import SelectMenu from "@/atoms/SelectMenu";
import { selectUser } from "@/redux/features/UserSlice";
import backend, { backendFile } from "@/utils/app/axios";
import supabase from "@/utils/setup/supabase";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import FileModal from "./Upload/FileModal";
import { DocumentTextIcon, FolderIcon } from "@heroicons/react/20/solid";
import PreviewModal from "./Preview/PreviewModal";
import FolderCreate from "./Folder/Create";

export type SupabaseFile = {
  id: string,
  fileName: string,
  date: string
}

export type SupabaseFolder = {
  id: string,
  created_at: string,
  name: string
}

export default function Documents() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [files, setFiles] = useState<Array<SupabaseFile>>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewFileId, setPreviewFileId] = useState<string>("");

  // folder interface
  const [createFolderActive, setCreateFolderActive] = useState<Boolean>(false);
  const [folders, setFolders] = useState<Array<SupabaseFolder>>([]);


  const getUploadedFiles = async () => {
    const files = await supabase.from('Documents').select().is('folderId', null).order('date', {ascending: false});
    const folders = await supabase.from('DocumentFolders').select().order('created_at', {ascending: false});

    // console.log('files from supabase: ', files.data || []);
    if (files.data) {
      setFiles(files.data);
    }

    if (folders.data) setFolders(folders.data);
  }

  useEffect(() => {
    getUploadedFiles();
  }, []);

  const getFile = async (fileId: string) => {
    const file = await backend.post('/documents/download', {fileName: `${fileId}.pdf` }).then(res => res.data);
    const fileBuffer = Buffer.from(file.data[0]);
    const parsedFileBlob = new Blob([fileBuffer], {type: 'pdf'});
    const parsedFile = new File([parsedFileBlob], fileId);
    console.log('file is: ', parsedFile);
    setPreviewFile(parsedFile);
    setPreviewFileId(fileId);
    setPreviewModalOpen(true);
  }

  return (
    <main className="lg:pl-72">
      <div className="flex flex-col items-center pt-24">
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Documents</h1>
        <div id="menuBar" className="flex justify-between flex-wrap w-full px-4 md:px-12 mt-8">
          <div className="flex gap-4 items-center mb-4">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="rounded-md bg-primary flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusCircleIcon className="h-6 w-6"/> Add File
            </button>
            <button
              onClick={ () => setCreateFolderActive(prev => !prev)}
              className="rounded-md bg-white flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-black border border-slate-500 shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusCircleIcon className="h-6 w-6"/> Create Folder
            </button>
          </div>
          
          <SelectMenu />
        </div>
       
        <div className="flex gap-4 items-center flex-col w-full mt-8 px-4 pb-12">
          <FolderCreate active={createFolderActive} setActive={setCreateFolderActive} folders={folders} setFolders={setFolders} />

          {
            // Display folders
            folders.map((folder) => {
              return(
                <div className="w-full max-w-4xl">
                  <div className="w-full border rounded-xl md:px-8 px-4 py-4 cursor-pointer  h-24 flex justify-between hover:shadow hover:shadow-blue-100">
                    <div className='flex gap-4 items-center'>
                      <FolderIcon className='h-12 w-12 text-blue-400' />
                      <p className="">{folder.name}</p>
                    </div>
                    <div className="flex items-center">
                        <p className='text-gray-500'>0 files</p>
                    </div>
                  </div>
                </div>
              )
            })
          }
          {
            // Display files
            files.map((file) => {
              return (
                <div className="w-full max-w-4xl">
                  <div className="w-full border rounded-xl md:px-8 px-4 py-4 cursor-pointer  h-24 flex justify-between hover:shadow hover:shadow-blue-100">
                    <div className="">
                      <p className="font-bold text-gray-800 flex gap-2">
                        <DocumentTextIcon  className="h-6 w-6 text-gray-500"/>
                        {file.fileName}
                        </p>
                      <p className="text-gray-500 mt-2">{new Date(file.date).toDateString()}</p>
                    </div>
                    <div className="flex gap-4">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        getFile(file.id)}
                      }
                      className="rounded-md bg-primary flex items-center gap-2 h-12 px-6 py-0 text-sm font-semibold text-white border border-slate-500 shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {/* <PlusCircleIcon className="h-6 w-6"/> Preview */}
                      <p>Preview</p>
                    </button>
                    <PreviewModal open={previewModalOpen} setOpen={setPreviewModalOpen} file={previewFile} fileId={previewFileId} files={files} setFiles={setFiles} />
                    {/* <button
                      onClick={() => setUploadModalOpen(true)}
                      className="rounded-md bg-primary flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <p>Open</p>
                    </button> */}

                    </div>
                  </div>
                    
                </div>
              )
            })
          }
         
          
        </div>
        <FileModal open={uploadModalOpen} setOpen={setUploadModalOpen} files={files} setFiles={setFiles} />
      </div>
    </main>
  )
}