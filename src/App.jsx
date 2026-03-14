import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import ConfirmPage from './pages/ConfirmPage'
import DeliveryPage from './pages/DeliveryPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/menu/:token"          element={<HomePage />} />
      <Route path="/menu/:token/carta"    element={<MenuPage />} />
      <Route path="/menu/:token/delivery" element={<DeliveryPage />} />
      <Route path="/menu/:token/cart"     element={<CartPage />} />
      <Route path="/order/:id"            element={<ConfirmPage />} />
      <Route path="*"                     element={<NotFoundPage />} />
    </Routes>
  )
}

export default App