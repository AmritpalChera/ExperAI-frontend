import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, DocumentArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline'
import DocumentPreview from './Preview';
import { ArrowsPointingOutIcon } from '@heroicons/react/20/solid';
import backend from '@/utils/app/axios';
import { SupabaseFile } from '..';

interface PreviewModalProps {
    file: File | null,
    open: boolean,
    setOpen: any,
    fileId: string,
    files: Array<SupabaseFile>,
    setFiles: any,
    folderId: string
}

export default function PreviewModal({file, open, setOpen, fileId, files, setFiles, folderId}: PreviewModalProps) {

    const deleteFile = async () => {
        const deleted = await backend.post('/documents/delete', {fileName: `${fileId}.pdf`, fileId, folderId });
        console.log(deleted);
        // filter through the existing files locally
        const filtered = files.filter(file => file.id !== fileId);
        setFiles([...filtered]);
    }
    
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-transparent px-4 pb-4 pt-5 text-left transition-all sm:p-6">
                <div className='w-full flex justify-end gap-2 px-4 mb-1'>
                    <div className={` flex h-12 w-12 items-center justify-center rounded-full bg-black hover:shadow hover:shadow-white cursor-pointer`}>
                        <ArrowsPointingOutIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div onClick={deleteFile} className={` flex h-12 w-12 items-center justify-center rounded-full bg-black hover:shadow hover:shadow-white cursor-pointer`}>
                        <TrashIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                </div>
                {file && <DocumentPreview file={file} />}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
