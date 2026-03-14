import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTableByToken, getProducts, getSettings } from '../services/api'
import ProductCard from '../components/ProductCard'
import BottomNav from '../components/BottomNav'
import { ShoppingCart, Utensils, Wine, IceCream, LayoutGrid } from 'lucide-react'

function MenuPage() {
  const { token } = useParams()
  const navigate  = useNavigate()

  const [table,    setTable]    = useState(null)
  const [products, setProducts] = useState({})
  const [settings, setSettings] = useState(null)
  const [cart,     setCart]     = useState([])
  const [category, setCategory] = useState('all')
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tableRes, productsRes, settingsRes] = await Promise.all([
          getTableByToken(token),
          getProducts(),
          getSettings(),
        ])
        setTable(tableRes.data.data)
        setProducts(productsRes.data.data)
        setSettings(settingsRes.data.data)
      } catch {
        setError('Menu unavailable.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const getCartCount = () => cart.reduce((sum, i) => sum + i.quantity, 0)
  const getCartTotal = () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const categories = ['all', ...Object.keys(products)]

  const filteredProducts = category === 'all'
    ? Object.values(products).flat()
    : products[category] || []

  const categoryIcon = (cat) => {
    if (cat === 'all')   return <LayoutGrid size={14} />
    if (cat === 'food')  return <Utensils size={14} />
    if (cat === 'drink') return <Wine size={14} />
    return <IceCream size={14} />
  }

  const categoryLabel = (cat) => {
    if (cat === 'all')   return 'All'
    if (cat === 'food')  return 'Food'
    if (cat === 'drink') return 'Drinks'
    return 'Desserts'
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Utensils size={40} className="text-red-400 animate-bounce" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">{error}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <nav className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {settings?.name}
            </p>
            <p className="text-sm font-bold text-gray-800">{table?.name}</p>
          </div>
          {getCartCount() > 0 && (
            <button
              onClick={() => navigate(`/menu/${token}/cart`, { state: { cart, table, settings } })}
              className="flex items-center gap-2 bg-red-50 text-red-500
                         px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-red-100 transition"
            >
              <ShoppingCart size={16} />
              {getCartCount()} · ${getCartTotal().toFixed(2)}
            </button>
          )}
        </div>
      </nav>

      {/* Category tabs */}
      <div className="sticky top-16 z-10 bg-white border-b shadow-sm">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm
                          font-medium whitespace-nowrap transition
                ${category === cat
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {categoryIcon(cat)}
              {categoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-36">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cart.find(i => i.id === product.id)?.quantity || 0}
              onAdd={() => addToCart(product)}
            />
          ))}
        </div>
      </div>

      {/* Floating cart button */}
      {getCartCount() > 0 && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center px-4 z-20">
          <button
            onClick={() => navigate(`/menu/${token}/cart`, { state: { cart, table, settings } })}
            className="bg-red-500 text-white px-6 py-4 rounded-2xl shadow-lg
                       flex items-center gap-3 font-semibold text-sm w-full max-w-sm
                       hover:bg-red-600 transition active:scale-95"
          >
            <span className="bg-white text-red-500 rounded-full w-6 h-6
                             flex items-center justify-center text-xs font-bold">
              {getCartCount()}
            </span>
            <span className="flex-1 text-left">View cart</span>
            <ShoppingCart size={18} />
            <span>${getCartTotal().toFixed(2)}</span>
          </button>
        </div>
      )}

      <BottomNav deliveryEnabled={settings?.delivery_enabled} />
    </div>
  )
}

export default MenuPage