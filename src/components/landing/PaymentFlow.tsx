import { PhoneIcon, WalletIcon } from '@heroicons/react/24/outline'

interface JourneyStepProps {
  title: string
  text: string
}

function JourneyStep({ title, text }: JourneyStepProps) {
  return (
    <div className="flex gap-4 p-6 rounded-xl bg-gray-800/20 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all">
      <div className="w-8 h-8 bg-cyan-900/30 rounded-full flex items-center justify-center backdrop-blur-sm">
        <div className="w-2 h-2 bg-cyan-400 rounded-full" />
      </div>
      <div>
        <h4 className="text-gray-100 font-semibold mb-1">{title}</h4>
        <p className="text-gray-400 text-sm/6">{text}</p>
      </div>
    </div>
  )
}

export function PaymentFlow() {
  return (
    <div className="relative py-24 sm:py-32 bg-gradient-to-br from-gray-900/50 to-black/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Seamless Payment Flow
            </span>
          </h2>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="rounded-lg bg-cyan-500/20 p-3 border border-cyan-400/30">
                <PhoneIcon className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">M-PESA Integration</h3>
            </div>
            <div className="space-y-6">
              <JourneyStep
                title="Initiate Payment"
                text="User enters M-PESA number and amount"
              />
              <JourneyStep
                title="STK Push"
                text="Instant payment request via Safaricom API"
              />
              <JourneyStep
                title="Auto Conversion"
                text="KES instantly converted to stablecoins"
              />
              <JourneyStep
                title="Settlement"
                text="Funds available in wallet within 15s"
              />
            </div>
          </div>

          <div className="max-w-xl lg:max-w-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="rounded-lg bg-purple-500/20 p-3 border border-purple-400/30">
                <WalletIcon className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Crypto Payments</h3>
            </div>
            <div className="space-y-6">
              <JourneyStep
                title="Generate Invoice"
                text="Create payment request with QR code"
              />
              <JourneyStep
                title="Wallet Connect"
                text="User approves transaction in wallet"
              />
              <JourneyStep
                title="Blockchain Settlement"
                text="Transaction confirmed in <400ms"
              />
              <JourneyStep
                title="Fiat Conversion"
                text="Auto-convert to KES (optional)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}