import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Home, UtensilsCrossed, Bike } from 'lucide-react'

function BottomNav({ deliveryEnabled }) {
  const { token } = useParams()
  const navigate  = useNavigate()
  const location  = useLocation()

  const tabs = [
    {
      label: 'Home',
      icon:  Home,
      path:  `/menu/${token}`,
    },
    {
      label: 'Menu',
      icon:  UtensilsCrossed,
      path:  `/menu/${token}/carta`,
    },
    ...(deliveryEnabled ? [{
      label: 'Delivery',
      icon:  Bike,
      path:  `/menu/${token}/delivery`,
    }] : []),
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-30">
      <div className="max-w-2xl mx-auto flex">
        {tabs.map(tab => {
          const Icon    = tab.icon
          const active  = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-medium transition
                ${active
                  ? 'text-red-500 border-t-2 border-red-500'
                  : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Icon size={20} />
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav