import { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { ItemsContext } from '../Context/Item'
import { UserAuth } from '../Context/Auth'
import { Link } from 'react-router-dom'
import { deleteProduct, fireStore } from '../Firebase/Firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import Login from '../Modal/Login'
import Sell from '../Modal/Sell'
import close from '../../assets/close.svg'

const MyAdsPage = () => {
  const { items, setItems } = ItemsContext()
  const { user } = UserAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showSell, setShowSell] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editItem, setEditItem] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImage, setEditImage] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState('')

  const myAds = items.filter(item => item.userId === user?.uid)

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return
    try {
      await deleteProduct(id)
      setItems(prev => prev.filter(item => item.id !== id))
      toast.success("Ad deleted!")
    } catch {
      toast.error("Failed to delete")
    }
  }

  const openEdit = (item) => {
    setEditItem(item)
    setEditTitle(item.title)
    setEditPrice(item.price)
    setEditCategory(item.category)
    setEditDescription(item.description)
    setEditImagePreview(item.imageUrl)
    setEditImage(null)
  }

  const handleEditImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditImage(file)
      setEditImagePreview(URL.createObjectURL(file))
    }
  }

  const handleEditSave = async () => {
    try {
      let imageUrl = editImagePreview
      if (editImage) {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
              const canvas = document.createElement('canvas')
              let w = img.width, h = img.height
              const MAX = 800
              if (w > h ? w > MAX : h > MAX) {
                if (w > h) { h *= MAX / w; w = MAX } else { w *= MAX / h; h = MAX }
              }
              canvas.width = w; canvas.height = h
              canvas.getContext('2d').drawImage(img, 0, 0, w, h)
              resolve(canvas.toDataURL('image/jpeg', 0.7))
            }
            img.src = event.target.result
          }
          reader.onerror = reject
          reader.readAsDataURL(editImage)
        })
      }

      await updateDoc(doc(fireStore, 'products', editItem.id), {
        title: editTitle, price: editPrice,
        category: editCategory, description: editDescription, imageUrl
      })

      setItems(prev => prev.map(item =>
        item.id === editItem.id
          ? { ...item, title: editTitle, price: editPrice, category: editCategory, description: editDescription, imageUrl }
          : item
      ))
      toast.success("Ad updated!")
      setEditItem(null)
    } catch (err) {
      toast.error("Update failed: " + err.message)
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
        <h1 className="text-[24px] text-[#002f34] mb-4 font-bold">My Ads</h1>

        {myAds.length === 0 ? (
          <div className='flex flex-col items-center mt-20'>
            <p className='text-5xl mb-4'>📦</p>
            <p className='text-gray-500 font-semibold'>You have no ads yet</p>
            <button onClick={() => setShowSell(true)}
              className='mt-4 bg-[#002f34] text-white px-6 py-2 rounded'>
              Post an Ad
            </button>
          </div>
        ) : (
          <div className='grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {myAds.map((item) => (
              <div key={item.id} className='rounded-[4px] border border-[#ccd5d6] bg-white overflow-hidden flex flex-col p-3'>
                <Link to='/details' state={{ item }}>
                  <div className='w-full h-[150px] overflow-hidden mb-2'>
                    <img className='w-full h-full object-cover'
                      src={item.imageUrl || 'https://via.placeholder.com/150'} alt={item.title} />
                  </div>
                  <h2 className="font-bold text-[18px] text-[#002f34]">₹ {item.price}</h2>
                  <p className="text-[13px] text-[#406367] truncate">{item.title}</p>
                  <p className="text-[11px] text-[#728889] uppercase mb-2">{item.category}</p>
                </Link>
                <div className='flex gap-2 mt-auto'>
                  <button onClick={() => openEdit(item)}
                    className='flex-1 bg-blue-500 text-white py-1.5 rounded text-sm font-semibold hover:bg-blue-600'>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className='flex-1 bg-red-500 text-white py-1.5 rounded text-sm font-semibold hover:bg-red-600'>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setEditItem(null)}>
          <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>

            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-[#002f34]">Edit Ad</h2>
              <img src={close} alt="close" className="w-5 cursor-pointer" onClick={() => setEditItem(null)} />
            </div>

            <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-3 text-sm focus:outline-none focus:border-teal-500"
              placeholder="Title" />

            <input value={editPrice} onChange={e => setEditPrice(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-3 text-sm focus:outline-none focus:border-teal-500"
              placeholder="Price" />

            <select value={editCategory} onChange={e => setEditCategory(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-3 text-sm focus:outline-none">
              <option value="">Select Category</option>
              {['Cars','Properties','Mobiles','Jobs','Electronics','Bikes','Furniture'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-3 text-sm focus:outline-none focus:border-teal-500"
              rows={3} placeholder="Description" />

            <div className="mb-4">
              <p className="text-sm font-semibold mb-2 text-[#002f34]">Update Image</p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 relative cursor-pointer hover:border-teal-400">
                <input type="file" onChange={handleEditImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                {editImagePreview ? (
                  <img src={editImagePreview} alt="preview" className="h-36 object-contain mx-auto" />
                ) : (
                  <p className="text-center text-gray-400 text-sm py-6">Click to upload image</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setEditItem(null)}
                className="flex-1 border border-gray-300 py-2 rounded text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleEditSave}
                className="flex-1 bg-teal-600 text-white py-2 rounded text-sm font-semibold hover:bg-teal-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <Login toggleModal={() => setShowLogin(p => !p)} status={showLogin} />
      <Sell toggleModalSell={() => setShowSell(p => !p)} status={showSell} setItems={setItems} />
    </div>
  )
}

export default MyAdsPage