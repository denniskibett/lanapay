import { CheckIcon } from '@heroicons/react/20/solid'

const tiers = [
  {
    name: 'Individual',
    id: 'tier-individual',
    href: '#',
    priceMonthly: '$0.10',
    description: "For freelancers and small businesses entering the crypto space",
    features: [
      '500 transactions/month',
      'Basic payment gateway',
      'Mobile money integration',
      'Email support',
      'Basic analytics',
      '2 team members'
    ],
    featured: false,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    priceMonthly: '$0.25',
    description: 'For large-scale operations and financial institutions',
    features: [
      '10,000+ transactions/month',
      'Advanced payment APIs',
      'Multi-currency settlements',
      '24/7 priority support',
      'Dedicated account manager',
      'Custom SLAs',
      'Audit logs',
      'Team management'
    ],
    featured: true,
  },
]

const pros = [
  {
    name: 'Features',
    individual: ['M-PESA integration', 'Crypto payouts', 'Basic reporting'],
    enterprise: ['All Individual features plus:', 'Chargeback protection', 'FX hedging', 'PCI compliance'],
  },
  {
    name: 'Support',
    individual: ['Email support', 'Community forum'],
    enterprise: ['24/7 phone support', 'Dedicated CSM', 'Technical account manager'],
  },
  {
    name: 'Security',
    individual: ['2FA', 'Basic encryption'],
    enterprise: ['SOC 2 Type II', 'Penetration testing', 'Insurance coverage'],
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Pricing() {
  return (
    <div className="relative isolate bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold leading-7 text-cyan-400">Pricing</h2>
        <p className="mt-2 text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Built for Every Transaction Scale
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
        Whether you're making your first crypto transaction or managing millions, we've got you covered.
      </p>

      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured 
                ? 'relative bg-gray-800/30 backdrop-blur-sm border border-cyan-400/20 shadow-2xl' 
                : 'bg-gray-800/20 border border-white/10',
              tier.featured
                ? 'rounded-2xl'
                : tierIdx === 0 
                  ? 'rounded-t-2xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-2xl'
                  : 'sm:rounded-t-none lg:rounded-tr-2xl lg:rounded-bl-none',
              'rounded-2xl p-8 ring-1 ring-white/10 sm:p-10 transition-all hover:border-cyan-400/40',
            )}
          >
            <h3 className={classNames(tier.featured ? 'text-cyan-400' : 'text-white', 'text-2xl font-bold')}>
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className={classNames(
                tier.featured ? 'text-cyan-400' : 'text-white',
                'text-5xl font-bold tracking-tight'
              )}>
                {tier.priceMonthly}
              </span>
              <span className={classNames(tier.featured ? 'text-cyan-300' : 'text-gray-400', 'text-base')}>
                /transaction
              </span>
            </p>
            <p className={classNames(tier.featured ? 'text-cyan-100' : 'text-gray-300', 'mt-6 text-lg leading-7')}>
              {tier.description}
            </p>
            <ul className={classNames(
              tier.featured ? 'text-cyan-100' : 'text-gray-300',
              'mt-8 space-y-3 text-base sm:mt-10'
            )}>
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={classNames(tier.featured ? 'text-cyan-400' : 'text-cyan-500', 'h-6 w-5 flex-none')}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              className={classNames(
                tier.featured
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90'
                  : 'text-cyan-400 ring-1 ring-cyan-400/30 hover:ring-cyan-400/50',
                'mt-8 block rounded-lg px-3.5 py-2.5 text-center text-sm font-semibold transition-all sm:mt-10'
              )}
            >
              {tier.featured ? 'Contact Sales' : 'Start Building'}
            </a>
          </div>
        ))}
      </div>

      {/* Comparison Section */}
      <div className="mx-auto mt-24 max-w-7xl">
        <h3 className="text-2xl font-bold text-center text-white mb-12">Feature Comparison</h3>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {pros.map((section) => (
            <div key={section.name} className="bg-gray-800/20 p-6 rounded-xl border border-white/10">
              <h4 className="text-lg font-semibold text-cyan-400 mb-4">{section.name}</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-2">Individual</p>
                  <ul className="space-y-2">
                    {section.individual.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-gray-400">
                        <CheckIcon className="h-4 w-4 text-cyan-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm font-medium text-gray-300 mb-2">Enterprise</p>
                  <ul className="space-y-2">
                    {section.enterprise.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-gray-400">
                        <CheckIcon className="h-4 w-4 text-purple-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}