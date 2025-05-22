'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function ConnectWallet() {
  const { publicKey } = useWallet()

  return (
    <div className="border p-6 rounded-xl bg-white">
      <h3 className="text-xl font-semibold mb-4">Connect Wallet</h3>
      
      {publicKey ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Connected: {publicKey.toBase58().slice(0,6)}...{publicKey.toBase58().slice(-6)}
          </p>
          <button
            onClick={() => window.solana.disconnect()}
            className="bg-red-100 text-red-600 px-4 py-2 rounded"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <WalletMultiButton className="bg-orange-600 hover:bg-orange-700 !text-white !px-6 !py-3 !rounded-lg" />
      )}

      <div className="mt-6 border-t pt-6">
        <h4 className="font-medium mb-3">Or use M-PESA</h4>
        <input
          type="tel"
          placeholder="Enter MPESA number"
          className="w-full px-4 py-2 border rounded-lg mb-3"
        />
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
          Verify via SMS
        </button>
      </div>
    </div>
  )
}