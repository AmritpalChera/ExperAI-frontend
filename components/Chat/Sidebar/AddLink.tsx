
import { useEffect, useState } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import supabase from '@/utils/setup/supabase'
import { SupabaseFolder } from '@/components/Documents'
import { useSelector } from 'react-redux'
import { selectUser } from '@/redux/features/UserSlice'
import { toast } from 'react-toastify'

const people = [
  { name: 'Leslie Alexander', username: '@lesliealexander' },
  // More users...
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function AddLink({setUploadType}: any) {
  const user = useSelector(selectUser);
  const [query, setQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<SupabaseFolder | null>(null);
  const [folders, setFolders] = useState<Array<SupabaseFolder>>([]);

  const getFolders = async () => {
    const folders = await supabase.from('DocumentFolders').select('id, created_at, name, parentFolder (id, name)').order('created_at', {ascending: false});
    if (folders?.data) setFolders(folders.data);
  }

  const makeLink = async () => {
    if (!selectedFolder) return toast.error("no selected folder");
    const groupId = user.activeGroup?.groupId;
    console.log('group id is: ', groupId);

    const getLink = await supabase.from('FolderBudLinks').select().eq("groupId", groupId).eq("folderId", selectedFolder.id).eq("userId", user.id).single();
    if (getLink.data) {
      setUploadType('');
      return toast.success("Done");
    }

    console.log('selected folder is: ', selectedFolder);
    const newLink = await supabase.from('FolderBudLinks').upsert({groupId: groupId, userId: user.id, folderId: selectedFolder!.id}).select().single();
    console.log('new link generated: ', newLink);
    if (newLink.data) {
      setUploadType('');
    }
  }

  useEffect(() => {
    getFolders();

  }, [])

  const filteredPeople =
    query === ''
      ? folders
      : folders.filter((folder) => {
          return folder.name.toLowerCase().includes(query.toLowerCase())
        });

  
  const getComboBox = () => (
    <Combobox as="div" value={selectedFolder} onChange={setSelectedFolder}>
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Select a folder:</Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(folder: any) => folder?.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredPeople.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {folders.map((folder) => (
              <Combobox.Option
                key={folder.id}
                value={folder}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex">
                      <span className={classNames('truncate', selected && 'font-semibold')}>{folder.name}</span>
                      <span
                        className={classNames(
                          'ml-2 truncate text-gray-500',
                          active ? 'text-indigo-200' : 'text-gray-500'
                        )}
                      >
                        {folder.parentFolder?.name || "/"}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )

  return (
    <div>
      <div className='border-b flex justify-between pb-2'>
        <h1 className="text-gray-500">Link Folders</h1>
        <button onClick={() => setUploadType('')} className='bg-red px-4 rounded-lg text-white'>Return</button>
      </div>
      <div className='mt-4'>
        {getComboBox()}
      </div>
      <div className='w-full flex justify-center mt-8'>
        <button onClick={makeLink} className='bg-primary px-12 py-1 text-white rounded-lg'>Link</button>
      </div>
      
    </div>
  )
}
