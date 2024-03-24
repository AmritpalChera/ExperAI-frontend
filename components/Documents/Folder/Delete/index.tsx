import { TrashIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import DeleteModal from './DeleteModal'
import { SupabaseFolder } from '../..'

interface DelteFolderProps {
    currFolder: string,
    folders: Array<SupabaseFolder>,
    setFolders: any
}
const DeleteFolder = ({currFolder, folders, setFolders}: DelteFolderProps) => {

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <button
        onClick={ (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDeleteModalOpen(true);
        }}
        className="rounded-md bg-white flex h-12 items-center gap-2 px-6 py-2.5 text-sm font-semibold text-red border border-red shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
        <TrashIcon className="h-6 w-6"/>
        <DeleteModal currFolderId={currFolder} open={deleteModalOpen} setOpen={setDeleteModalOpen} folders={folders} setFolders={setFolders} />
    </button>
  )
}

export default DeleteFolder