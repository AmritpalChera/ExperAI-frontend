import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import FileUpload from './Upload'
import FolderSelect from './FolderSelect'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { selectUser } from '@/redux/features/UserSlice'
import backend, { backendFile } from '@/utils/app/axios'
import { SupabaseFile } from '..'

interface FileModalProps {
  open: boolean,
  setOpen: any,
  files: Array<SupabaseFile>,
  setFiles: any,
  folderId: string | null
}
export default function FileModal({open, setOpen, files, setFiles, folderId}: FileModalProps) {
  const [folder, setFolder] = useState({id: 1, name: 'testFolder'});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const [error, setError] = useState('');

  const cancelButtonRef = useRef(null);

  const handleSubmit = async (e: any) => {
    if (loading || !file) return;
    setLoading(true);
    e.preventDefault();
    // const isMetaJson = stringToJSON(formProps.metadata);
    if (file.size > 20000000) toast.error('File limit is 20MB');
    else {
      
      try {
        // await backend.post('/data/store/file', data);
        const form = new FormData();
        form.append('file', file);
        form.append('type', 'pdf');
        form.append('name', file.name);
        form.append('folderId', folderId || "");
        form.append('userId', user.id);
        // const fileParsed = await backend.post('https://experai.ue.r.appspot.com/parse/pdf', form).then((res) => res.data);
        // console.log('parsed file is: ', fileParsed);
        const uploadedData = await backendFile.post('/documents/upload', form).then((res) => res.data).catch((err) => err.response.data);


        // now add the data to the list
        if (uploadedData.data) {
          setFiles([uploadedData.data, ...files]);
        }

        console.log('uploaded Data: ', uploadedData);

        toast('Complete!');




        setOpen(false);


        // if (uploadedData) router.push(`/dashboard?project=${formProps.project}&collection=${formProps.collection}`)
        // e.target.reset();
      } catch (e: any) {
        console.log(e)
        if (typeof (e?.response?.data?.error) === 'string') setError(e?.response?.data?.error);
        toast.error('Process failed. Try again')
      }
      
    }
    setLoading(false);
    
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    {/* <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    </Dialog.Title> */}
                    
                    <div className="mt-2">
                      <FileUpload file={file} setFile={setFile} />
                    </div>
                  </div>
                </div>
                {/* <div className='flex items-center justify-between mt-8'>
                    <p>Select folder:</p>
                    <FolderSelect folder={folder} setFolder={setFolder} />
                </div> */}
                <div className="mt-12 sm:mt-12 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={handleSubmit}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
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
