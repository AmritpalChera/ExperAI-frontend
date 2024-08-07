"use client";

import { logout, selectUser, setUserData } from '@/redux/features/UserSlice'
import { CustomerPlans, billManageURL } from '@/utils/app';
import backend from '@/utils/app/axios';
import supabase from '@/utils/setup/supabase';
import { CheckIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import SigninModal from '../SigninModal';



function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Pricing() {
  const user = useSelector(selectUser);
  const litePlan = user?.plans?.lite;
  const basicPlan = user?.plans?.basic;
  const customPlan = user?.plans?.custom;

  const router = useRouter();
  const dispatch = useDispatch();

  const tiers = [
    {
      name: 'Beginner',
      id: `${litePlan?.id || 'lite'}`,
      href: '#',
      priceMonthly: `$${litePlan?.amount || '0'}`,
      description: `${litePlan?.messageLimit || '60'} messages/month premium access`,
      features: [`Up to ${litePlan?.friendLimit || '5'} experts`, 'Limited chat history', '60 messages per month'],
      mostPopular: false,
      priceId: litePlan?.priceId
    },
    {
      name: 'Novice',
      id: `${basicPlan?.id || 'basic'}`,
      href: '#',
      priceMonthly: `$${basicPlan?.amount/100 || '10'}`,
      description: `Unlimited messages/month`,
      features: [
        `Up to ${basicPlan?.friendLimit || '100'} Experts`,
        'No ads + priority access',
        'Unlimited messages'
      ],
      mostPopular: true,
      priceId: basicPlan?.priceId
    },
    {
      name: 'One time top-up',
      id: `${customPlan?.id || 'custom'}`,
      href: '#',
      priceMonthly: `$${customPlan?.amount/100 || '8'}`,
      description: `Add ${customPlan?.messageLimit || '300'} messages`,
      features: [
        'Everything same as your current plan',
        `Adds ${customPlan?.messageLimit || '300'} messages to your limit`,
        'Credits do not expire'
      ],
      mostPopular: false,
      oneTime: true,
      priceId: customPlan?.priceId
    },
  ];

  const handlePricingClick = async (id: string) => {
    if (!user.email) return dispatch(setUserData({ signinOpen: true }));
    if (id === CustomerPlans.LITE && user.planType === CustomerPlans.LITE) return toast.error('Already on lite plan.');
    else if ((user.planType === CustomerPlans.LITE) || (id === CustomerPlans.CUSTOM)) {
      await backend.post('/stripe/checkoutSession', {
        priceId: id,
        email: user.email,
        userId: user.id
      }).then(res => {
        if (res.data) {
          router.push(res.data)
        }
      });
    } else {
      // manage the plan
      window.open(billManageURL, '_blank', 'noopener, noreferrer')
    }
  }
  
  const getButtonText = (id: string) => {
    if (!user.id) return 'Sign in';
    if (user.planType === id) return 'Current plan';
    if (user.planType === CustomerPlans.LITE && id === CustomerPlans.BASIC) return 'Upgrade';
    if (id === CustomerPlans.CUSTOM) return 'Add Message Credits'
    if (user.planType !== CustomerPlans.LITE) return 'Manage Subscription';
    else return 'Upgrade'
  }

  const signout = async () => {
    dispatch(logout());
    await supabase.auth.signOut();
    window.location.href = '/'
  }

  const [messageCredits, setMessageCredits] = useState(0);

  const loadAnalytics = async () => {
    const analyticsData = await supabase.from('Analytics').select('messageCredits').eq('userId', user.id).single();
    if (analyticsData.data) {
      setMessageCredits(analyticsData.data.messageCredits);
    }
  }

  useEffect(() => {
    if (user.id) loadAnalytics();
  }, [user.id]);

  const hasRemainingCreds = (tierId: string) => (CustomerPlans.CUSTOM === tierId && messageCredits);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Flexable&nbsp;plans&nbsp;
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'lg:z-10 lg:rounded-b-none' : 'lg:mt-8',
                tierIdx === 0 ? 'lg:rounded-r-none' : '',
                tierIdx === tiers.length - 1 ? 'lg:rounded-l-none' : '',
                'flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={classNames(
                      tier.mostPopular ? 'text-indigo-600' : 'text-gray-900',
                      'text-lg font-semibold leading-8'
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                      Most popular
                    </p>
                  ) : null}
                </div>
                {hasRemainingCreds(tier.id) ? <p className='text-sm mt-3 text-primary font-semibold'>Remaining Credits: {messageCredits}</p> : ''}
                {!hasRemainingCreds(tier.id) && <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>}
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.priceMonthly}</span>
                  {!tier.oneTime && <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                onClick={()=>handlePricingClick(tier.id)}
                aria-describedby={tier.id}

                className={classNames(
                  tier.mostPopular
                    ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                    : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                  'mt-8 cursor-pointer block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                )}
              >
                {getButtonText(tier.id)}
              </div>
            </div>
          ))}
          
        </div>
      </div>
      <div className='w-full mt-12 flex flex-col items-center'>
        <h1 className='font-bold text-xl'>Manage Plan</h1>
        <p className='mt-4'>Your email: <Link href={billManageURL} target='blank' className='text-primary underline cursor-pointer'>{ user.email }</Link> </p>
        <p className='mt-12 text-primary cursor-pointer hover:underline' onClick={signout}>Signout</p>
      </div>
      <div>
      <SigninModal />
      </div>
    </div>
  )
}
