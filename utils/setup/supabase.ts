import { createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs';


// create supabase client
const supabase = createBrowserSupabaseClient();
export default supabase;