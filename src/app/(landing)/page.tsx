import Link from 'next/link'
import Image from 'next/image'
import { 
  PhoneIcon,
  WalletIcon,
  BoltIcon,
  CurrencyDollarIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline'
import Navbar from '@/components/Navbar'

const FEATURES = [
  {
    title: "Instant Settlements",
    description: "Get funds in your wallet within seconds",
    icon: BoltIcon,
  },
  {
    title: "Low Fees",
    description: "Pay less than traditional payment methods",
    icon: CurrencyDollarIcon,
  },
  {
    title: "Multi-Currency",
    description: "Support for SOL, USDC, USDT and KES",
    icon: GlobeAltIcon,
  },
]

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-orange-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Payments Revolution
            </span>{" "}
            for Africa
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Accept M-PESA & Crypto payments with Solana speed
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-orange-600 text-white px-8 py-4 rounded-full hover:bg-orange-700 transition"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="p-6 border rounded-xl">
              <feature.icon className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* M-PESA + Crypto Integration */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Unified Payment Platform
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <PhoneIcon className="h-8 w-8 text-green-600" />
                <h3 className="text-xl font-semibold">M-PESA Integration</h3>
              </div>
              <p className="text-gray-600">
                Seamlessly accept mobile money payments from any Kenyan phone number.
              </p>
              
              <div className="flex items-center gap-4 mt-8">
                <WalletIcon className="h-8 w-8 text-purple-600" />
                <h3 className="text-xl font-semibold">Crypto Wallets</h3>
              </div>
              <p className="text-gray-600">
                Support for Solana, USDC, USDT with instant settlement.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border">
              <Image
                src="/payment-flow.png"
                alt="Payment Flow"
                width={600}
                height={400}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}