import { selectUser, setUserData } from '@/redux/features/UserSlice';
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, CalendarIcon, DocumentTextIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const items = [
  {
    name: 'Upload PDF',
    description: 'Give chatbot PDF contents',
    id: 'pdf',
    iconColor: 'bg-purple-500',
    icon: DocumentTextIcon,
  },
  {
    name: 'Upload Audio',
    description: 'Any MP3 or WAV',
    id: 'audio',
    iconColor: 'bg-green-500',
    icon: SpeakerWaveIcon
  }
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}


export default function HomeSelect({ setUploadType }: any) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const handlePreselect = (itemId: string) => {
    if (!user.id) dispatch(setUserData({ signinOpen: true }));
    else setUploadType(itemId)
  };

  return (
    <div>
      <h1 className="text-gray-500 border-b">Add Custom Data</h1>
      <ul role="list" className="mt-6 border-gray-200">
        {items.map((item, itemIdx) => (
          <li key={itemIdx}>
            <div className="group relative flex items-start space-x-3 py-4">
              <div className="flex-shrink-0">
                <span
                  className={classNames(item.iconColor, 'inline-flex h-10 w-10 items-center justify-center rounded-lg')}
                >
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">
                  <div onClick={() => handlePreselect(item.id)}>
                    <span className="absolute inset-0 cursor-pointer" aria-hidden="true" />
                    {item.name}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <div className="flex-shrink-0 self-center">
                <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 justify-end flex">
        <Link href="/api" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Build your own
          <span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
      <h1 className="text-gray-500 border-b mt-12">Previously Uploaded</h1>
    </div>
  )
}