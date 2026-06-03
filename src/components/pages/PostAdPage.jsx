import { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Sell from '../Modal/Sell'
import { ItemsContext } from '../Context/Item'
import Login from '../Modal/Login'

const PostAdPage = () => {
  const { setItems } = ItemsContext()
  const [showSell, setShowSell] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
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

export default PostAdPage