import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })

  return NextResponse.json({
    count,
    error,
    data
  })
}