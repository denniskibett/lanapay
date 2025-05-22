import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import { findReference, validateTransfer } from '@solana/pay';
import BigNumber from 'bignumber.js';

const quicknodeEndpoint = 'https://lingering-chaotic-patron.solana-mainnet.quiknode.pro/79a123c27f3b2e7921bbb53933bd6d588cbb4466';
const paymentRequests = new Map<string, { recipient: PublicKey; amount: BigNumber; memo: string; label: string; message: string }>();

async function verifyTransaction(reference: PublicKey) {
  const paymentData = paymentRequests.get(reference.toBase58());
  if (!paymentData) {
    throw new Error('Payment request not found');
  }
  const { recipient, amount, memo } = paymentData;
  const connection = new Connection(quicknodeEndpoint, 'confirmed');

  const found = await findReference(connection, reference);

  const response = await validateTransfer(
    connection,
    found.signature,
    {
      recipient,
      amount,
      splToken: undefined,
      reference,
    },
    { commitment: 'confirmed' }
  );

  if (response) {
    paymentRequests.delete(reference.toBase58());
  }
  return response;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { recipient, amount, reference, label, message, memo } = req.body;

    if (!recipient || !amount || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const publicKey = new PublicKey(recipient);
    const paymentData = {
      recipient: publicKey,
      amount: new BigNumber(amount),
      memo,
      label,
      message,
    };

    paymentRequests.set(reference, paymentData);
    return res.status(200).json({ status: 'payment request created', reference });
  }

  if (req.method === 'GET') {
    const reference = req.query.reference as string;
    if (!reference) {
      res.status(400).json({ error: 'Missing reference query parameter' });
      return;
    }

    try {
      const referencePublicKey = new PublicKey(reference);
      const response = await verifyTransaction(referencePublicKey);
      if (response) {
        res.status(200).json({ status: 'verified' });
      } else {
        res.status(404).json({ status: 'not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
