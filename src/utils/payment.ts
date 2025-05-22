import { PublicKey } from '@solana/web3.js';
import { encodeURL } from '@solana/pay';
import BigNumber from 'bignumber.js';

export async function createPaymentRequest(
  recipient: string,
  amount: string,
  reference: string,
  label: string,
  message: string,
  memo: string
) {
  try {
    const recipientPublicKey = new PublicKey(recipient); // Ensure recipient is base58 encoded
    const referencePublicKey = new PublicKey(reference); // Ensure reference is base58 encoded

    const amountBn = new BigNumber(amount); // Convert string amount to BigNumber

    const paymentUrl = encodeURL({
      recipient: recipientPublicKey,
      amount: amountBn,
      reference: referencePublicKey,
      label: label?.toString() ?? '',
      message: message?.toString() ?? '', // Encode message value
      memo: memo?.toString() ?? '', // Encode memo value
    });

    return { success: true, url: paymentUrl.toString() };
  } catch (error) {
    console.error('Error creating payment request:', error);
    throw new Error('Invalid public key format or encoding.');
  }
}

