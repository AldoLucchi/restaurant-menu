import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getOrder } from '../services/api'
import { CheckCircle, Clock, ChefHat, Bell, XCircle, ArrowLeft } from 'lucide-react'

function ConfirmPage() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const [order, setOrder] = useState(state?.order || null)
  const [loading, setLoading] = useState(!state?.order)

  useEffect(() => {
    if (!state?.order) {
      getOrder(id).then(res => {
        setOrder(res.data.data)
        setLoading(false)
      })
    }
  }, [id])

  // Poll status every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getOrder(id).then(res => setOrder(res.data.data))
    }, 15000)
    return () => clearInterval(interval)
  }, [id])

  const statusConfig = {
    pending:   { icon: Clock,       color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Order received'   },
    preparing: { icon: ChefHat,     color: 'text-blue-500',   bg: 'bg-blue-50',   label: 'Being prepared'   },
    ready:     { icon: Bell,        color: 'text-green-500',  bg: 'bg-green-50',  label: 'Ready to serve!'  },
    delivered: { icon: CheckCircle, color: 'text-gray-500',   bg: 'bg-gray-50',   label: 'Delivered'        },
    cancelled: { icon: XCircle,     color: 'text-red-500',    bg: 'bg-red-50',    label: 'Cancelled'        },
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">Loading order...</p>
    </div>
  )

  const config = statusConfig[order?.status] || statusConfig.pending
  const StatusIcon = config.icon

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <p className="text-sm font-bold text-gray-800">Order #{order?.id}</p>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Status card */}
        <div className={`${config.bg} rounded-2xl p-6 text-center mb-6`}>
          <StatusIcon size={48} className={`${config.color} mx-auto mb-3`} />
          <p className={`text-lg font-bold ${config.color}`}>{config.label}</p>
          <p className="text-xs text-gray-400 mt-1">
            Updates automatically every 15 seconds
          </p>
        </div>

        {/* Order info */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400">Table</p>
              <p className="font-semibold text-gray-800">{order?.table?.name}</p>
            </div>
            {order?.customer_name && (
              <div className="text-right">
                <p className="text-xs text-gray-400">Name</p>
                <p className="font-semibold text-gray-800">{order.customer_name}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="divide-y">
            {order?.items?.map(item => (
              <div key={item.id} className="py-2 flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.quantity}x {item.product?.name}
                </span>
                <span className="font-semibold text-gray-900">
                  ${parseFloat(item.subtotal).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 mt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-red-500">${parseFloat(order?.total).toFixed(2)}</span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400">
          Show this screen to your waiter if needed
        </p>
      </div>
    </div>
  )
}

export default ConfirmPage