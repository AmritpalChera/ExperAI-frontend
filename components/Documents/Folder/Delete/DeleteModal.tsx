import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import supabase from '@/utils/setup/supabase';
import backend from '@/utils/app/axios';
import { SupabaseFolder } from '../..';


interface DeleteModalProps {
    currFolderId: string,
    open: boolean,
    setOpen: any,
    folders: Array<SupabaseFolder>,
    setFolders: any
}

export default function DeleteModal({currFolderId, open, setOpen, folders, setFolders}: DeleteModalProps) {

  const cancelButtonRef = useRef(null);

  // deleting is a recursive process
  const deleteFolders = async () => {
    const subFolders: Array<string> = [];
    const buffer: Array<string> = [];
    let baseFolders = await supabase.from('DocumentFolders').select('id').eq('parentFolder', currFolderId).then(res => res.data);
    baseFolders?.forEach((folder) => buffer.push(folder.id));
    // for each base Folder get the folders under it
    // console.log('base folders: ', baseFolders);

    while (buffer.length > 0) {
        // follow LIFO as subfolders still refrence the parent folders
        const tempBuffer = buffer.reverse();
        
        for (let a = 0; a < tempBuffer.length; a++) {
            const childFolders = await supabase.from('DocumentFolders').select('id').eq('parentFolder', tempBuffer[a]).then(res => res.data);
            // push the buffer into the subfolder
            subFolders.push(buffer.pop()!);
            childFolders?.forEach(folder => buffer.unshift(folder.id));
        }
    }

    // for each subfolder, delete the files and then delete the subfolder
    await Promise.all(subFolders.map(async (folderId) => {
        // get and delete all files from supabase
        const files = await supabase.from('Documents').delete().eq('folderId', folderId).select('id').then(res => res.data);
        if (files && files.length && files?.length > 0) {
            // if files exist
            await Promise.all(files.map(async (file) => {
                // delete all files from GCP
                return backend.post('/documents/delete', {fileName: `${file.id}.pdf`, fileId: file.id}).then(res => res.data);
            }));
        }
        await supabase.from('DocumentFolders').delete().eq('id', folderId).then(res => res.data);
    }));

    // delete the curr folder
    let baseFiles = await supabase.from('Documents').delete().eq('folderId', currFolderId).select('id').then(res => res.data);
    // delete the base files from current folder
    if (baseFiles && baseFiles.length && baseFiles?.length > 0) {
        // if baseFiles exist
        await Promise.all(baseFiles.map(async (file) => {
            // delete all files from GCP
            return backend.post('/documents/delete', {fileName: `${file.id}.pdf`, fileId: file.id}).then(res => res.data);
        }));
    }
    // delete current folder
    await supabase.from('DocumentFolders').delete().eq('id', currFolderId).then(res => res.data);

    let newFolders = folders.filter(folder => folder.id !== currFolderId);
    setFolders([...newFolders]);
    setOpen(false);

  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Delete Folder
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this folder? All of your data will be permanently
                          removed. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => deleteFolders()}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
