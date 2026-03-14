import { ShoppingCart } from 'lucide-react'

function Navbar({ tableName, cartCount, cartTotal, onCartClick }) {
  return (
    <nav className="sticky top-0 z-20 bg-white border-b shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            Restaurant
          </p>
          <p className="text-sm font-bold text-gray-800">
            {tableName ?? 'Loading...'}
          </p>
        </div>
        {cartCount > 0 && (
          <button
            onClick={onCartClick}
            className="flex items-center gap-2 bg-red-50 text-red-500
                       px-3 py-1.5 rounded-full text-sm font-semibold
                       hover:bg-red-100 transition"
          >
            <ShoppingCart size={16} />
            {cartCount} · ${cartTotal.toFixed(2)}
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar