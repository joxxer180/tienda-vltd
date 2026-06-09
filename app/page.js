'use client'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

const CATEGORIES = ['todos', 'mujer', 'hombre', 'acc']
const CAT_LABEL = { mujer: 'Mujer', hombre: 'Hombre', acc: 'Accesorios', todos: 'Todos' }

export default function StorePage() {
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('todos')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')

useEffect(() => {
  fetch('/api/products', {
    cache: 'no-store'
  })
    .then(r => r.json())
    .then(res => {
      console.log('API:', res)
      setProducts(res)
    })
    .catch(err => {
      console.error(err)
      setProducts([])
    })
}, [])

  const filtered = filter === 'todos' ? products : products.filter(p => p.category === filter)
console.log('PRODUCTS STATE:', products)
console.log('FILTERED:', filtered)
  function addToCart(product) {
    setCart(prev => {
      const ex = prev.find(x => x.id === product.id)
      if (ex) return prev.map(x => x.id === product.id ? { ...x, qty: x.qty + 1 } : x)
      return [...prev, { ...product, qty: 1 }]
    })
    showToast(`${product.name} agregado`)
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(x => x.id !== id))
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const cartCount = cart.reduce((s, x) => s + x.qty, 0)
  const cartTotal = cart.reduce((s, x) => s + x.price * x.qty, 0)

  return (
    <>
      <nav className={styles.nav}>
        <a className={styles.logo} href="#">VENTAS ISRAEL</a>
        <ul className={styles.navLinks}>
          {['Nuevos', 'Mujer', 'Hombre', 'Accesorios', 'Sale'].map(l => (
            <li key={l}><a href="#">{l}</a></li>
          ))}
        </ul>
        <button className={styles.cartBtn} onClick={() => setCartOpen(true)}>
          🛒
          {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
        </button>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Nueva colección — 2026</p>
          <h1 className={styles.heroTitle}>ESTILO<br />SIN <em>límites</em></h1>
          <p className={styles.heroSub}>No sigas tendencias. Crea tu propio camino y deja tu huella.</p>
          <a href="#catalogo" className={styles.btnPrimary}>Ver colección →</a>
        </div>
        <div className={styles.heroImg}>
          {/*<span className={styles.heroImgLabel}>VLTD</span>*/}
          <div className={styles.heroBadge}>
            <span>-30%</span>
            <span>En selección</span>
          </div>
        </div>
      </section>

      <div className={styles.ticker}>
        <div className={styles.tickerInner}>
          {['Nueva colección', 'Envío gratis +$999', 'Devoluciones 30 días', 'Pago seguro',
            'Nueva colección', 'Envío gratis +$999', 'Devoluciones 30 días', 'Pago seguro'].map((t, i) => (
            <span key={i} className={styles.tickerItem}>◆ {t.toUpperCase()}</span>
          ))}
        </div>
      </div>

      <div id="catalogo">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>TENEMOS LO MEJOR<br /><em>para ti</em></h2>
          <div className={styles.filterBar}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`${styles.filterBtn} ${filter === c ? styles.active : ''}`}
                onClick={() => setFilter(c)}
              >{CAT_LABEL[c]}</button>
            ))}
          </div>
        </div>
        <div className={styles.productsSection}>
          {filtered.length === 0
            ? <p className={styles.empty}>No hay productos aún.</p>
            : <div className={styles.grid}>
                {filtered.map(p => (
                  <div key={p.id} className={styles.card}>
                    <div className={styles.cardImg}>
                      {p.images?.length > 0
  ? <img src={p.images[0]} alt={p.name} />
  : p.image_url
    ? <img src={p.image_url} alt={p.name} />
    : <span className={styles.cardImgLabel}>
        {p.name.split(' ')[0].toUpperCase()}
      </span>
}
                      {p.
tag && <span className={`${styles.tag} ${p.tag === 'new' ? styles.tagNew : ''}`}>{p.tag === 'new' ? 'Nuevo' : 'Sale'}</span>}
                      <div className={styles.cardActions}>
  <button
    className={styles.btnAdd}
    onClick={() => window.location.href = `/producto/${p.id}`}
  >
    Ver producto
  </button>

  <button
    className={styles.btnWish}
    onClick={() => addToCart(p)}
  >
    🛒
  </button>
</div>
                    </div>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardCategory}>{CAT_LABEL[p.category] || p.category}</div>
                      <div className={styles.cardName}>{p.name}</div>
                      <div className={styles.cardPrice}>
                        <span>${Number(p.price).toLocaleString()}</span>
                        {p.old_price && <span className={styles.oldPrice}>${Number(p.old_price).toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      <div className={`${styles.overlay} ${cartOpen ? styles.overlayOpen : ''}`} onClick={() => setCartOpen(false)} />
      <div className={`${styles.drawer} ${cartOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <h2>CARRITO</h2>
          <button onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div className={styles.drawerItems}>
          {cart.length === 0
            ? <p className={styles.cartEmpty}>Tu carrito está vacío</p>
            : cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.cartItemImg} />
                <div>
                  <div className={styles.cartItemName}>{item.name}</div>
                  <div className={styles.cartItemPrice}>${item.price.toLocaleString()} × {item.qty}</div>
                </div>
                <button className={styles.cartItemRemove} onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))
          }
        </div>
        <div className={styles.drawerFooter}>
          <div className={styles.drawerTotal}>
            <span>Total</span>
            <span>${cartTotal.toLocaleString()}</span>
          </div>
          <button
  className={styles.btnCheckout}
  onClick={() => {
  const mensaje =
    "Hola, quiero realizar un pedido:\n\n" +
    cart
      .map(
        item =>
          `• ${item.name} x${item.qty} - $${(
            item.price * item.qty
          ).toLocaleString()}`
      )
      .join("\n") +
    `\n\nTotal: $${cartTotal.toLocaleString()}`;

  window.open(
    `https://wa.me/528135872190?text=${encodeURIComponent(mensaje)}`,
    "_blank"
  );
}}
>
  REALIZAR PEDIDO
</button>
        </div>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}

      <footer className={styles.footer}>
        <span className={styles.footerLogo}>VLTD</span>
        <span>© 2026 VLTD — Todos los derechos reservados</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#">Instagram</a>
          <a href="#">WhatsApp</a>
        </div>
      </footer>
    </>
  )
}                      