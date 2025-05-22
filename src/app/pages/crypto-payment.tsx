import Layout from "@/app/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { createQR } from '@solana/pay';
import { Keypair, Connection, Transaction } from '@solana/web3.js';
import Image from 'next/image';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

interface PaymentDetails {
  label: string;
  message: string;
  memo: string;
  amount: string;
  usdtPrice: string;
  solAmount: number;
  qrCode: string;
  qrGenerated: boolean;
  paymentVerified: boolean;
  reference: string;
}

function CryptoPaymentPage() {
  const router = useRouter();
  const { label, message, memo, amount } = router.query;

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    label: '',
    message: '',
    memo: '',
    amount: '',
    usdtPrice: '',
    solAmount: 0,
    qrCode: '',
    qrGenerated: false,
    paymentVerified: false,
    reference: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    if (label && message && memo && amount) {
      setPaymentDetails(prevState => ({
        ...prevState,
        label: label as string,
        message: message as string,
        memo: memo as string,
        amount: amount as string,
      }));
    }
  }, [label, message, memo, amount]);

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
      .then(response => {
        const solUsdtPrice = response.data.solana.usd;
        setPaymentDetails(prevState => ({ ...prevState, usdtPrice: solUsdtPrice }));
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (paymentDetails.usdtPrice && paymentDetails.amount) {
      const solAmount = parseFloat(paymentDetails.amount) / parseFloat(paymentDetails.usdtPrice);
      setPaymentDetails(prevState => ({ ...prevState, solAmount }));
    }
  }, [paymentDetails.usdtPrice, paymentDetails.amount]);

  const handleGeneratePayment = async () => {
    const solanaAddress = 'TL16vRK83kEgJk2AYXD1RSTZ1tH4EkWLN3YF3YtGC1S';
    const reference = new Keypair().publicKey.toBase58();
  
    try {
      const paymentRequestResponse = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: solanaAddress,
          amount: paymentDetails.solAmount,
          reference,
          label: paymentDetails.label,
          message: paymentDetails.message,
          memo: paymentDetails.memo,
        }),
      });
  
      if (!paymentRequestResponse.ok) {
        throw new Error(`Failed to generate payment request: ${paymentRequestResponse.status} ${paymentRequestResponse.statusText}`);
      }
  
      const { url, ref } = await paymentRequestResponse.json();
  
      const qrCode = createQR(url);
      const qrBlob = await qrCode.getRawData('png');
  
      if (!qrBlob) return;
  
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setPaymentDetails((prevState) => ({
            ...prevState,
            qrCode: event.target.result,
            qrGenerated: true,
            reference: ref,
          }));
        }
      };
  
      reader.readAsDataURL(qrBlob);
    } catch (error) {
      console.error('Error generating QR code:', error);
      setDialogMessage('Failed to generate QR code. Please try again.');
      setDialogOpen(true);
    }
  };
  
  const handleVerifyClick = async () => {
    if (!paymentDetails.reference) {
      setDialogMessage('Please generate a payment order first');
      setDialogOpen(true);
      return;
    }
  
    try {
      const paymentVerificationResponse = await fetch(`/api/pay/${paymentDetails.reference}`, {
        method: 'GET',
      });
  
      if (!paymentVerificationResponse.ok) {
        throw new Error(`Error verifying payment: ${paymentVerificationResponse.status} ${paymentVerificationResponse.statusText}`);
      }
  
      const paymentStatus = await paymentVerificationResponse.json();
  
      if (paymentStatus.status === 'verified') {
        setDialogMessage('Transaction verified');
        setDialogOpen(true);
        setPaymentDetails((prevState) => ({
          ...prevState,
          qrCode: '',
          reference: '',
          paymentVerified: true,
        }));
      } else {
        console.error(`Payment verification failed: ${paymentStatus.status}`);
        setDialogMessage(`Payment verification failed: ${paymentStatus.status}`);
        setDialogOpen(true);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setDialogMessage('Error verifying payment. Please try again.');
      setDialogOpen(true);
    }
  };
  
  return (
    <Layout>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6">
        <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Crypto Payment</h2>
          <div className="flex flex-row justify-between h-full">
            <div className="w-1/2 pr-4">
              <p className="text-lg font-medium text-gray-700 mb-4">Shop Name: {paymentDetails.label}</p>
              <p className="text-lg text-gray-700 mb-2">Message: {paymentDetails.message}</p>
              <p className="text-lg text-gray-700 mb-2">Memo: {paymentDetails.memo}</p>
              <p className="text-lg font-bold text-gray-900 mb-4">
                Amount: {paymentDetails.amount} USDT ({paymentDetails.solAmount} SOL)
              </p>
            </div>
            <div className="w-1/2 pl-4">
              {paymentDetails.qrCode && (
                <Image src={paymentDetails.qrCode} alt="QR Code" width={200} height={200} />
              )}
            </div>
          </div>
          <div className="flex flex-row justify-center mb-4">
            <button
              className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              onClick={handleGeneratePayment}
            >
              Generate Payment
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
              onClick={handleVerifyClick}
            >
              Verify Payment
            </button>
          </div>
          {paymentDetails.qrGenerated}
        </div>
      </div>

      {/* Dialog for Alerts */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} className="relative z-10">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Alert
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{dialogMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  onClick={() => setDialogOpen(false)}
                >
                  OK
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
      <Footer />
    </Layout>
  );
}

export default CryptoPaymentPage;
