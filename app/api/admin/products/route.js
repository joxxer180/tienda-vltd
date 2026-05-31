import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

function isAuthorized(request) {
 const secret = request.headers.get('x-admin-secret')
 console.log('secret recibido:', secret)
 console.log('secret esperado:', process.env.ADMIN_SECRET)
 return secret === process.env.ADMIN_SECRET
}

export async function POST(request) {
 if (!isAuthorized(request))
   return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

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

 const { id } = await request.json()
 const { error } = await supabaseAdmin
   .from('products')
   .delete()
   .eq('id', id)

 if (error) return NextResponse.json({ error: error.message }, { status: 500 })
 return NextResponse.json({ ok: true })
}