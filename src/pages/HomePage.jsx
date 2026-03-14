import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getTableByToken, getSettings } from '../services/api'
import BottomNav from '../components/BottomNav'
import { MapPin, Facebook, Instagram, MessageCircle, Utensils } from 'lucide-react'

function HomePage() {
  const { token } = useParams()

  const [table,    setTable]    = useState(null)
  const [settings, setSettings] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tableRes, settingsRes] = await Promise.all([
          getTableByToken(token),
          getSettings(),
        ])
        setTable(tableRes.data.data)
        setSettings(settingsRes.data.data)
      } catch {
        setError('Table not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

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
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Cover */}
      <div className="relative h-48 bg-gradient-to-br from-red-400 to-red-600">
        {settings?.cover && (
          <img src={settings.cover} alt="cover"
               className="w-full h-full object-cover absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Logo + Info */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex flex-col items-center -mt-16 relative z-10">

          {/* Logo */}
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg
                          bg-white flex items-center justify-center overflow-hidden">
            {settings?.logo
              ? <img src={settings.logo} alt="logo"
                     className="w-full h-full object-cover" />
              : <Utensils size={40} className="text-red-400" />
            }
          </div>

          {/* Name */}
          <h1 className="text-2xl font-bold text-gray-800 mt-3">
            {settings?.name ?? 'Restaurant'}
          </h1>

          {/* Table */}
          <p className="text-sm text-gray-400 mt-1">
            {table?.name}
          </p>

          {/* Address */}
          {settings?.address && (
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <MapPin size={12} /> {settings.address}
            </p>
          )}

          {/* Social links */}
          <div className="flex items-center gap-4 mt-4">
            {settings?.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noreferrer"
                 className="w-10 h-10 rounded-full bg-blue-500 text-white
                            flex items-center justify-center hover:bg-blue-600 transition">
                <Facebook size={18} />
              </a>
            )}
            {settings?.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noreferrer"
                 className="w-10 h-10 rounded-full bg-pink-500 text-white
                            flex items-center justify-center hover:bg-pink-600 transition">
                <Instagram size={18} />
              </a>
            )}
            {settings?.whatsapp_number && (
              <a href={`https://wa.me/${settings.whatsapp_number}`}
                 target="_blank" rel="noreferrer"
                 className="w-10 h-10 rounded-full bg-green-500 text-white
                            flex items-center justify-center hover:bg-green-600 transition">
                <MessageCircle size={18} />
              </a>
            )}
          </div>

          {/* Quick actions */}
          <div className="w-full mt-6 grid grid-cols-1 gap-3">
            {settings?.whatsapp_number && (
              <a href={`https://wa.me/${settings.whatsapp_number}`}
                 target="_blank" rel="noreferrer"
                 className="flex items-center justify-center gap-2 bg-green-500 text-white
                            py-3 rounded-xl font-semibold hover:bg-green-600 transition">
                <MessageCircle size={18} />
                Contact on WhatsApp
              </a>
            )}
            {settings?.address && (
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(settings.address)}`}
                 target="_blank" rel="noreferrer"
                 className="flex items-center justify-center gap-2 bg-white border border-gray-200
                            text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
                <MapPin size={18} />
                View location
              </a>
            )}
          </div>
        </div>
      </div>

      <BottomNav deliveryEnabled={settings?.delivery_enabled} />
    </div>
  )
}

export default HomePage