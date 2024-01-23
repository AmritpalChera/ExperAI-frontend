
"use client";
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Description from '@/components/Hero/Description'
import Footer from '@/components/Hero/Footer'
import Stats from '@/components/Hero/Stats'


export default function Home() {
  return (
    <div className='h-screen w-full flex justify-center'>
      <main className=" container">
        <Header />
        <Hero />
        <Stats />
        <Description />
        <Footer />
      </main>
    </div>
    
  )
}
