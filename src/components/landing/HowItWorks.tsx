import React from 'react';
import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Create Your Account',
    description: 'Sign up and set up your business profile and get paid in Crypto.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Connect Your Wallet',
    description: 'Link your Solana wallet and configure your payment preferences.',
    icon: LockClosedIcon,
  },
  {
    name: 'Start Accepting Payments',
    description: 'Embed the payment iframe on your website and start receiving payments.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Advanced Security',
    description: 'Using Blockchain to secure all transactions including 2FA and encryption.',
    icon: FingerPrintIcon,
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto">
        <h2 className="order-first text-3xl font-semibold tracking-tight text-center text-gray-900 sm:text-5xl">How It Works</h2>
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform allows you to easily create an account, connect your wallet, start accepting payments, and enjoy advanced security features. With our intuitive interface, you can focus on growing your business while we handle the rest.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dd className="order-first text-xl font-semibold tracking-tight text-gray-900 sm:text-3xl">{feature.name}</dd>
                <dt className="text-base leading-7 text-gray-600">{feature.description}</dt>
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                  <feature.icon aria-hidden="true" className="h-6 w-6 text-white" />
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;