// Axios instance with mindplug auth
import Mindplug from 'mindplug';

const mindplug = new Mindplug({mindplugKey: process.env.MINDPLUG_KEY!})

 export default mindplug; 