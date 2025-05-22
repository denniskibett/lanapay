import { BoltIcon, CurrencyDollarIcon, GlobeAltIcon, LockClosedIcon } from '@heroicons/react/24/outline'

interface Feature {
  title: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const features = [
  {
    title: "Lightning Fast",
    description: "Process transactions at Solana speed with our optimized payment infrastructure.",
    icon: BoltIcon
  },
  {
    title: "Low Fees",
    description: "Enjoy near-zero transaction fees compared to traditional payment processors.",
    icon: CurrencyDollarIcon
  },
  {
    title: "Global Reach",
    description: "Accept payments from anywhere in the world with our borderless solution.",
    icon: GlobeAltIcon
  },
  {
    title: "Bank-Grade Security",
    description: "Your funds are protected with enterprise-level encryption and protocols.",
    icon: LockClosedIcon
  }
]

export function Features({ features }: { features: Feature[] }) {
  return (
    <div className="bg-gradient-to-r from-gray-900/70 to-black/70 backdrop-blur-sm py-24 sm:py-32">
        
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
       
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-cyan-400">
            Everything you need
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                The Future of Payments in Africa
            </span>
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          {/* Main Feature Card (Top Left) */}
          <div className="relative lg:row-span-2 group">
            <div className="absolute inset-px rounded-lg bg-gray-800/50 backdrop-blur-sm lg:rounded-l-4xl"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)] p-8 sm:p-10">
              <div className="w-14 h-14 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-400/20 backdrop-blur-sm">
                <BoltIcon className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{features[0].title}</h3>
              <p className="text-gray-300 leading-relaxed">{features[0].description}</p>
              <div className="mt-auto @container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                  <img
                    className="size-full object-cover object-top"
                    src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-mobile-friendly.png"
                    alt="Fast payments illustration"
                  />
                  
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-white/10 lg:rounded-l-4xl"></div>
          </div>

          {/* Performance Card (Top Right) */}
          <div className="relative max-lg:row-start-1 group">
            <div className="absolute inset-px rounded-lg bg-gray-800/50 backdrop-blur-sm max-lg:rounded-t-4xl"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] p-8 sm:p-10">
              <div className="w-14 h-14 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-400/20 backdrop-blur-sm">
                <CurrencyDollarIcon className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{features[1].title}</h3>
              <p className="text-gray-300 leading-relaxed">{features[1].description}</p>
              <div className="flex flex-1 items-center justify-center mt-6 max-lg:pt-10 max-lg:pb-12 lg:pb-2">
                <img
                  className="w-full max-lg:max-w-xs"
                  src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png"
                  alt="Low fees illustration"
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-white/10 max-lg:rounded-t-4xl"></div>
          </div>

          {/* Security Card (Bottom Middle) */}
          <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2 group">
            <div className="absolute inset-px rounded-lg bg-gray-800/50 backdrop-blur-sm"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] p-8 sm:p-10">
              <div className="w-14 h-14 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-400/20 backdrop-blur-sm">
                <LockClosedIcon className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{features[3].title}</h3>
              <p className="text-gray-300 leading-relaxed">{features[3].description}</p>
              <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                <img
                  className="h-[min(152px,40cqw)] object-cover"
                  src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                  alt="Security illustration"
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-white/10"></div>
          </div>

          {/* Global Card (Right Side) */}
          <div className="relative lg:row-span-2 group">
            <div className="absolute inset-px rounded-lg bg-gray-800/50 backdrop-blur-sm max-lg:rounded-b-4xl lg:rounded-r-4xl"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)] p-8 sm:p-10">
              <div className="w-14 h-14 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-400/20 backdrop-blur-sm">
                <GlobeAltIcon className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{features[2].title}</h3>
              <p className="text-gray-300 leading-relaxed">{features[2].description}</p>
              <div className="relative min-h-120 w-full grow mt-6">
                <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                  <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                    <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                      <div className="border-r border-b border-r-white/10 border-b-white/20 bg-white/5 px-4 py-2 text-white">
                        TransactionMap.jsx
                      </div>
                      <div className="border-r border-gray-600/10 px-4 py-2">PaymentRoutes.jsx</div>
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-14">
                    {/* World map or global payment visualization could go here */}
                    <img 
                      src="https://cdn.worldvectorlogo.com/logos/world-map.svg" 
                      className="w-full opacity-70"
                      alt="Global coverage"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-white/10 max-lg:rounded-b-4xl lg:rounded-r-4xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}