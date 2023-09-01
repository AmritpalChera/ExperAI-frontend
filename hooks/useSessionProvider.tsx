import { selectUser, setUserData } from "@/redux/features/UserSlice";
import backend from "@/utils/app/axios";
import supabase from "@/utils/setup/supabase";
import mixpanel from "mixpanel-browser";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

export default function useSessionProvider() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userSession1 = async () => {
    const session = await supabase.auth.getSession();
    const user: any = session?.data?.session?.user;
    dispatch(setUserData({ ...user, loaded: true }));
    if (user?.id) {
      mixpanel.identify(user.id);
      const customerData = await supabase.from('customers').select('plan').eq('userId', user.id).single();
      dispatch(setUserData({ planType: customerData?.data?.plan || 'lite' }))
    } else {
      mixpanel.track('user not logged in');
    }
    // Track an event. It can be anything, but in this example, we're tracking a Signed Up event.
    // Include a property about the signup, like the Signup Type
  };

  // handle any search params - go back to a conversation with specific expert, if doesn't exist, generate conversation.
  const params = useSearchParams();

  const loadUserGroups = async () => {
    const groupsData = await backend.post('/user/listGroups', { userId: user.id });
    let groups = groupsData?.data?.data;
    const customExpert = params.get('eid');
    let activeChat: any;
    if ((groups && groups.length < 1) || customExpert) {
      // create new group with experAI
      let newGroupData = await backend.post('/group/unique', {
        userId: user.id,
        npcId: customExpert || '46d9456d-c2ea-41ed-b436-8afb7131f90b'
      }).then(res => res.data).catch(err => {
        if (err?.response?.data?.premium) {
          toast.error('Friend limit reached');
          dispatch(setUserData({ upgradeModal: { open: true, message: err.response.data.error } }));
        } else {
          toast.error('Something went wrong')
        }
        return;
      });

      let newGroup = newGroupData?.data;
      

      // id is likely invalid, start chat with experai instead
      if (!newGroup) {
        newGroupData = await backend.post('/group/unique', {
          userId: user.id,
          npcId: '46d9456d-c2ea-41ed-b436-8afb7131f90b'
        }).then(res => res.data).catch(err => {
          if (err?.response?.data?.premium) {
            toast.error('Friend limit reached');
            dispatch(setUserData({ upgradeModal: { open: true, message: err.response.data.error } }));
          } else {
            toast.error('Something went wrong')
          }
          return;
        });
        newGroup = newGroupData?.data;
      }
      activeChat = { ...newGroup.group, lastMessage: '' };
    }
    dispatch(setUserData({ groups, activeGroup: activeChat }));
    // if (customExpert) params.delete();
  };

  const loadPricings = async () => {
    const pricings = await backend.get('/configs').then(res => res.data).catch(err => { });
    if (pricings?.plans) dispatch(setUserData({ plans: pricings.plans }))
  };

  useEffect(() => {
    userSession1();
  }, [supabase, router]);

  useEffect(() => {
    if (user.id) loadUserGroups();
  }, [user.id]);

  useEffect(() => {
    // load pricing configs
    loadPricings();
  }, [])
 

  return <div></div>

}