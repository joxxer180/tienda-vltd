import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result = await supabase
    .from('products')
    .select('*')

  return NextResponse.json(result)
}