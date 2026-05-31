'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import styles from './admin.module.css'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const EMPTY_FORM = { name: '', price: '', old_price: '', category: 'mujer', tag: '', image_file: null }

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  function login(e) {
    e.preventDefault()
    if (secret.trim()) setAuthed(true)
  }

  async function loadProducts() {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
  }

  useEffect(() => { if (authed) loadProducts() }, [authed])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    let image_url = null

    if (form.image_file) {
      const file = form.image_file
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file, { contentType: file.type })

      if (uploadError) {
        setMsg(`❌ Error subiendo imagen: ${uploadError.message}`)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

      image_url = urlData.publicUrl
    }

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        category: form.category,
        tag: form.tag || null,
        image_url,
        active: true,
      })
    })

    setLoading(false)

    if (res.ok) {
      setMsg('✅ Producto agregado')
      setForm(EMPTY_FORM)
      loadProducts()
    } else {
      const err = await res.json()
      setMsg(`❌ Error: ${err.error}`)
    }
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleDelete(id, name) {
    if (!confirm(`¿Eliminar "${name}"?`)) return
    await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ id })
    })
    loadProducts()
  }

  if (!authed) return (
    <div className={styles.loginWrap}>
      <form className={styles.loginBox} onSubmit={login}>
        <h1>ADMIN</h1>
        <p>Ingresa la clave de acceso</p>
        <input type="password" placeholder="Clave admin" value={secret} onChange={e => setSecret(e.target.value)} autoFocus />
        <button type="submit">Entrar →</button>
      </form>
    </div>
  )

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <span className={styles.logo}>VLTD — Admin</span>
        <button className={styles.logoutBtn} onClick={() => setAuthed(false)}>Cerrar sesión</button>
      </header>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h2>Nuevo producto</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label>Nombre *
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ej: Chamarra Oversized" />
            </label>
            <label>Precio *
              <input required type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="799" />
            </label>
            <label>Precio anterior (opcional)
              <input type="number" value={form.old_price} onChange={e => setForm({...form, old_price: e.target.value})} placeholder="999" />
              </label>
            <label>Categoría
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="mujer">Mujer</option>
                <option value="hombre">Hombre</option>
                <option value="acc">Accesorios</option>
              </select>
            </label>
            <label>Etiqueta
              <select value={form.tag} onChange={e => setForm({...form, tag: e.target.value})}>
                <option value="">Sin etiqueta</option>
                <option value="new">Nuevo</option>
                <option value="sale">Sale</option>
              </select>
            </label>
            <label>Imagen del producto
              <input type="file" accept="image/*" onChange={e => setForm({...form, image_file: e.target.files?.[0] || null})} />
            </label>
            {msg && <div className={styles.msg}>{msg}</div>}
            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading ? 'Subiendo...' : '+ Agregar producto'}
            </button>
          </form>
        </aside>
        <main className={styles.main}>
          <h2>Productos ({products.length})</h2>
          {products.length === 0
            ? <p className={styles.empty}>No hay productos aún.</p>
            : <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Etiqueta</th><th>Imagen</th><th></th></tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.category}</td>
                        <td>${Number(p.price).toLocaleString()}</td>
                        <td>{p.tag || '—'}</td>
                        <td>{p.image_url ? <img src={p.image_url} style={{width:50,height:60,objectFit:'cover'}} /> : '—'}</td>
                        <td><button className={styles.btnDelete} onClick={() => handleDelete(p.id, p.name)}>Eliminar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </main>
      </div>
    </div>
  )
}