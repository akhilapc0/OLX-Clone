import { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Login from '../Modal/Login'
import { ItemsContext } from '../Context/Item'
import Sell from '../Modal/Sell'

const LoginPage = () => {
  const { setItems } = ItemsContext()
  const [showLogin, setShowLogin] = useState(true)
  const [showSell, setShowSell] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className='bg-[#f2f4f5] min-h-screen'>
      <Navbar
        toggleModal={() => setShowLogin(p => !p)}
        toggleModalSell={() => setShowSell(p => !p)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Login toggleModal={() => setShowLogin(p => !p)} status={showLogin} />
      <Sell toggleModalSell={() => setShowSell(p => !p)} status={showSell} setItems={setItems} />
    </div>
  )
}

export default LoginPage