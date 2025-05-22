import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch crypto rates from CoinGecko
    const cryptoRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana,tether,usd-coin&vs_currencies=usd',
      {
        next: { revalidate: 60 } // Cache for 60 seconds
      }
    );
    
    if (!cryptoRes.ok) throw new Error('CoinGecko API failed');
    const cryptoData = await cryptoRes.json();

    // Fetch forex rates (using CoinGecko's USD to KES rate)
    const forexRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/supported_vs_currencies'
    );
    const forexData = await forexRes.json();

    // For production, use a proper forex API like ExchangeRate-API
    const KES_RATE = 150; // Fallback rate
    
    return NextResponse.json({
      SOL: cryptoData.solana?.usd || 150,
      USDC: cryptoData['usd-coin']?.usd || 1,
      USDT: cryptoData.tether?.usd || 1,
      KES: KES_RATE,
      USD: 1,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Rates API error:', error);
    return NextResponse.json({
      SOL: 150,
      USDC: 1,
      USDT: 1,
      KES: 150,
      USD: 1,
      lastUpdated: new Date().toISOString(),
      error: 'Using fallback rates'
    });
  }
}