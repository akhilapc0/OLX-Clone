import { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { useWishlist } from '../Context/Wishlist'
import { ItemsContext } from '../Context/Item'
import { Link } from 'react-router-dom'
import Login from '../Modal/Login'
import Sell from '../Modal/Sell'

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist()
  const { items, setItems } = ItemsContext()
  const [showLogin, setShowLogin] = useState(false)
  const [showSell, setShowSell] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Only show wishlist items that still exist in Firestore
  const validWishlist = wishlist.filter(wishItem =>
    items.some(firestoreItem => firestoreItem.id === wishItem.id)
  )

  return (
    <div className='bg-[#f2f4f5] min-h-screen'>
      <Navbar
        toggleModal={() => setShowLogin(p => !p)}
        toggleModalSell={() => setShowSell(p => !p)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className='pt-[120px] px-5 sm:px-10 md:px-20 lg:px-40'>
        <h1 className="text-[24px] text-[#002f34] mb-4 font-bold">My Wishlist</h1>

        {validWishlist.length === 0 ? (
          <div className='flex flex-col items-center justify-center mt-20'>
            <p className='text-5xl mb-4'>❤️</p>
            <p className='text-gray-500 font-semibold'>Your wishlist is empty</p>
            <Link to='/' className='mt-4 text-teal-600 underline'>Browse products</Link>
          </div>
        ) : (
          <div className='grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {validWishlist.map((item) => (
              <div key={item.id} className='relative rounded-[4px] border border-[#ccd5d6] bg-white overflow-hidden flex flex-col p-3'>
                <Link to='/details' state={{ item }} className='hover:no-underline'>
                  <div className='w-full h-[160px] overflow-hidden mb-2'>
                    <img className='w-full h-full object-cover'
                      src={item.imageUrl || 'https://via.placeholder.com/150'} alt={item.title} />
                  </div>
                  <h2 className="font-bold text-[20px] text-[#002f34]">₹ {item.price}</h2>
                  <p className="text-[14px] text-[#406367] truncate">{item.title}</p>
                  <div className="flex justify-between text-[12px] text-[#728889] uppercase pt-2">
                    <span>{item.category}</span>
                    <span>TODAY</span>
                  </div>
                </Link>
                {/* Remove from wishlist button */}
                <button
                  onClick={() => toggleWishlist(item)}
                  className='mt-2 w-full border border-red-400 text-red-500 py-1 rounded text-sm hover:bg-red-50'
                >
                  Remove from Wishlist
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

export default WishlistPage