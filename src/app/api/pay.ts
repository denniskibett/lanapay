import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { encodeURL, findReference, validateTransfer } from '@solana/pay';
import BigNumber from 'bignumber.js';
import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

function isValidPublicKey(key: string): boolean {
  try {
    new PublicKey(key);
    return true;
  } catch {
    return false;
  }
}

const quicknodeEndpoint = 'https://lingering-chaotic-patron.solana-mainnet.quiknode.pro/79a123c27f3b2e7921bbb53933bd6d588cbb4466';
const paymentRequests = new Map<string, { recipient: PublicKey; amount: BigNumber; memo: string; label: string; message: string }>();

async function generateUrl(
  recipient: PublicKey,
  amount: BigNumber,
  reference: PublicKey,
  label: string,
  message: string,
  memo: string,
) {
  const url = encodeURL({
    recipient,
    amount,
    reference,
    label,
    message,
    memo,
  });
  return { url };
}

async function verifyTransaction(reference: PublicKey) {
  const paymentData = paymentRequests.get(reference.toBase58());
  if (!paymentData) {
    throw new Error('Payment request not found');
  }
  const { recipient, amount, memo } = paymentData;
  const connection = new Connection(quicknodeEndpoint, 'confirmed');
  console.log('recipient', recipient.toBase58());
  console.log('amount', amount);
  console.log('reference', reference.toBase58());
  console.log('memo', memo);

  const found = await findReference(connection, reference);
  console.log(found.signature);

  const response = await validateTransfer(
    connection,
    found.signature,
    {
      recipient,
      amount,
      splToken: undefined,
      reference,
      //memo
    },
    { commitment: 'confirmed' }
  );

  if (response) {
    paymentRequests.delete(reference.toBase58());
  }
  return response;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    console.log('GET request received');
    const reference = req.query.reference;
    if (!reference) {
      res.status(400).json({ error: 'Missing reference query parameter' });
      return;
    }
    try {
      const { wallet, amount, label, message, memo } = req.body;

      if (!wallet || !isValidPublicKey(wallet)) {
        return res.status(400).json({ error: 'Invalid or missing wallet address' });
      }
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        return res.status(400).json({ error: 'Invalid or missing amount' });
      }
      if (!label || typeof label !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing label' });
      }
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing message' });
      }
      if (!memo || typeof memo !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing memo' });
      }

      const recipient = new PublicKey(wallet);
      const solAmount = new BigNumber(amount);
      const reference = new Keypair().publicKey;

      const urlData = await generateUrl(
        recipient,
        solAmount,
        reference,
        label,
        message,
        memo
      );

      const ref = reference.toBase58();
      paymentRequests.set(ref, { recipient, amount: solAmount, memo, label, message });
      const { url } = urlData;

      const logPath = path.join(process.cwd(), 'logs', `${new Date().toISOString().split('T')[0]}.json`);
      fs.appendFileSync(logPath, JSON.stringify({ ref, recipient: recipient.toBase58(), amount: solAmount.toString(), memo, label, message, date: new Date().toISOString() }) + '\n');

      res.status(200).json({ url: url.toString(), ref });
    } catch (error) {
      logger.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }  else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}