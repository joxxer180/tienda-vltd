export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = 'https://fappkckfuqqwzrmnqfon.supabase.co'

function isAuthorized(request) {
  const secret = request.headers.get('x-admin-secret')
  return secret === 'cambiame123'
}

export async function POST(request) {
  if (!isAuthorized(request))
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const supabaseAdmin = createClient(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
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

  const supabaseAdmin = createClient(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  const { id } = await request.json()
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}