import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTableByToken, getProducts, getSettings, placeOrder } from '../services/api'
import ProductCard from '../components/ProductCard'
import BottomNav from '../components/BottomNav'
import CartItem from '../components/CartItem'
import { ShoppingCart, MapPin, Send, Utensils, Wine, IceCream, LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react'

function DeliveryPage() {
  const { token } = useParams()
  const navigate  = useNavigate()

  const [table,    setTable]    = useState(null)
  const [products, setProducts] = useState({})
  const [settings, setSettings] = useState(null)
  const [cart,     setCart]     = useState([])
  const [category, setCategory] = useState('all')
  const [loading,  setLoading]  = useState(true)
  const [step,     setStep]     = useState('menu') // menu | checkout
  const [placing,  setPlacing]  = useState(false)
  const [error,    setError]    = useState(null)

  // Form fields
  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [email,   setEmail]   = useState('')
  const [address, setAddress] = useState('')
  const [notes,   setNotes]   = useState('')
  const [payment, setPayment] = useState('')
  const [lat,     setLat]     = useState(null)
  const [lng,     setLng]     = useState(null)

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
        if (settingsRes.data.data.payment_methods?.length > 0) {
          setPayment(settingsRes.data.data.payment_methods[0])
        }
      } catch {
        setError('Service unavailable.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    // Get GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLat(pos.coords.latitude)
          setLng(pos.coords.longitude)
        },
        () => {} // silent fail
      )
    }
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

  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    )
  }

  const getCartCount = () => cart.reduce((sum, i) => sum + i.quantity, 0)
  const getCartTotal = () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const getTotal     = () => getCartTotal() + parseFloat(settings?.delivery_fee ?? 0)

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

  const handleOrder = async () => {
    if (!name || !phone || !address || !payment) {
      setError('Please fill in all required fields.')
      return
    }
    setPlacing(true)
    setError(null)
    try {
      const res = await placeOrder({
        type:             'delivery',
        table_id:         table.id,
        customer_name:    name,
        notes,
        payment_method:   payment,
        delivery_address: address,
        delivery_phone:   phone,
        delivery_email:   email || null,
        delivery_lat:     lat,
        delivery_lng:     lng,
        items: cart.map(i => ({
          product_id: i.id,
          quantity:   i.quantity,
        })),
      })
      navigate(`/order/${res.data.data.id}`, {
        state: { order: res.data.data }
      })
    } catch {
      setError('Failed to place order. Please try again.')
      setPlacing(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Utensils size={40} className="text-red-400 animate-bounce" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-36">

      {/* Header */}
      <nav className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Delivery</p>
            <p className="text-sm font-bold text-gray-800">{settings?.name}</p>
          </div>
          {getCartCount() > 0 && (
            <button
              onClick={() => setStep(step === 'menu' ? 'checkout' : 'menu')}
              className="flex items-center gap-2 bg-red-50 text-red-500
                         px-3 py-1.5 rounded-full text-sm font-semibold"
            >
              <ShoppingCart size={16} />
              {getCartCount()} · ${getCartTotal().toFixed(2)}
              {step === 'menu' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          )}
        </div>
      </nav>

      {step === 'menu' && (
        <>
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
                  {cat === 'all' ? 'All' : cat === 'food' ? 'Food' : cat === 'drink' ? 'Drinks' : 'Desserts'}
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="max-w-2xl mx-auto px-4 py-6">
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

          {getCartCount() > 0 && (
            <div className="fixed bottom-20 left-0 right-0 flex justify-center px-4 z-20">
              <button
                onClick={() => setStep('checkout')}
                className="bg-red-500 text-white px-6 py-4 rounded-2xl shadow-lg
                           flex items-center gap-3 font-semibold text-sm w-full max-w-sm
                           hover:bg-red-600 transition active:scale-95"
              >
                <span className="bg-white text-red-500 rounded-full w-6 h-6
                                 flex items-center justify-center text-xs font-bold">
                  {getCartCount()}
                </span>
                <span className="flex-1 text-left">Proceed to checkout</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </button>
            </div>
          )}
        </>
      )}

      {step === 'checkout' && (
        <div className="max-w-2xl mx-auto px-4 py-6">

          {/* Cart summary */}
          <div className="bg-white rounded-2xl shadow-sm divide-y mb-4">
            {cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={() => updateQty(item.id, +1)}
                onDecrease={() => updateQty(item.id, -1)}
              />
            ))}
            {settings?.delivery_fee > 0 && (
              <div className="px-4 py-3 flex justify-between text-sm text-gray-500">
                <span>Delivery fee</span>
                <span>${parseFloat(settings.delivery_fee).toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Delivery form */}
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 space-y-3">
            <h3 className="font-semibold text-gray-700">Delivery Info</h3>

            <input type="text" placeholder="Full name *" value={name}
                   onChange={e => setName(e.target.value)}
                   className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm
                              focus:outline-none focus:border-red-400" />

            <input type="tel" placeholder="Phone *" value={phone}
                   onChange={e => setPhone(e.target.value)}
                   className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm
                              focus:outline-none focus:border-red-400" />

            <input type="email" placeholder="Email (optional)" value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm
                              focus:outline-none focus:border-red-400" />

            <div className="relative">
              <textarea
                placeholder="Delivery address *" value={address}
                onChange={e => setAddress(e.target.value)} rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm
                           focus:outline-none focus:border-red-400 resize-none"
              />
              {lat && lng && (
                <span className="absolute right-3 top-2 text-xs text-green-500 flex items-center gap-1">
                  <MapPin size={12} /> GPS captured
                </span>
              )}
            </div>

            <textarea placeholder="Notes (optional)" value={notes}
                      onChange={e => setNotes(e.target.value)} rows={2}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm
                                 focus:outline-none focus:border-red-400 resize-none" />
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <h3 className="font-semibold text-gray-700 mb-3">Payment Method</h3>
            <div className="grid grid-cols-2 gap-2">
              {(settings?.payment_methods ?? []).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPayment(method)}
                  className={`py-2 px-3 rounded-xl border text-sm font-medium transition
                    ${payment === method
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        </div>
      )}

      {/* Fixed bottom checkout button */}
      {step === 'checkout' && cart.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t px-4 py-4 z-20">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-gray-900 text-lg">${getTotal().toFixed(2)}</span>
            </div>
            <button
              onClick={handleOrder}
              disabled={placing}
              className="w-full bg-red-500 text-white py-4 rounded-2xl font-semibold
                         flex items-center justify-center gap-2
                         hover:bg-red-600 transition active:scale-95
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              {placing ? 'Placing order...' : 'Place delivery order'}
            </button>
          </div>
        </div>
      )}

      <BottomNav deliveryEnabled={settings?.delivery_enabled} />
    </div>
  )
}

export default DeliveryPage