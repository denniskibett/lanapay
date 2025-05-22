// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Your API logic here
  return NextResponse.json({ message: 'Success' });
}