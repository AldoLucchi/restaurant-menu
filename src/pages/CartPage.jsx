import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { placeOrder } from '../services/api'
import CartItem from '../components/CartItem'
import { ArrowLeft, ShoppingCart, Send } from 'lucide-react'

function CartPage() {
  const { token } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const [cart, setCart]         = useState(state?.cart || [])
  const [customerName, setName] = useState('')
  const [notes, setNotes]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const table = state?.table

  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    )
  }

  const getTotal = () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handleOrder = async () => {
    if (cart.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const res = await placeOrder({
        table_id:      table.id,
        customer_name: customerName || null,
        notes:         notes || null,
        items: cart.map(i => ({
          product_id: i.id,
          quantity:   i.quantity,
        })),
      })
      navigate(`/order/${res.data.data.id}`, {
        state: { order: res.data.data }
      })
    } catch (err) {
      setError('Failed to place order. Please try again.')
      setLoading(false)
    }
  }

  if (!state) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">No cart data found.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">Your cart</p>
            <p className="text-xs text-gray-400">{table?.name}</p>
          </div>
          <ShoppingCart size={20} className="text-gray-400" />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-40">

        {/* Items */}
        {cart.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm divide-y mb-4">
            {cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={() => updateQty(item.id, +1)}
                onDecrease={() => updateQty(item.id, -1)}
              />
            ))}
          </div>
        )}

        {/* Customer name */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. John"
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm
                       focus:outline-none focus:border-red-400"
          />
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Allergies, special requests..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm
                       focus:outline-none focus:border-red-400 resize-none"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
      </div>

      {/* Fixed bottom */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-4 z-20">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-gray-900 text-lg">
                ${getTotal().toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full bg-red-500 text-white py-4 rounded-2xl font-semibold
                         flex items-center justify-center gap-2
                         hover:bg-red-600 transition active:scale-95
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              {loading ? 'Placing order...' : 'Place order'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage