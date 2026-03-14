import { Routes, Route } from 'react-router-dom'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import ConfirmPage from './pages/ConfirmPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/menu/:token"     element={<MenuPage />} />
      <Route path="/menu/:token/cart" element={<CartPage />} />
      <Route path="/order/:id"       element={<ConfirmPage />} />
      <Route path="*"                element={<NotFoundPage />} />
    </Routes>
  )
}

export default App