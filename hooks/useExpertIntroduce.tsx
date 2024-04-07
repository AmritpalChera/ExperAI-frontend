import { selectUser, setUserData } from "@/redux/features/UserSlice";
import backend from "@/utils/app/axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useExpertIntroduce() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const introduceExpert = async () => {
    let experResponse;
    if (user.activeGroup.groupId && user.id) {
      experResponse = await backend.post('/npc/respond', {
        npcId: user.npcDetails.npcId,
        userId: user.id,
        latestMessage: 'Introduce yourself. Keep it short with minmimum words',
        groupId: user.activeGroup?.groupId,
        creatorId: user.activeGroup?.creatorId || user.id,
        noSaveUser: true
      }).then(res => res.data).catch(err => { });
      const response = experResponse?.output?.text;
      dispatch(setUserData({ chatdata: [{ content: response, role: 'assistant' }] }));
    } else {
      experResponse = await backend.post('/npc/respondlx', {
        search: 'Introduce yourself. Keep it short with minmimum words',
        npcId: user.npcDetails.npcId
      }).then(res => res.data).catch(err => { });
      const response = experResponse?.answer;
      dispatch(setUserData({ chatdata: [{ content: response, role: 'assistant' }] }));
    }
    
  };

  useEffect(() => {
    if (user.npcDetails && user.chatdata?.length < 1) introduceExpert();
  }, [user.npcDetails, user.chatdata]);

  return <></>
}