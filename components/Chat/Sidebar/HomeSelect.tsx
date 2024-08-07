import { selectUser, setUserData } from '@/redux/features/UserSlice';
import { CustomerPlans } from '@/utils/app';
import mindplug from '@/utils/setup/mindplug';
import supabase from '@/utils/setup/supabase';
import { ChevronRightIcon, FolderIcon } from '@heroicons/react/20/solid'
import { ArchiveBoxArrowDownIcon, Bars3Icon, CalendarIcon, DocumentTextIcon, ShieldExclamationIcon, SpeakerWaveIcon, TrashIcon } from '@heroicons/react/24/outline'
import { createHash } from 'crypto';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import LinkModal from './AddLink';
import { SupabaseFolder } from '@/components/Documents';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const [folders, setFolders] = useState<any>([]);

  const handlePreselect = (itemId: string) => {
    if (!user.id) return dispatch(setUserData({ signinOpen: true }));
    const creatorId = user.activeGroup?.creatorId || user.id;
    if (creatorId !== user.id) throw toast.error('Not allowed for 3rd party groups');
    else setUploadType(itemId)
  };
  const [uploadedTypes, setUploadedTypes] = useState<Array<SupabaseFolder>>([]);


  const getPreviousUploads = async () => {
    const creatorId = user.activeGroup?.creatorId;
    const prevUploadData = await supabase.from('exp-contexts').select('name, type, uploadId').eq('npcId', user.npcDetails?.npcId).eq('userId', creatorId || user.id);
    if (prevUploadData.error) {
      toast.error('Could not get context');
      return console.log('Could not get previous context', prevUploadData.error);
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

    setUploadedTypes(documents as any);
  }

  const handleDeleteUpload = async (uploadId: string) => {
    const creatorId = user.activeGroup?.creatorId;
    if (creatorId !== user.id) throw toast.error('Not allowed for 3rd party groups');
    const urlHash = createHash('sha256').update(`${user.id}-${user.npcDetails?.npcId}`).digest('hex');
    const data = await mindplug.deleteByUploadId({ uploadId, db: 'experAi-contexts', collection: urlHash });
    if (data.success) {
      await supabase.from('exp-contexts').delete().eq('uploadId', uploadId);
      await getPreviousUploads();
    } else {
      toast.error('Unable to delete');
    }
    
  } 

  const getLinkedFolders = async () => {
    const groupId = user.activeGroup?.groupId;
    const foldersData = await supabase.from('FolderBudLinks').select('folderId (name, id, created_at, parentFolder (name))').eq('groupId', groupId);
    if (foldersData.data) {
      const folders = foldersData.data.map((folder) => folder.folderId);
      setFolders(folders);
    }
  }

  const unlinkFolder = async (selectedFolder: SupabaseFolder) => {
    const groupId = user.activeGroup?.groupId;
    const unlinked = await supabase.from('FolderBudLinks').delete().eq('groupId', groupId).eq("folderId", selectedFolder.id).select().single();

    
    console.log(unlinked);
    if (unlinked.data){
      const newFolders = folders.filter((folder: SupabaseFolder) => folder.id !== selectedFolder.id);
      setFolders([...newFolders]);
      return toast.success("unlinked");}
    else return toast.error("Error");
  }

  const handleFolderClick = async (folder: SupabaseFolder) => {
    router.push(`/documents/folder/${folder.id}?name=${folder.name}`);
  }

  useEffect(() => {
    
    if (user.npcDetails?.npcId) {
      getLinkedFolders();
      // getPreviousUploads();
    }
  }, [uploadType, user]);

  return (
    <div className=''>
      <div className='border-b flex justify-between pb-2 mb-4'>
        <h1 className="text-gray-500">Link Folders</h1>
        <button onClick={()=>setUploadType('addLink')} className='bg-blue-500 px-4 rounded-lg text-white'>Add link</button>
      </div>
      {
          folders.length == 0 && (
            <div className='w-full flex flex-col mt-8 justify-center items-center text-gray-500'>
              <ArchiveBoxArrowDownIcon  className='h-8 w-8'/>
              <p>No folders added</p>
            </div>
          )
      }
      {
        folders.length > 0 && folders.map((folder: SupabaseFolder) => (
          <div key={folder.id} className='flex gap-2 items-center pt-2 justify-between'>
            <div className='flex items-center gap-2'>
              <FolderIcon className='h-4 w-4 text-blue-300'/>
              <button onClick={(e) => handleFolderClick(folder)} className='text-blue-500'>{folder.name}</button>
            </div>
            <div>
              <button onClick={(e)=>unlinkFolder(folder)} className='text-red'>Unlink</button>
              
            </div>
            
          </div>
        ))
      }
    </div>
  )
}