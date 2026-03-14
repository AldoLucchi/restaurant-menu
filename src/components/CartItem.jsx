import { Plus, Minus } from 'lucide-react'

function CartItem({ item, onIncrease, onDecrease }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{item.name}</p>
        <p className="text-xs text-gray-400">
          ${parseFloat(item.price).toFixed(2)} each
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onDecrease}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center
                     justify-center text-gray-500 hover:bg-gray-50 transition"
        >
          <Minus size={14} />
        </button>
        <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
        <button
          onClick={onIncrease}
          className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center
                     justify-center hover:bg-red-600 transition"
        >
          <Plus size={14} />
        </button>
      </div>
      <p className="text-sm font-bold text-gray-900 w-14 text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  )
}

export default CartItem