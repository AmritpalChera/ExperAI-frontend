import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import {
  ArrowPathIcon,
  BoltIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  LinkIcon,
  SquaresPlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

const solutions = [
  { name: 'Copy Link', description: 'Share a link to friends and family', href: '#', icon: LinkIcon },
  { name: 'Tweet', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Delete', description: "Your customers' data will be safe and secure", href: '#', icon: TrashIcon },

  // { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

export default function Menu({handleOptionClick}: any) {
  const solutions = [
    { name: 'New Session', description: 'Start new chat with this expert', href: '#', icon: SquaresPlusIcon, id: 'newSession' },
    { name: 'Refer Expert', description: 'Share a link to friends and family', href: '#', icon: LinkIcon, id: "copyLink" },
    { name: 'Copy Prompt', description: 'Copy expert details for custom generation', href: '#', icon: BoltIcon, id: "copyPrompt" },
    { name: 'Tweet', description: 'Share your experience online', href: '#', icon: CursorArrowRaysIcon, id: 'tweet' },
    { name: 'Delete', description: "Delete chat", href: '#', icon: TrashIcon, id:'delete' },
  ];


  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-primary">
        <span>Options</span>
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
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
        <Popover.Panel className="absolute z-10 mt-5 flex w-screen max-w-max md:-translate-x-3/4 px-4 -translate-x-[280px]">
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            <div className="p-4">
              {solutions.map((item) => (
                <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                  <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                  </div>
                  <div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionClick(item.id)
                      }}
                      className="font-semibold text-gray-900">
                      {item.name}
                      <span className="absolute inset-0" />
                    </div>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
              {callsToAction.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                >
                  <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                  {item.name}
                </a>
              ))}
            </div> */}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
