import { selectUser, setUserData } from '@/redux/features/UserSlice';
import { CustomerPlans } from '@/utils/app';
import mindplug from '@/utils/setup/mindplug';
import supabase from '@/utils/setup/supabase';
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, CalendarIcon, DocumentTextIcon, ShieldExclamationIcon, SpeakerWaveIcon, TrashIcon } from '@heroicons/react/24/outline'
import { createHash } from 'crypto';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

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


export default function HomeSelect({ setUploadType, uploadType }: any) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const handlePreselect = (itemId: string) => {
    if (!user.id) dispatch(setUserData({ signinOpen: true }));
    else setUploadType(itemId)
  };
  const [uploadedTypes, setUploadedTypes] = useState<any>([]);


  const getPreviousUploads = async () => {
    const prevUploadData = await supabase.from('exp-contexts').select('name, type, uploadId').eq('npcId', user.npcDetails?.npcId).eq('userId', user.id);
    if (prevUploadData.error) {
      toast.error('Could not get context');
      return console.log('Could not get previous context');
    }
    let documents = prevUploadData.data;
    documents = documents.map(doc => {
      return {
        name: doc.name,
        type: doc.type,
        id: doc.type === 'application/pdf' ? 'pdf' : 'audio',
        iconColor: doc.type === 'application/pdf' ? 'bg-purple-500' : 'bg-green-500',
        icon: doc.type === 'application/pdf' ? DocumentTextIcon : SpeakerWaveIcon,
        uploadId: doc.uploadId
      }
    });

    setUploadedTypes(documents);
  }

  const handleDeleteUpload = async (uploadId: string) => {
    const urlHash = createHash('sha256').update(`${user.id}-${user.npcDetails?.npcId}`).digest('hex');
    const data = await mindplug.deleteByUploadId({ uploadId, db: 'experAi-contexts', collection: urlHash });
    if (data.success) {
      await supabase.from('exp-contexts').delete().eq('uploadId', uploadId);
      await getPreviousUploads();
    } else {
      toast.error('Unable to delete');
    }
    
  } 

  useEffect(() => {
    getPreviousUploads();
  }, [uploadType]);

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
      <ul role="list" className="mt-6 border-gray-200">
        {uploadedTypes.map((item: any, itemIdx: any) => (
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
                  <div onClick={() => handleDeleteUpload(item.uploadId)}>
                    <span className="absolute inset-0 cursor-pointer" aria-hidden="true" />
                    {item.name}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{item.type}</p>
              </div>
              <div className="flex-shrink-0 self-center">
                <TrashIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}