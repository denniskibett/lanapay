import { NextResponse } from 'next/server';
import { createPaymentRequest } from '../../../utils/payment';

export async function POST(request: Request) {
  try {
    const { recipient, amount, reference, label, message, memo } = await request.json();
    console.log('Request data:', recipient, amount, reference, label, message, memo);

    // Validate input
    if (!recipient || !amount || !reference) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Process payment request
    const data = await createPaymentRequest(recipient, amount, reference, label, message, memo);

    if (!data.success) throw new Error('Payment request creation failed');

    console.log('Payment request URL:', data.url);
    return NextResponse.json({ url:data.url, ref: reference }, { status: 200 });
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json({ error: 'Failed to create payment request' }, { status: 500 });
  }
}
