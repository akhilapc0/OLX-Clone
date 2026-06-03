
import { Link } from 'react-router-dom'
import Favorite from '../../assets/favorite.svg'
import { useWishlist } from '../Context/Wishlist'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../Firebase/Firebase'
import { toast } from 'react-toastify'

const Card = ({ items, loading, error }) => {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [user] = useAuthState(auth)

  if (loading) return (
    <div className='p-10 min-h-screen flex flex-col items-center pt-20'>
      <h1 className="text-2xl mb-6 text-[#002f34]">Fresh recommendations</h1>
      <div className='grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='w-full h-72 rounded-md border border-gray-200 animate-pulse'>
            <div className='h-36 bg-gray-200 w-full'></div>
            <div className='p-4 space-y-2'>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
              <div className='h-3 bg-gray-200 rounded w-3/4'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (!items || items.length === 0) return (
    <div className='p-10 min-h-screen flex flex-col items-center pt-20'>
      <h1 className="text-2xl mb-6 text-[#002f34]">Fresh recommendations</h1>
      <p className='text-gray-500 font-semibold mt-20'>No products found 📦</p>
    </div>
  )

  return (
    <div className='py-6'>
      <h1 className="text-[24px] text-[#002f34] mb-4">Fresh recommendations</h1>
      <div className='grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {items.map((item) => (
          <Link to='/details' state={{ item }} key={item.id} className='hover:no-underline'>
            <div className='relative w-full rounded-[4px] border border-[#ccd5d6] bg-white overflow-hidden cursor-pointer flex flex-col p-3 min-h-[280px]'>
              <div className='w-full h-[160px] overflow-hidden mb-2'>
                <img className='w-full h-full object-cover' src={item.imageUrl || 'https://via.placeholder.com/150'} alt={item.title} />
              </div>
              <div className='flex flex-col flex-grow'>
                <h2 className="font-bold text-[20px] text-[#002f34]">₹ {item.price}</h2>
                <p className="text-[14px] text-[#406367] truncate">{item.title}</p>
                <div className="mt-auto flex justify-between text-[12px] text-[#728889] uppercase pt-2">
                  <span>{item.category}</span>
                  <span>TODAY</span>
                </div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault()
                  if (user) {
                    toggleWishlist(item)
                    toast[isInWishlist(item.id) ? 'info' : 'success'](isInWishlist(item.id) ? 'Removed from wishlist' : 'Added to wishlist')
                  } else {
                    toast.warn("Please login to add to wishlist")
                  }
                }}
                className='absolute top-4 right-4 bg-white rounded-full p-2 shadow cursor-pointer hover:scale-110 transition-transform'
              >
                <img className='w-[18px]' src={Favorite} alt="Favourite"
                  style={{ filter: isInWishlist(item.id) ? 'invert(27%) sepia(91%) saturate(2352%) hue-rotate(331deg) brightness(94%) contrast(92%)' : 'none' }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Card