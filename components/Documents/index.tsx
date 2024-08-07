"use client";
import SelectMenu from "@/atoms/SelectMenu";
import { selectUser, setUserData } from "@/redux/features/UserSlice";
import backend, { backendFile } from "@/utils/app/axios";
import supabase from "@/utils/setup/supabase";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FileModal from "./Upload/FileModal";
import { ArrowRightIcon, DocumentTextIcon, FolderIcon, FolderOpenIcon } from "@heroicons/react/20/solid";
import PreviewModal from "./Preview/PreviewModal";
import FolderCreate from "./Folder/Create";
import Link from "next/link";
import DeleteFolder from "./Folder/Delete";
import GroupCard from "../Experts/GroupCard";

export type SupabaseFile = {
  id: string,
  fileName: string,
  date: string,
  folderId: string
}

export type SupabaseFolder = {
  id: string,
  created_at: string,
  name: string,
  parentFolder: any
}

type LinkedBudsType = {
  groupId: string,
  lastMessage: string,
  lastUpdated: string,
  npcId: any
}

interface DocumentsProps {
  slug: string,
  name: string | undefined | string[]
}

export default function Documents({slug, name}: DocumentsProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [files, setFiles] = useState<Array<SupabaseFile>>([]);

  const [linkedBuds, setLinkedBuds] = useState<Array<LinkedBudsType>>([]);
  const [newLinkOpen, setNewLinkOpen] = useState(true);

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewFileId, setPreviewFileId] = useState<string>("");

  // folder interface
  const [createFolderActive, setCreateFolderActive] = useState<Boolean>(false);
  const [folders, setFolders] = useState<Array<SupabaseFolder>>([]);
  const [parent, setParent] = useState<SupabaseFolder | null>(null);
  


  const dispatch = useDispatch();
  const router = useRouter();


  const setActiveGroup = (group: any) => {
    dispatch(setUserData({ activeGroup: group }));
    router.push('/chat');
  }

  const getUploadedFiles = async () => {
    const folderId = slug || "";
    // console.log('folderId: ', folderId)

    const getParent = folderId && await supabase.from('DocumentFolders').select('parentFolder (id, name, created_at, parentFolder)').eq('id', folderId).single().then(res => res.data?.parentFolder);

    if (getParent) setParent(getParent as any);

    const files = folderId ? await supabase.from('Documents').select().eq('folderId', folderId).order('date', {ascending: false}) : (
      await supabase.from('Documents').select().is('folderId', null).order('date', {ascending: false}) 
    );
    const folders = folderId ? await supabase.from('DocumentFolders').select('id, created_at, name, parentFolder (id, name)').eq('parentFolder', folderId).order('created_at', {ascending: false}) : (
      await supabase.from('DocumentFolders').select().is('parentFolder', null).order('created_at', {ascending: false})
    );

    if (folderId) {
      const budsRaw = await supabase.from("FolderBudLinks").select('groupId (groupId, npcId (name, imageUrl, tags, npcId), lastMessage, lastUpdated, imageUrl, name, creatorId)').eq('folderId', folderId);
      if (budsRaw?.data) {
        const buds = budsRaw.data.map((buds) => buds.groupId);
        setLinkedBuds(buds as any);
      }
    }
    // console.log('folders are: ', folders);
    // console.log('parent is: ', getParent)

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
    // const url = await backend.post('/documents/downloadSignedUrl', {fileName: `${fileId}.pdf`}).then(res => res.data);
    // console.log('url is: ', url);
    // const getfile = await backend.get(url.data).then(res => res.data);
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
        <div className="w-full px-4 md:px-12 mt-8 flex gap-4 items-center"> 
          <FolderOpenIcon className="h-6 w-6 text-primary" />
          {
            !parent && slug && <Link href={`/documents`} className="underline text-primary">
            <p>Home</p>
          </Link>
          }
          {parent && <Link href={`/documents${parent && `/folder/${parent.id}?name=${parent.name}`}`} className="underline text-primary">
            <p>{parent?.name}</p>
          </Link>
          }
          {slug && <ArrowRightIcon className="h-4 w-4"/>}
            {name || "/"}
         </div>
        <div id="menuBar" className="flex justify-between flex-wrap w-full px-4 md:px-12 mt-8">
          <div className="flex gap-4 items-center mb-4">
            {slug && <button
              onClick={() => setUploadModalOpen(true)}
              className="rounded-md bg-primary flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusCircleIcon className="h-6 w-6"/> Add File
            </button>}
            <button
              onClick={ () => setCreateFolderActive(prev => !prev)}
              className="rounded-md bg-white flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-black border border-slate-500 shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusCircleIcon className="h-6 w-6"/> Create Folder
            </button>
            
          </div>
          {/* <div className="flex gap-4 items-center">
            <SelectMenu />
          </div> */}
          
        </div>
       
        
        <div className="flex gap-4 items-center flex-col w-full mt-8 px-4 pb-12">
          {folders?.length> 0 && <div className="max-w-4xl text-end ml-2 w-full mt-8">
            <div className=" text-blue-500">Sub-folders do not link to experts</div>
          </div>}
          <FolderCreate parentFolder={slug} active={createFolderActive} setActive={setCreateFolderActive} folders={folders} setFolders={setFolders} />
          
          {
            // Display folders
            folders.map((folder) => {
              return(
                <div key={folder.id} className="w-full max-w-4xl">
                  <Link href={`/documents/folder/${folder.id}?name=${folder.name}`}>
                    <div className="w-full border border-gray-300 bg-gray-100 rounded-xl md:px-8 px-4 py-4 cursor-pointer  h-24 flex justify-between hover:shadow hover:shadow-blue-100">
                      <div className='flex gap-4 items-center'>
                        <FolderIcon className='h-12 w-12 text-primary' />
                        <p className="text-neutral-700 font-medium">{folder.name}</p>
                      </div>
                      <div className="flex items-center">
                        <DeleteFolder currFolder={folder.id} folders={folders} setFolders={setFolders} />
                      </div>
                    </div>
                  
                  </Link>
                </div>
              )
            })
          }

          {files?.length> 0 && linkedBuds.length > 0 && <div className="max-w-4xl ml-2 w-full mt-8">
            <div className="flex border-b-2 border-blue-300 justify-between mb-3">
              <div className=" text-blue-500">Linked Buddies</div>
              {/* <div className="flex justify-end gap-2">
                <div className="flex items-center rounded-lg bg-primary px-4 m-1 text-white">
                  <PlusCircleIcon className="h-4 w-4  mr-2"/>Edit
                </div>
                <div className="flex items-center rounded-lg px-4 m-1 border border-gray-500">
                  <PlusCircleIcon className="h-4 w-4  mr-2"/>Share
                </div>
              </div> */}
            </div>
            
            <div className="flex flex-col gap-2 justify-center w-full">
              {
                linkedBuds.map((group, i) => (
                  <GroupCard key={group.groupId} group={group} setActiveGroup={setActiveGroup} index={i} />
                ))
              }
            </div>
            
            
          </div>
          }

          {
            linkedBuds.length == 0 && files?.length> 0 && <div className="flex gap-2">
              No linked buddies. 
              <div className="underline text-blue-500 cursor-pointer"> Link new</div>
            </div>
          }



          {files?.length> 0 && <div className="max-w-4xl ml-2 w-full mt-16 border-b-2 border-blue-300">
            <div className=" text-blue-500">Files</div>
          </div>}
          {
            // Display files
            files.map((file) => {
              return (
                <div key={file.id} className="w-full max-w-4xl">
                  <div className="w-full border rounded-xl px-4 py-4 cursor-pointer flex justify-between hover:shadow hover:shadow-blue-100">
                    <div className="flex gap-4">
                      <div>
                        <DocumentTextIcon  className="h-12 w-12 text-red"/>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 flex gap-2">{file.fileName}</p>
                        <p className="text-gray-500 mt-1 text-sm">{new Date(file.date).toDateString()}</p>
                      </div>
                        
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
                    <PreviewModal folderId={file.folderId} open={previewModalOpen} setOpen={setPreviewModalOpen} file={previewFile} fileId={previewFileId} files={files} setFiles={setFiles} />
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
         {
          !files?.length && !folders?.length && (
            <div className="text-2xl text-center font-bold font-mono">
              <p className="text-primary">Nothing here</p>
              <p className="font-thin text-lg mt-4">
                {parent || slug ? 'Add PDF files' : 'Create your first folder'}
              </p>
            </div>
          )
         }
          
        </div>
        <FileModal folderId={slug} open={uploadModalOpen} setOpen={setUploadModalOpen} files={files} setFiles={setFiles} />
      </div>
    </main>
  )
}