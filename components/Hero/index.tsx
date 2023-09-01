import Link from 'next/link';


export default function Example() {

  return (
    <div className="bg-white">
     
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20 pt-14">
        <div
          className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-blue-600/10 ring-1 ring-blue-50 sm:-mr-80 lg:-mr-96"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-40 lg:px-8">
          {/* <div className='fixed top-0 w-screen text-center left-0 text-md font-semibold text-white bg-red'> - Introducing the new version of ExperAI - </div> */}
          <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
            <div className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
            <img
                  className="h-12 w-auto"
                  src="/logoShort.png"
                  alt="ExperAI"
                />

              <span className='md:text-9xl text-6xl'>Exper<span className='text-sky-700'>AI</span></span> <br/><br/>
              Hub of AI experts
            </div>
            <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
              <p className="text-lg leading-8 text-gray-600">
                Enter the temple of knowledge, generate experts and share with friends!
              </p>
              <div className="mt-10 flex items-center gap-x-6 relative">
                <Link
                  href="/chat"
                  className="rounded-md  bg-blue-700 px-6 py-4 font-semibold w-[300px] text-center text-lg text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Start Chat...
                  {/* <div className="absolute -top-3 left-52">
                    <Image
                      src="/cursors.png"
                      alt="index-image"
                      height={150}
                      width={150}
                      className="mx-auto max-w-full lg:mr-0 animate-pulse"
                    />
                  </div> */}
                </Link>
               
              </div>
            </div>
            <img
              src="/ssc.jpg"
              alt=""
              className="mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36"
            />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
      </div>
    </div>
  )
}
