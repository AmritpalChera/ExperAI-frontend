// Axios instance with mindplug auth
import Mindplug from 'mindplug';

const mindplug = new Mindplug({ mindplugKey: process.env.NEXT_PUBLIC_MINDPLUG_KEY!, openaiKey: process.env.NEXT_PUBLIC_OPENAI_KEY! })

 export default mindplug; 