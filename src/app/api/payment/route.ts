// app/api/payment/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(req: Request) {
  const { amount, currency, payer, payee, method } = await req.json()

  // Validate payment
  if (!['mpesa', 'solana'].includes(method)) {
    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
  }

  // Process payment
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      amount,
      currency,
      payer,
      payee,
      method,
      status: 'pending'
    }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Add blockchain/Safaricom API call here
  return NextResponse.json({ 
    message: 'Payment initiated', 
    transaction: data[0] 
  })
}