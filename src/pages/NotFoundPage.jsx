import { useNavigate } from 'react-router-dom'
import { SearchX } from 'lucide-react'

function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <SearchX size={48} className="text-gray-300 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-700 mb-2">Page not found</h1>
        <p className="text-gray-400 text-sm mb-6">
          The page you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold"
        >
          Go back
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage