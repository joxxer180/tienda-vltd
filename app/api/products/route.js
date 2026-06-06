import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json([
    { name: 'PRUEBA 1' },
    { name: 'PRUEBA 2' }
  ])
}