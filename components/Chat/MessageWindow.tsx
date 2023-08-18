import backend from "@/utils/app/axios";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addMessage, selectUser, setUserData } from "@/redux/features/UserSlice";

export default function MessageWindow() {
  
  
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  const {chatdata} = useSelector(selectUser);

  const respond = async () => {
    if (!input) return toast.error('Please enter input');
    

    setLoading(true);
    setInput('');
    dispatch(addMessage({ content: input, role: 'user' }));
    const data = await backend.post('/respond', { search: input, chatHistory: chatdata.slice(0, 10) }).then(res => res.data).catch(err => {
      console.log('err', err);
      toast.error('Something went wrong');
    });
   
    if (data) {
      dispatch(setUserData({ webSources: data.externalData?.data || [] }))
      dispatch(addMessage({ content: data.answer, role: 'assistant' }));
    }
    setLoading(false);
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      respond();
    }
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
        <h1 className="text-primary font-bold">ExperAI</h1>
        {chatdata.length > 5 && <button className="bg-black/10 animate-pulse px-4 py-1 rounded-lg text-primary">Save Chat</button>}
      </div>
        <div className='flex-1 flex flex-col gap-4 h-full overflow-y-scroll noScrollbar'>
          
          <div className=" flex-1 flex gap-4 flex-col">
            {
              chatdata.map((message: any, index: number) => {
                if (message.role === 'user') {
                  return (
                    <div key={index} className='flex justify-end'>
                      <h3 className='w-fit px-6 py-3 shadow-md rounded-t-2xl !rounded-l-2xl bg-primary max-w-xs lg:max-w-3xl text-white text-[16px]'>
                        {message.content}
                      </h3>
                    </div>
                  )
                } else return (
                  <div key={index}>
                    <h3
                      className='px-6 py-3 shadow shadow-slate-500 text-[16px] bg-black/20 rounded-t-2xl !rounded-r-2xl w-fit leading-6 whitespace-pre-wrap'
                    >
                      {message.content}  
                    </h3>
                  </div>
                )
              })
          }
          <div ref={bottomRef}></div>
          </div>
          
        </div>
      
      <div>
        <div className="relative flex-grow">
          <label>
            <input value={input} onChange={(e) => setInput(e.target.value)} className="bg-white pr-12 text-black cursor-text rounded-3xl py-3 px-4 max-w-4xl w-full border-2 shadow-lg shadow-gray"
              onKeyDown={handleKeyDown} autoFocus placeholder="Aa..."/>
      
            <button type="button" onClick={respond} className="absolute right-2 top-[12px]">
                <PaperAirplaneIcon className='h-6 w-6 text-primary' />
            </button>
          </label>
        </div>
      </div>
    </div>
  )
}