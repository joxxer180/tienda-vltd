export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = 'https://fappkckfuqqwzrmnqfon.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcHBrY2tmdXFxd3pybW5xZm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMDY3MDgsImV4cCI6MjA5NTY4MjcwOH0.LV7-eXyBYZymSH0PyR0dicnjepsFsqcDPga7AgiT8S8'

function isAuthorized(request) {
  const secret = request.headers.get('x-admin-secret')
  return secret === 'cambiame123'
}

export async function POST(request) {
  if (!isAuthorized(request))
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY)
  const body = await request.json()
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert([body])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(request) {
  if (!isAuthorized(request))
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_KEY)
  const { id } = await request.json()
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}