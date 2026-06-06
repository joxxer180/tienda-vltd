import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  return NextResponse.json({
    timestamp: Date.now(),
    total: data?.length || 0,
    data,
    error
  })
}