"use client";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import mixpanel from 'mixpanel-browser';
import Startup from "./startup";
import Script from "next/script";


// Replace YOUR_TOKEN with your Project Token
mixpanel.init('7d2f3e7ad39ee2f24f6465d2f9bf23f3', {debug: true, ignore_dnt: true}); 

type ProviderProps = {
  children: React.ReactNode
}
export function Providers({ children }: ProviderProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <Provider store={store}>
        <Startup>
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key="oKIE4TZiBuLon3JqkxsYxg" async></Script>
          {children}
       </Startup>
      </Provider>
    </SessionContextProvider>
    
  );
}
