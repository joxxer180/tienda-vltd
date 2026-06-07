import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }) {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product) {
    notFound()
  }

  const images =
    product.images?.length > 0
      ? product.images
      : product.image_url
      ? [product.image_url]
      : []

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '20px'
    }}>
      <h1>{product.name}</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px'
      }}>
        <div>
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              style={{
                width: '100%',
                marginBottom: '15px',
                borderRadius: '8px'
              }}
            />
          ))}
        </div>

        <div>
          <h2>
            ${Number(product.price).toLocaleString()}
          </h2>

          <h3>Descripción</h3>
          <p>
            {product.description || 'Sin descripción'}
          </p>

          <h3>Especificaciones</h3>

          <pre style={{
            whiteSpace: 'pre-wrap'
          }}>
            {JSON.stringify(
              product.specifications,
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  )
}