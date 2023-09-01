"use client";
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import backend from '@/utils/app/axios';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUserData } from '@/redux/features/UserSlice';
import {  toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';

export default function NewExpert({ open, setOpen }: any) {
 
  const [expert, setExpert] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const cancelButtonRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (custom?: string) => {
    if (loading) return toast.error('Please wait');
    const toGenerate = custom || expert;
    if (!toGenerate) return toast.error("Please enter expert details")
    setLoading(true);
    const generatedExpertData = await backend.post('/npc/generateFriend', {
      userId: user.id,
      expertJob: toGenerate
    }).then(res => res.data).catch(err => { });
    const generatedExpert = generatedExpertData?.data;
    if (generatedExpert?.group) {
      dispatch(setUserData({ activeGroup: generatedExpert.group }));
      router.push('/chat');
    }
    setLoading(false);    
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

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

        <div className="fixed inset-0 z-10 overflow-y-auto">
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
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <img
                        className="h-12 w-auto"
                        src="https://i.ibb.co/QCFwcj6/logo.png"
                        alt="ExperAI"
                      />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Generate new expert
                    </Dialog.Title>
                    <div className="mt-4">
                      <div className=' w-full flex justify-center '>
                        <input  onKeyDown={handleKeyDown} value={expert} onChange={(e) => setExpert(e.target.value)} autoFocus className='bg-white text-black cursor-text rounded-xl py-2 px-2 max-w-4xl w-full border-2 shadow-lg shadow-gray' placeholder={`enter expert profession`}></input>
                      </div>
                    </div>
                    <div className='flex gap-4 mt-4 flex-wrap justify-center'>
                      <button onClick={()=>handleSubmit('world geography expert')} className='border px-4 py-1 rounded-lg bg-gray-100 flex items-center gap-2 text-gray-700'><MagnifyingGlassIcon className='h-4 w-4' />World geograohy expert</button>
                      <button onClick={()=>handleSubmit('Laozi the teacher of Tao')} className='border px-4 py-1 rounded-lg bg-gray-100 flex items-center gap-2 text-gray-700'> <MagnifyingGlassIcon className='h-4 w-4' />Teacher of Taoism</button>
                      <button onClick={()=>handleSubmit('Australian girl good at human biology')} className='border px-4 py-1 rounded-lg bg-gray-100 flex items-center gap-2 text-gray-700'> <MagnifyingGlassIcon className='h-4 w-4' />Australian girl good at human biology</button>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={() => handleSubmit()}
                  >
                    {loading ? (
                      <ThreeDots 
                        height="30" 
                        width="30" 
                        radius="9"
                        color="white" 
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        visible={true}
                      />
                    ) : 'Generate'}
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    className="mt-3 inline-flex items-center w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
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
