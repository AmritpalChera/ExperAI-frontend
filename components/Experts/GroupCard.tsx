import { baseurl, experaiId } from "@/utils/app";
import Menu from "./Menu";
import backend from "@/utils/app/axios";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUserData } from "@/redux/features/UserSlice";
import { useRouter } from "next/navigation";
import mixpanel from "mixpanel-browser";
import supabase from "@/utils/setup/supabase";
import { ToastContainer, toast } from "react-toastify";
import { ArrowTopRightOnSquareIcon, CheckBadgeIcon } from "@heroicons/react/20/solid";

export default function GroupCard({ group, setActiveGroup, index }: any) {
  // const date = group.lastUpdated ? new Date(group.lastUpdated).toLocaleDateString() : '';
  const user = useSelector(selectUser);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleNewSession = async () => {
    let newGroupData = await backend.post('/group/new', {
      userId: user.id,
      npcId: group.npcId?.npcId,
      creatorId: group?.creatorId
    }).then(res => res.data).catch(err => {
      if (err?.response?.data?.premium) {
        toast.error('Friend limit reached');
        dispatch(setUserData({upgradeModal: {open: true, message: err.response.data.error}}))
      } else {
        toast.error('Something went wrong');
      }
    });
    let newGroup = newGroupData?.data;
    if (newGroup) {
      let activeChat = { ...newGroup.group, lastMessage: '' };
      dispatch(setUserData({ activeGroup: activeChat }));
      router.push('/chat');
    }
    
  };

  const handleDeleteGroup = async () => {
    const deletedGroupData = await backend.post('/user/deleteGroup', {
      userId: user.id,
      groupId: group.groupId,
      npcId: group.npcId?.npcId
    }).then(res => res.data);
    const deletedGroup = deletedGroupData.data;
    if (deletedGroup?.success) {
      const groups = [...user.groups];
      groups.splice(index, 1);
      dispatch(setUserData({ groups, activeGroup: groups[0]?.groupId }));
    }
  }

  const handleTweet = () => {

    let tweet = (`Had a blast chatting with "${group.name}" on experai.com\n\nLink: ${baseurl}/chat`);
    if (group.creatorId) tweet += `?name=${group.name}&eid=${group.npcId?.npcId}&cid=${group.creatorId}`;

    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  }

  const handleOptionClick = (option: string) => {
    mixpanel.track(`Explore card option click - ${option}`);
    if (option === 'copyLink') {
      if (!group.creatorId) throw toast.error("Start a new session to share this group");
      navigator.clipboard.writeText(`${baseurl}/chat?name=${group.name}&eid=${group.npcId?.npcId}&cid=${group?.creatorId}`);
      toast.info('Link Copied!')
    } else if (option === 'newSession') {
      handleNewSession();
    } else if (option === 'delete') {
      handleDeleteGroup();
      toast.success('Group deleted');
    } else if (option === 'tweet') {
      handleTweet();
    } else if (option === 'copyPrompt') {
      navigator.clipboard.writeText(`${group.npcId?.jobTitle}`);
      toast.info('Prompt Copied!');
    }
  };
  
  return (
    <div key={group.groupId} onClick={()=>setActiveGroup(group)} className="shadow flex bg-gray-50  max-w-4xl w-full gap-4 border py-3 px-4 rounded-lg cursor-pointer">
        <div className="flex h-12 w-12 relative rounded-full bg-green-100">
          <img src={group.imageUrl} className="h-full w-full object-cover rounded-full" />
      </div>
        <div className=" w-full">
          <div className="flex justify-between mb-1">
          <div className="flex gap-4 items-center flex-1">
            <h1 className="font-bold">{group.name}</h1>
            {group.npcId?.npcId !== experaiId && <div onClick={(e) => {
              e.stopPropagation();
              handleOptionClick('copyLink');
            }} className="text-sm font-semiboldrounded-full hover:shadow-lg">
                <ArrowTopRightOnSquareIcon className="text-blue-500 h-4 w-4 text-bold"/>
              </div>}
              {/* <div className="flex items-center gap-2 mt-2 w-full max-w-3xl overflow-hidden flex-wrap">
                <CheckBadgeIcon className="h-6 text-blue-500 w-6"/>{group?.npcId?.tags?.map((tag: string) => <div key={tag} className="rounded-full text-sm text-secondary font-bold underline">{tag}</div>)}
              </div> */}
            </div>
            
            {/* <p className="text-primary hover:font-semibold">Options</p> */}
          <Menu handleOptionClick={handleOptionClick} />
        </div>
        
          <div className="md:flex  gap-2 items-center">
            <div className="flex gap-1 items-center">
              <CheckBadgeIcon className="h-4 w-4 text-blue-500"/>{group?.npcId?.tags?.map((tag: string) => <p key={tag} className="rounded-full text-sm text-secondary">{tag}</p>)}
            </div>
            <p className="flex-1 w-full text-gray-500 text-sm">{group.lastMessage?.substring(0, 30)}...</p>
            {/* <p className="text-gray-500">{date}</p> */}
        </div>
        
        </div>
      </div>
  )
}