"use client";
import Sidenav from '../Sidenav';
import MessageWindow from './MessageWindow';
import PowerView from './PowerView';
import SigninModal from '../SigninModal';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUserData } from '@/redux/features/UserSlice';
import supabase from '@/utils/setup/supabase';
import { toast } from 'react-toastify';
import backend from '@/utils/app/axios';
import { useSearchParams } from 'next/navigation';
import mixpanel from 'mixpanel-browser';
import UpgradeModal from './UpgradeModal';

export default function Chat() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const params = useSearchParams();

  const loadChatdata = async () => {
    // load messages from the most recent active chat
    const recentGroup = user.activeGroup || (user.groups && user?.groups[0]?.groupId);
    if (!recentGroup) return toast.error('Could not load group info');

    // load its contexts
    const messagesData = await backend.post('/group/getMessages', {
      groupId: recentGroup.groupId,
      maxRange: 30,
      userId: user.id
    }).then(res => res.data).catch(e => { });
    const messages = messagesData?.data?.map((message: any) => {
      return {
        ...message,
        role: message.senderUserId === user.id ? 'user' : 'assistant',
        content: message.text
      }
    });

    // get group npc
    const npcData = await backend.post('/group/getnpc', { groupId: recentGroup.groupId }).then((res) => res.data).catch(err => { });
    const npcDetails = npcData?.data?.npcId;

    
    if (messages && npcDetails) {
      dispatch(setUserData({ chatdata: messages.reverse(), npcDetails, activeGroup: recentGroup }))
    } else {
      toast.error('Could not load chat data');
    }  
  }

  useEffect(() => {
    if (user.groups && user.id) {
      mixpanel.track('loading chat data');
      loadChatdata();
    }
    else if (!user.id) {
      mixpanel.track('opening signin');
      dispatch(setUserData({ signinOpen: true }));
    }
  }, [user.groups])

  return (
    <>
      <div>
        <Sidenav />

        <main className="lg:pl-72">
          <div className="xl:pr-96">
            <div className="px-4  sm:px-6 lg:px-8 flex justify-center">
              <MessageWindow />
            </div>
          </div>
        </main>

        <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
          <PowerView />
        </aside>
        <SigninModal />
      </div>
    </>
  )
}
