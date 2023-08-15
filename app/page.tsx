import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Image from 'next/image'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
    <div className='h-screen w-full flex justify-center'>
      <ToastContainer />
      <main className=" container">
        <Header />
        <Hero />
      </main>
    </div>
    
  )
}
