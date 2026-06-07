import Gallery from './Gallery'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }) {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product) {
    return <h1>Producto no encontrado</h1>
  }

  const images =
    product.images?.length > 0
      ? product.images
      : product.image_url
      ? [product.image_url]
      : []

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '20px'
      }}
    >
      <h1>{product.name}</h1>

      <Gallery
  images={images}
  productName={product.name}
/>

      <h2 style={{ marginTop: '30px' }}>
        ${Number(product.price).toLocaleString()}
      </h2>

      <p>
        Categoría: {product.category}
      </p>
    </div>
  )
}