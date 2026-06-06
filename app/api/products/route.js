export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json({
    prueba: process.env.PRUEBA || 'VACIA',
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'VACIA',
    anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'OK' : 'VACIA'
  })
}