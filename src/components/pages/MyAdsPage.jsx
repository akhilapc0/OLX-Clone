import { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { ItemsContext } from '../Context/Item'
import { UserAuth } from '../Context/Auth'
import { Link } from 'react-router-dom'
import { deleteProduct } from '../Firebase/Firebase'
import { toast } from 'react-toastify'
import Login from '../Modal/Login'
import Sell from '../Modal/Sell'

const MyAdsPage = () => {
  const { items, setItems } = ItemsContext()
  const { user } = UserAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showSell, setShowSell] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const myAds = items.filter(item => item.userId === user?.uid)

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      setItems(prev => prev.filter(item => item.id !== id))
      toast.success("Ad deleted successfully")
    } catch {
      toast.error("Failed to delete ad")
    }
  }

  return (
    <div className='bg-[#f2f4f5] min-h-screen'>
      <Navbar
        toggleModal={() => setShowLogin(p => !p)}
        toggleModalSell={() => setShowSell(p => !p)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className='pt-[120px] px-5 sm:px-10 md:px-20 lg:px-40'>
        <h1 className="text-[24px] text-[#002f34] mb-4">My Ads</h1>

        {myAds.length === 0 ? (
          <div className='flex flex-col items-center mt-20'>
            <p className='text-5xl mb-4'>📦</p>
            <p className='text-gray-500 font-semibold'>You have no ads yet</p>
            <button onClick={() => setShowSell(true)} className='mt-4 bg-[#002f34] text-white px-6 py-2 rounded'>
              Post an Ad
            </button>
          </div>
        ) : (
          <div className='grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {myAds.map((item) => (
              <div key={item.id} className='relative w-full rounded-[4px] border border-[#ccd5d6] bg-white overflow-hidden flex flex-col p-3 min-h-[280px]'>
                <Link to='/details' state={{ item }}>
                  <div className='w-full h-[160px] overflow-hidden mb-2'>
                    <img className='w-full h-full object-cover' src={item.imageUrl || 'https://via.placeholder.com/150'} alt={item.title} />
                  </div>
                  <h2 className="font-bold text-[20px] text-[#002f34]">₹ {item.price}</h2>
                  <p className="text-[14px] text-[#406367] truncate">{item.title}</p>
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className='mt-2 w-full bg-red-500 text-white py-1 rounded text-sm hover:bg-red-600'
                >
                  Delete Ad
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Login toggleModal={() => setShowLogin(p => !p)} status={showLogin} />
      <Sell toggleModalSell={() => setShowSell(p => !p)} status={showSell} setItems={setItems} />
    </div>
  )
}

export default MyAdsPage