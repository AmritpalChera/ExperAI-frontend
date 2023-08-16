import axios from 'axios';


const key = process.env.NEXT_PUBLIC_BACKEND_KEY;

const env = process.env.NODE_ENV;


const backend = axios.create({
    baseURL: '/api',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    }
});

 export default backend; 