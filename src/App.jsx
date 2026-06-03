import { Route, Routes } from 'react-router-dom'
import Home from './components/Pages/Home'
import Details from './components/Details/Details'
import WishlistPage from './components/Pages/WishlistPage'
import LoginPage from './components/Pages/LoginPage'
import PostAdPage from './components/Pages/PostAdPage'
import MyAdsPage from './components/Pages/MyAdsPage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/details' element={<Details />} />
        <Route path='/wishlist' element={<WishlistPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/post' element={<PostAdPage />} />
        <Route path='/my-ads' element={<MyAdsPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App