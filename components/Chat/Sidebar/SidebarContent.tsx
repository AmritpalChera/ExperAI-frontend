import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, CalendarIcon, DocumentTextIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';
import { useState } from 'react';
import HomeSelect from './HomeSelect';
import UploadAudio from './UploadAudio';
import UploadText from './UploadText';
import UploadPdf from './UploadPdf';
import UploadWeb from './UploadWeb';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUserData } from '@/redux/features/UserSlice';
import { CustomerPlans } from '@/utils/app';
import supabase from '@/utils/setup/supabase';
import { toast } from 'react-toastify';
import AddLink from './AddLink';
import Image from 'next/image';

const items = [
  {
    name: 'Upload Plain Text',
    description: 'Copy and paste text',
    id: 'text',
    iconColor: 'bg-pink-500',
    icon: Bars3Icon,
  },
  {
    name: 'Upload a pdf',
    description: 'Embed an entire PDF doc',
    id: 'pdf',
    iconColor: 'bg-purple-500',
    icon: DocumentTextIcon,
  },
  {
    name: 'Webpage URL',
    description: 'Link a website',
    id: 'webpage',
    iconColor: 'bg-blue-500',
    icon: CalendarIcon,
  },
  {
    name: 'Audio',
    description: 'Any MP3 or WAV',
    id: 'audio',
    iconColor: 'bg-green-500',
    icon: SpeakerWaveIcon
  }
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function SidebarContext() {
  const user = useSelector(selectUser);
  const [uploadType, setUploadType] = useState('');
  const dispatch = useDispatch();

  const limitHandler = async (fileSize: number) => {
    let limit = 20000000; // 20 MB
    if (user.planType === CustomerPlans.LITE) {
      // allow 2 total file uploads across all experts
      limit = 5000000;
      const totalFilesData = await supabase.from('exp-contexts').select().eq('userId', user.id);
      const totalFiles = totalFilesData.data?.length || 0;
      if (totalFiles >= 2) {
        dispatch(setUserData({ upgradeModal: {open: true, message: 'Please upgrade to upload more files.'} }));
        throw toast.error('Already uploaded 2 files. Limit reached')
      }
      
      if (fileSize > limit) {
        dispatch(setUserData({ upgradeModal: {open: true, message: 'Please upgrade to increae limit to 20 MB.'} }));
        throw toast.error('File limit is 5 MB. Please upgrade');
      }
    } else if (user.planType === CustomerPlans.BASIC) {
      // allow up to 5 uploads per expert
      const recentGroup = user.activeGroup || (user.groups && user?.groups[0]?.groupId);

      const totalFilesData = await supabase.from('exp-contexts').select().eq('userId', user.id).eq('npcId', recentGroup?.npcId?.npcId);
      const totalFiles = totalFilesData.data?.length || 0;
      if (totalFiles >= 5) {
        throw toast.error('File limit reached for current expert')
      }
      
      if (fileSize > limit) {
        throw toast.error('Size limit is 20 MB.');
      }
    }
  }

  const getRender = () => {
    if (uploadType === 'webpage') return <UploadWeb setUploadType={setUploadType} limitHandler={limitHandler} />
    else if (uploadType === 'pdf') return <UploadPdf setUploadType={setUploadType} limitHandler={limitHandler} />
    else if (uploadType === 'text') return <UploadText setUploadType={setUploadType} limitHandler={limitHandler} />
    else if (uploadType === 'audio') return <UploadAudio setUploadType={setUploadType} limitHandler={limitHandler} />
    else if (uploadType === 'addLink') return <AddLink setUploadType={setUploadType} />
    else return <HomeSelect setUploadType={setUploadType} uploadType={uploadType} />
  }

  return (
    <div>
      <div className='flex flex-col px-4 gap-4'>
          <Image src="/lilybw.jpg" width={500} height={500} alt="lily image" />
          <h2 className='text-center text-neutral-600 font-medium text-lg'>Introducing Coach Lily</h2>
          <p className='text-neutral-600 text-center'>An AI Life Coach - who grows alongside you on your journey</p>
          <div className='flex justify-center w-full mt-8'>
            <Link href={'https://coachlily.com'} className='bg-black text-center w-full px-12 py-3 text-white rounded-xl'>Start Chat</Link>
          </div>
      </div>
    </div>
  )
}