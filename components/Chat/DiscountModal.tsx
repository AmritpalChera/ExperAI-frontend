"use client";
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, setUserData } from '@/redux/features/UserSlice'
import Link from 'next/link';
import backend from '@/utils/app/axios';
import { useRouter } from 'next/navigation';
import { CustomerPlans } from '@/utils/app';
import mixpanel from 'mixpanel-browser';

export default function DiscountModal() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const everyThree = user.chatdata?.length % 5 === 0;
    setShowModal(everyThree && user.chatdata?.length > 2 && user.planType === CustomerPlans.LITE)
  }, [user.chatdata]);

  const closeModal = () => {
    setShowModal(false);
  }

  const handleUpgradeClick = async () => {
    mixpanel.track('upgrade modal button clicked')
    await backend.post('/stripe/checkoutSession', {
      priceId: CustomerPlans.BASIC,
      email: user.email,
      userId: user.id
    }).then(res => {
      if (res.data) {
        router.push(res.data)
      }
    });
  }

  return (
    <Transition.Root show={!!showModal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
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
                      20% off SALE
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        User promotion code <span className='text-primary font-bold'>'LaunchSale'</span> to get your discount!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <div
                    onClick={handleUpgradeClick}
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Upgrade
                  </div>
                  <Link
                    href='https://forms.gle/ybvkzsuU19ckrTuw6'
                    target='blank'
                    className="inline-flex mt-2 w-full justify-center rounded-md bg-white border px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Feedback
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
