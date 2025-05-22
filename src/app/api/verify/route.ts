import { NextResponse } from 'next/server';
import { Connection } from '@solana/web3.js';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    
    if (!reference) {
      return NextResponse.json(
        { status: 'error', message: 'Missing reference parameter' },
        { status: 400 }
      );
    }

    // Initialize Solana connection with Helius RPC
    const connection = new Connection(process.env.SOLANA_RPC_URL!, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 20000 // 20 seconds timeout
    });

    // First try getting the transaction directly
    let transaction;
    try {
      transaction = await connection.getTransaction(reference, {
        maxSupportedTransactionVersion: 0
      });
      
      if (!transaction) {
        // Fallback to signature status check
        const status = await connection.getSignatureStatus(reference);
        if (status.value?.confirmationStatus === 'confirmed') {
          return NextResponse.json({
            status: 'verified',
            message: 'Transaction confirmed (via signature status)'
          });
        }
        
        return NextResponse.json(
          { status: 'not_found', message: 'Transaction not found on chain' },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error('RPC Error:', error);
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Failed to fetch transaction details from RPC',
          rpcError: error instanceof Error ? error.message : String(error)
        },
        { status: 502 } // Bad Gateway
      );
    }

    // Check transaction status
    if (transaction.meta?.err) {
      return NextResponse.json(
        { 
          status: 'failed', 
          message: 'Transaction failed',
          error: transaction.meta.err 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: 'verified',
      message: 'Transaction verified successfully',
      details: {
        slot: transaction.slot,
        fee: transaction.meta?.fee,
        blockTime: transaction.blockTime,
        signatures: transaction.transaction.signatures
      }
    });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}