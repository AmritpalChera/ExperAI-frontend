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
  console.log('upload type is: ', uploadType)

  const getRender = () => {
    if (uploadType === 'webpage') return <UploadWeb setUploadType={setUploadType} />
    else if (uploadType === 'pdf') return <UploadPdf setUploadType={setUploadType} />
    else if (uploadType === 'text') return <UploadText setUploadType={setUploadType} />
    else if (uploadType === 'audio') return <UploadAudio setUploadType={setUploadType} />
    else return <HomeSelect setUploadType={setUploadType} uploadType={uploadType} />
  }

  return (
    <div>
      {getRender()}
    </div>
  )
}