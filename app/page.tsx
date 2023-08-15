import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='h-screen w-full flex justify-center'>
      <main className=" container">
        <Header />
        <Hero />
      </main>
    </div>
    
  )
}
