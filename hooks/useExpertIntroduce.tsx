import { selectUser, setUserData } from "@/redux/features/UserSlice";
import backend from "@/utils/app/axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useExpertIntroduce() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const introduceExpert = async () => {
    const experResponse = await backend.post('/npc/respondlx', {
      search: 'Introduce yourself in a tone that sounds like your personality. Keep it short and concise. Do not reveal personal details.',
      npcId: user.npcDetails.npcId
    }).then(res => res.data).catch(err => { });

    const response = experResponse?.answer;
    dispatch(setUserData({ chatdata: [{ content: response, role: 'assistant' }] }));
  };

  useEffect(() => {
    if (user.npcDetails && user.chatdata?.length < 1) introduceExpert();
  }, [user.npcDetails, user.chatdata]);

  return <></>
}