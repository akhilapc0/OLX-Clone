import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './components/Context/Auth.jsx'
import { ItemsContextProvider } from './components/Context/Item.jsx'
import { WishlistProvider } from './components/Context/Wishlist.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ItemsContextProvider>
      <WishlistProvider>
        <AuthProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </AuthProvider>
      </WishlistProvider>
    </ItemsContextProvider>
  </BrowserRouter>
)