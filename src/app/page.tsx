import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/landing/Hero'
import { Stats } from '@/components/landing/Stats'
import  HowItWorks  from '@/components/landing/HowItWorks'
import { Features } from '@/components/landing/Features'
import { PaymentFlow } from '@/components/landing/PaymentFlow'
import { TrustedBy } from '@/components/landing/TrustedBy'
import { FAQs } from '@/components/landing/FAQs'
import { 
  BoltIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ArrowPathIcon,
  UserCircleIcon,
  WalletIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline'
import Pricing from '@/components/landing/Pricing'

const STATS = [
  { value: '44M+', label: 'Assets Secured' },
  { value: '119T+', label: 'Annual Volume' },
  { value: '98%', label: 'Success Rate' },
  { value: '46K+', label: 'Active Users' },
]

const FEATURES = [
  {
    title: "Lightning Transactions",
    description: "4000+ TPS powered by Solana blockchain",
    icon: BoltIcon,
  },
  {
    title: "Micro Fees",
    description: "0.1% transaction fees, 100x cheaper than traditional finance",
    icon: CurrencyDollarIcon,
  },
  {
    title: "Borderless Payments",
    description: "Support for 50+ currencies and global crypto assets",
    icon: GlobeAltIcon,
  },
  {
    title: "Bank-Grade Security",
    description: "Military-grade encryption and multi-sig wallets",
    icon: LockClosedIcon,
  },
]

const STEPS = [
  {
    title: "Create Account",
    description: "Sign up in 30 seconds with email or wallet",
    icon: UserCircleIcon,
  },
  {
    title: "Verify Identity",
    description: "Instant KYC verification with AI-powered checks",
    icon: ArrowPathIcon,
  },
  {
    title: "Connect Wallet",
    description: "Link your Solana or EVM-compatible wallet",
    icon: WalletIcon,
  },
  {
    title: "Start Transacting",
    description: "Send/receive payments globally in seconds",
    icon: QrCodeIcon,
  },
]

const TRUSTED_BY = [
   {
      name: 'Safaricom',
      logo: 'https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-gray-900.svg',
      width: 158,
      height: 48
    },
    {
      name: 'Binance',
      logo: 'https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-gray-900.svg',
      width: 158,
      height: 48
    },
    {
      name: 'Flutterwave',
      logo: 'https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-gray-900.svg',
      width: 158,
      height: 48
    },
    {
      name: 'Coinbase',
      logo: 'https://tailwindcss.com/plus-assets/img/logos/158x48/savvycal-logo-gray-900.svg',
      width: 158,
      height: 48
    },
    {
      name: 'Jumia',
      logo: 'https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-gray-900.svg',
      width: 158,
      height: 48
    },
    {
      name: 'Chipper',
      logo: 'https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-gray-900.svg',
      width: 158,
      height: 48
    },
    {
      name: 'Paxful',
      logo: 'https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-gray-900.svg',
      width: 158,
      height: 48
    },
    {
      name: 'Yellow Card',
      logo: 'https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-gray-900.svg',
      width: 158,
      height: 48
    }
  ];

const FAQS = [
  {
    question: "How do I convert M-PESA to crypto?",
    answer: "Instant conversion through our liquidity pools with best market rates"
  },
  {
    question: "What currencies are supported?",
    answer: "KES, USD, EUR + SOL, USDC, USDT, BTC, ETH and 50+ more"
  },
  {
    question: "Is there a mobile app?",
    answer: "Progressive Web App available with full iOS/Android support"
  },
  {
    question: "How are fees calculated?",
    answer: "0.1% for crypto, 1.5% for M-PESA (includes all charges)"
  },
]

export default function LandingPage() {
  return (
    <main className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* <Banner /> */}
      <Navbar />
      <Hero />
      <TrustedBy companies={TRUSTED_BY} />
      {/* <Stats stats={STATS} /> */}
      <Features features={FEATURES} />
      {/* <Pricing /> */}
      {/* <HowItWorks /> */}
      <PaymentFlow />
      <FAQs faqs={FAQS} />
      <Footer />
    </main>
  )
}