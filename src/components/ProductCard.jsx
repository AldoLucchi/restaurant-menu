import { Plus, Utensils, Wine, IceCream } from 'lucide-react'

function ProductCard({ product, quantity, onAdd }) {
  const CategoryIcon = () => {
    if (product.category === 'food')    return <Utensils size={32} className="text-gray-300" />
    if (product.category === 'drink')   return <Wine size={32} className="text-gray-300" />
    return <IceCream size={32} className="text-gray-300" />
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Image */}
      <div className="bg-gray-100 h-32 flex items-center justify-center">
        {product.image
          ? <img
              src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/storage/${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          : <CategoryIcon />
        }
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm font-semibold text-gray-800 leading-tight">
          {product.name}
        </p>
        {product.description && (
          <p className="text-xs text-gray-400 mt-1 leading-tight line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <button
            onClick={onAdd}
            className="bg-red-500 text-white rounded-full w-7 h-7
                       flex items-center justify-center
                       hover:bg-red-600 transition active:scale-95"
          >
            {quantity > 0
              ? <span className="text-xs font-bold">{quantity}</span>
              : <Plus size={16} />
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard