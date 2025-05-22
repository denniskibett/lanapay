'use client';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createQR } from '@solana/pay';
import { Keypair } from '@solana/web3.js';

interface PaymentRequest {
  recipient: string;
  amount: string;
  reference: string;
  label: string;
  message: string;
  memo: string;
  currency: string;
}

const CURRENCIES = [
  { value: 'SOL', label: 'SOL (Native)' },
  { value: 'USDC', label: 'USDC (Stablecoin)' },
  { value: 'USDT', label: 'USDT (Stablecoin)' },
  { value: 'KES', label: 'KES (Kenyan Shilling)' },
  { value: 'USD', label: 'USD (US Dollar)' },
];

interface ExchangeRates {
  SOL: number;
  USDC: number;
  USDT: number;
  KES: number;
  USD: number;
  lastUpdated?: string;
  error?: string;
}

export default function GetStarted() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [solanaAddress, setSolanaAddress] = useState<string>('TL16vRK83kEgJk2AYXD1RSTZ1tH4EkWLN3YF3YtGC1S');
  const [amount, setAmount] = useState<string>('0.0001');
  const [convertedAmount, setConvertedAmount] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [transactionVerified, setTransactionVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('SOL');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
    SOL: 150,
    USDC: 1,
    USDT: 1,
    KES: 150,
    USD: 1
  });
  const [ratesLoading, setRatesLoading] = useState<boolean>(true);

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setRatesLoading(true);
        const response = await fetch('/api/rates');
        const rates = await response.json();
        setExchangeRates(rates);
      } catch (error) {
        console.error('Failed to fetch rates:', error);
      } finally {
        setRatesLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Convert amount when currency or amount changes
  useEffect(() => {
    if (!amount || isNaN(parseFloat(amount))) {
      setConvertedAmount('0');
      return;
    }

    const amountNum = parseFloat(amount);
    if (currency === 'SOL') {
      setConvertedAmount(amountNum.toFixed(6));
      return;
    }

    // Convert to USD first, then to SOL
    const usdAmount = amountNum / (exchangeRates[currency as keyof ExchangeRates] || 1);
    const solAmount = usdAmount / exchangeRates.SOL;
    setConvertedAmount(solAmount.toFixed(6));
  }, [amount, currency, exchangeRates]);

  const handleGenerateClick = async () => {
    try {
      setIsLoading(true);
      const paymentRequest: PaymentRequest = {
        recipient: solanaAddress,
        amount: convertedAmount,
        reference: new Keypair().publicKey.toString(),
        label,
        message,
        memo,
        currency,
      };

      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const { url, ref } = await response.json();
      const qr = createQR(url);
      const qrBlob = await qr.getRawData('png');

      if (!qrBlob) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setQrCode(event.target.result);
        }
      };
      reader.readAsDataURL(qrBlob);

      setReference(ref);
    } catch (error) {
      console.error('Payment request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyClick = async () => {
    try {
      if (!reference) {
        alert('No transaction reference found');
        return;
      }
      
      setIsLoading(true);
      setTransactionVerified(false);
      
      // Add timeout and retry logic
      const MAX_RETRIES = 3;
      let lastError = '';
      
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);

          const response = await fetch(`/api/verify?reference=${reference}`, {
            signal: controller.signal
          }).finally(() => clearTimeout(timeoutId));

          const data = await response.json();
          
          if (!response.ok) {
            lastError = data.message || `HTTP error ${response.status}`;
            // Special handling for "not found" - might need more time
            if (data.status === 'not_found' && attempt < MAX_RETRIES) {
              await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
              continue;
            }
            throw new Error(lastError);
          }

          if (data.status === 'verified') {
            setTransactionVerified(true);
            return;
          }

          throw new Error(data.message || 'Verification failed');
        } catch (error) {
          lastError = error instanceof Error ? error.message : String(error);
          if (attempt === MAX_RETRIES) break;
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        }
      }

      throw new Error(lastError || 'Verification failed after retries');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Verification error:', errorMessage);
      
      // User-friendly error messages
      if (errorMessage.includes('not found')) {
        alert('Transaction not found yet. It may still be processing - please wait a few moments and try again.');
      } else if (errorMessage.includes('timeout')) {
        alert('Network timeout - please check your connection and try again.');
      } else if (errorMessage.includes('RPC')) {
        alert('Network issue - please try again later.');
      } else {
        alert('Verification failed: ' + errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            Solana Payment Gateway
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form Section */}
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              <h2 className="text-xl font-semibold mb-6 text-cyan-300">Payment Details</h2>
              
              <div className="space-y-5">
                <div className="form-group">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Solana Address</label>
                  <input
                    type="text"
                    value={solanaAddress}
                    onChange={(e) => setSolanaAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="Enter recipient address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Amount</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pr-16"
                        placeholder="0.00"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          className="flex items-center text-sm font-medium text-cyan-400 hover:text-cyan-300"
                          onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                        >
                          {currency}
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {showCurrencyDropdown && (
                          <div className="absolute z-10 top-full right-0 mt-1 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                            {CURRENCIES.map((curr) => (
                              <button
                                key={curr.value}
                                type="button"
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${
                                  currency === curr.value ? 'text-cyan-400' : 'text-gray-300'
                                }`}
                                onClick={() => {
                                  setCurrency(curr.value);
                                  setShowCurrencyDropdown(false);
                                }}
                              >
                                {curr.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {!ratesLoading && (
                      <div className="text-xs text-gray-400 mt-1">
                        {currency !== 'SOL' && (
                          <span>1 {currency} = {(exchangeRates.SOL / exchangeRates[currency as keyof ExchangeRates]).toFixed(6)} SOL</span>
                        )}
                        {currency === 'KES' && (
                          <span className="ml-2">(1 USD = {exchangeRates.KES.toFixed(2)} KES)</span>
                        )}
                        {exchangeRates.lastUpdated && (
                          <div className="text-gray-500 text-xs mt-1">
                            Rates updated: {new Date(exchangeRates.lastUpdated).toLocaleTimeString()}
                          </div>
                        )}
                        {exchangeRates.error && (
                          <div className="text-yellow-500 text-xs mt-1">
                            {exchangeRates.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Amount in SOL</label>
                    <div className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <p className="text-gray-300 text-sm">
                        {convertedAmount} SOL
                        {currency !== 'SOL' && (
                          <span className="text-gray-500 text-xs block mt-1">
                            ≈ ${(parseFloat(convertedAmount) * exchangeRates.SOL).toFixed(2)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Label</label>
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Optional"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Memo</label>
                    <input
                      type="text"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all min-h-[80px]"
                    placeholder="Optional message to recipient"
                  />
                </div>
                
                <button
                  onClick={handleGenerateClick}
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
                    isLoading
                      ? 'bg-indigo-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  } shadow-lg hover:shadow-indigo-500/20`}
                >
                  {isLoading ? 'Generating...' : 'Generate Payment Request'}
                </button>
              </div>
            </div>
            
            {/* QR Code & Verification Section */}
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-xl flex flex-col">
              <h2 className="text-xl font-semibold mb-6 text-purple-300">Payment QR Code</h2>
              
              <div className="flex-grow flex flex-col items-center justify-center">
                {qrCode ? (
                  <>
                    <div className="relative p-4 bg-white rounded-xl mb-6">
                      <Image 
                        src={qrCode} 
                        alt="Payment QR Code" 
                        width={220} 
                        height={220}
                        className="rounded-lg"
                      />
                      <div className="absolute inset-0 border-2 border-dashed border-cyan-400/30 rounded-xl pointer-events-none"></div>
                    </div>
                    
                    <div className="w-full max-w-xs text-center">
                      <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
                        <p className="text-sm text-gray-400">Paying:</p>
                        <p className="text-lg font-medium text-cyan-300">
                          {amount} {currency} ({convertedAmount} SOL)
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          ≈ ${(parseFloat(amount) * (currency === 'SOL' ? exchangeRates.SOL : exchangeRates[currency as keyof ExchangeRates])).toFixed(2)}
                        </p>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-1">Reference ID:</p>
                      <p className="font-mono text-cyan-300 text-sm mb-6 break-all">{reference}</p>
                      
                      <button
                        onClick={handleVerifyClick}
                        disabled={isLoading || transactionVerified}
                        className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
                          transactionVerified
                            ? 'bg-green-600 cursor-default'
                            : isLoading
                              ? 'bg-gray-600 cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                        } shadow-lg hover:shadow-green-500/20 mb-4`}
                      >
                        {transactionVerified ? 'Payment Verified!' : 'Verify Payment'}
                      </button>
                      
                      {transactionVerified && (
                        <div className="animate-pulse text-green-400 flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Transaction confirmed!
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                    <div className="w-48 h-48 bg-gray-700/50 rounded-2xl border-2 border-dashed border-gray-600 flex items-center justify-center mb-6">
                      <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-400 mb-2">No QR Code Generated</h3>
                    <p className="text-gray-500 text-sm">Fill out the payment details and click "Generate" to create a payment request</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}