import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  StarIcon,
} from '@heroicons/react/24/outline'

interface MessageContextMenuDescription {
  score: number;
  description?: string;
  filename: string;
  leftAlign?: boolean
}

export default function MessageContextMenu({ score, description, filename, leftAlign }: MessageContextMenuDescription) {

  const solutions = [
    { name: `${Math.round(score*100)}% confidence score`, filename: `From ${filename}`, href: '#', icon: StarIcon, description: description },
  ];

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
        <span className='text-xl'>🌿</span>
        {/* <ChevronDownIcon className="h-5 w-5" aria-hidden="true" /> */}
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className={`absolute ${leftAlign? 'left-0' : 'right-8' } -top-32   z-10 mt-2 flex`}>
          <div className="w-[330px] max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            <div className="p-4">
              {solutions.map((item) => (
                <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 ">
                  {/* <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 ">
                    <item.icon className="h-6 w-6 text-gray-600 " aria-hidden="true" />
                  </div> */}
                  <div>
                    <div className="font-semibold text-primary">
                      {item.name}
                      <span className="absolute inset-0" />
                    </div>
                    <p className="mt-1 text-gray-600">{item.filename}</p>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
