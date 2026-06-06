import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json([
    { name: 'PRODUCTO A' },
    { name: 'PRODUCTO B' },
    { name: 'PRODUCTO C' }
  ])
}