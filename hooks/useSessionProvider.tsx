import { setUserData } from "@/redux/features/UserSlice";
import supabase from "@/utils/setup/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useSessionProvider() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userSession1 = async () => {
    const session = await supabase.auth.getSession();
    console.log('session is: ', session)
    const user: any = session?.data?.session?.user;
    dispatch(setUserData({ ...user, loaded: true}));
    // Track an event. It can be anything, but in this example, we're tracking a Signed Up event.
    // Include a property about the signup, like the Signup Type
  }
  useEffect(() => {
    userSession1();
  }, [supabase, router])
 

  return <div></div>

}