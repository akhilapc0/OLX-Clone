
import { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Card from '../Card/Card'
import { ItemsContext } from '../Context/Item'
import Login from '../Modal/Login'
import Sell from '../Modal/Sell'

const Home = () => {
  const { items, setItems, loading, error } = ItemsContext()
  const [showLogin, setShowLogin] = useState(false)
  const [showSell, setShowSell] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleModal = () => setShowLogin(prev => !prev)
  const toggleModalSell = () => setShowSell(prev => !prev)

  const filteredItems = items.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='bg-[#f2f4f5] min-h-screen'>
      <Navbar
        toggleModal={toggleModal}
        toggleModalSell={toggleModalSell}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className='pt-[120px] px-5 sm:px-10 md:px-20 lg:px-40'>
        <Card items={filteredItems} loading={loading} error={error} />
      </div>
      <Login toggleModal={toggleModal} status={showLogin} />
      <Sell toggleModalSell={toggleModalSell} status={showSell} setItems={setItems} />
    </div>
  )
}

export default Home