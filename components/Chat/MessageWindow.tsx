import backend from "@/utils/app/axios";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addMessage, selectUser, setUserData } from "@/redux/features/UserSlice";
import useExpertIntroduce from "@/hooks/useExpertIntroduce";
import MessageContextMenu from "./MessageContextMenu";
import UpgradeModal from "./UpgradeModal";
import mixpanel from "mixpanel-browser";

export default function MessageWindow() {
  
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  const { chatdata } = useSelector(selectUser);
  
  useExpertIntroduce();

  const respond = async () => {
    if (!input) return toast.error('Please enter input');
    

    setLoading(true);
    setInput('');
    dispatch(addMessage({ content: input, role: 'user' }));
    const data = await backend.post('/npc/respond', {latestMessage: input, npcId: user.npcDetails.npcId, userId: user.id, groupId: user.activeGroup?.groupId }).then(res => res.data).catch(err => {
      console.log('err', err);
      if (err?.response?.data?.premium) {
        toast.error('Message limit reached');
        dispatch(setUserData({ upgradeModal: {open: true, message: err?.response?.data?.error}}))
      } else {
        toast.error('Something went wrong');
      }
    });
    mixpanel.track('expert respond', {
      input, answer: data.output?.text, npcId: user.npcDetails?.npcId, npcJob: user.npcDetails?.jobTitle
    });
    if (data) {
      dispatch(setUserData({ webSources: data.externalData?.data || [] }))
      dispatch(addMessage({ ...data.output, content: data.output.text, role: 'assistant' }));
    }
    setLoading(false);
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      respond();
    }
  }

  const handleContextClick = () => {
    mixpanel.track('Mobile custom context clicked');
    dispatch(setUserData({contextUploadOpen: true }))
  }

  const bottomRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll on everytime response is being generated or received
      bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatdata, bottomRef, windowRef]);


  return (
    <div ref={windowRef} className='max-w-3xl w-full py-6 flex flex-col gap-4 lg:h-[calc(100vh-2rem)] h-[calc(100vh-4rem)] overflow-y-hidden'>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div className="h-10 w-10">
            <img src={user.npcDetails?.imageUrl} className="rounded-full w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-primary font-bold">{user.npcDetails?.name}</h1>
            <p className="font-semibold text-gray-400">Active</p>
          </div>
          
        </div>
        
        {/* {chatdata.length > 5 && !user.id && <button className="bg-red animate-pulse px-4 py-1 rounded-lg text-white">Save Chat</button>} */}
        {user.id && (
          <div className="flex gap-4">
            {/* <button className="bg-red px-4 py-1 rounded-lg text-white">Clear</button> */}
            {/* <button className="bg-dark px-4 py-0 rounded-lg text-white">New Session</button> */}
            <div className='hover:text-primary'>
              <span onClick={handleContextClick} className="bg-dark xl:hidden rounded-xl text-white py-1 px-4 cursor-pointer hover:bg-dark/80">Context</span>
            </div>
          </div>

          )}
      </div>
        <div className='flex-1 flex flex-col gap-4 h-full overflow-y-scroll noScrollbar'>
          
          <div className=" flex-1 flex gap-4 flex-col">
            {
              chatdata.map((message: any, index: number) => {
                if (message.role === 'user') {
                  return (
                    <div key={index} className='flex justify-end relative'>
                      <h3 className='w-fit px-6 py-3 shadow-md rounded-t-2xl !rounded-l-2xl bg-primary max-w-xs lg:max-w-3xl text-white text-[16px]'>
                        {message.content}
                      </h3>
                      
                    </div>
                  )
                } else return (
                  <div key={index} className="relative flex justify-between w-fit">
                    <div
                      className='px-6 py-3 shadow relative shadow-slate-300 text-[16px] min-w-[330px] bg-black/5 rounded-t-2xl !rounded-r-2xl w-fit leading-6 whitespace-pre-wrap'
                    >
                      {message.content}                        
                    </div>
                    {message.contextName && <div className="flex items-end cursor-pointer ">
                        <MessageContextMenu score={message.contextScore} filename={message.contextName} description={message.contextDescription} />
                    </div>
                    }
                  </div>
                )
              })
          }
          <div ref={bottomRef}></div>
          </div>
          
        </div>
      
      <div>
        <div className="relative flex-grow ">
          {loading && <div className=" w-full animate-pulse px-6">
            <div className="w-full border-red rounded-3xl coolBlueGradient h-2 -mb-1">
            </div>
          </div>}
          <label className="relative">

            <input value={input} onChange={(e) => setInput(e.target.value)} className="bg-white pr-12 text-black cursor-text rounded-3xl py-3 px-4 max-w-4xl w-full border-2 shadow-lg shadow-gray focus-visible:outline-0"
              onKeyDown={handleKeyDown} autoFocus placeholder="Aa..."/>
      
            <button type="button" onClick={respond} className="absolute right-2 mt-3">
                <PaperAirplaneIcon className='h-6 w-6 text-primary' />
            </button>
          </label>
        </div>
      </div>
      <UpgradeModal />
    </div>
  )
}