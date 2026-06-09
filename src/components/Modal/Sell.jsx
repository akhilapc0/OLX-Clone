import { useState } from "react"
import Input from "../Input/Input"
import { UserAuth } from "../Context/Auth"
import { addDoc, collection } from "firebase/firestore"
import { fetchFromFirestore, fireStore } from "../Firebase/Firebase"
import fileUpload from '../../assets/fileUpload.svg'
import loadingGif from '../../assets/loading.gif'
import close from '../../assets/close.svg'

const Sell = ({ toggleModalSell, status, setItems }) => {
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const auth = UserAuth()

    const resetForm = () => {
        setTitle(''); setCategory(''); setPrice(''); setDescription(''); setImage(null)
    }

    const handleClose = () => { resetForm(); toggleModalSell() }

    const handleImageUpload = (e) => {
        if (e.target.files) setImage(e.target.files[0])
    }

    const validate = () => {
    if (!title.trim()) {
        alert("Title is required"); return false
    }
    if (title.trim().length < 3) {
        alert("Title must be at least 3 characters"); return false
    }
    if (!category.trim()) {
        alert("Please enter a category"); return false
    }
    if (!price.trim()) {
        alert("Price is required"); return false
    }
    if (isNaN(price) || Number(price) <= 0) {
        alert("Enter a valid price (numbers only)"); return false
    }
    if (!description.trim()) {
        alert("Description is required"); return false
    }
    if (description.trim().length < 10) {
        alert("Description must be at least 10 characters"); return false
    }
    if (!image) {
        alert("Please upload an image"); return false
    }
    return true
}

    
const handleSubmit = async (e) => {
    e.preventDefault()
    if (!auth?.user) { alert('Please login to continue'); return }
    if (!validate()) return  // ← stop if validation fails
    setSubmitting(true)

        const readImageAsDataUrl = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = (event) => {
                    const img = new Image()
                    img.onload = () => {
                        const canvas = document.createElement('canvas')
                        let width = img.width, height = img.height
                        const MAX_SIZE = 800
                        if (width > height) {
                            if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE }
                        } else {
                            if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE }
                        }
                        canvas.width = width; canvas.height = height
                        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
                        resolve(canvas.toDataURL('image/jpeg', 0.7))
                    }
                    img.src = event.target.result
                }
                reader.onerror = reject
                reader.readAsDataURL(file)
            })
        }

        let imageUrl = ''
        if (image) {
            try {
                imageUrl = await readImageAsDataUrl(image)
            } catch (error) {
                alert('Failed to read image'); setSubmitting(false); return
            }
        }

        if (!title.trim() || !category.trim() || !price.trim() || !description.trim()) {
            alert('All fields are required'); setSubmitting(false); return
        }

        try {
            await addDoc(collection(fireStore, 'products'), {
                title, category, price, description, imageUrl,
                userId: auth.user.uid,
                userName: auth.user.displayName || 'Anonymous',
                createdAt: new Date().toDateString()
            })
            resetForm()
            const datas = await fetchFromFirestore()
            setItems(datas)
            toggleModalSell()
        } catch (error) {
            alert('Failed to add item: ' + error.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (!status) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleClose}>
            <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 relative">
                    <img onClick={handleClose} className="w-6 absolute top-4 right-4 cursor-pointer" src={close} alt="close" />
                    <p className="font-bold text-lg mb-4">Sell Item</p>

                    <form onSubmit={handleSubmit}>
                        <Input id="sell-title" setInput={setTitle} value={title} placeholder='Title' />
                        <Input id="sell-category" setInput={setCategory} value={category} placeholder='Category' />
                        <Input id="sell-price" setInput={setPrice} value={price} placeholder='Price' />
                        <Input id="sell-description" setInput={setDescription} value={description} placeholder='Description' />

                        <div className="pt-2 w-full relative">
                            {image ? (
                                <div className="relative h-48 w-full flex justify-center border-2 border-black rounded-md overflow-hidden">
                                    <img className="object-contain" src={URL.createObjectURL(image)} alt="preview" />
                                </div>
                            ) : (
                                <div className="relative h-48 w-full border-2 border-black rounded-md">
                                    <input onChange={handleImageUpload} type="file" className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-30" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                        <img className="w-12" src={fileUpload} alt="upload" />
                                        <p className="text-center text-sm pt-2">Click to upload images</p>
                                        <p className="text-center text-sm text-gray-400">SVG, PNG, JPG</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {submitting ? (
                            <div className="w-full flex justify-center pt-4">
                                <img className="w-24" src={loadingGif} alt="loading" />
                            </div>
                        ) : (
                            <button className="w-full mt-4 p-3 rounded-lg text-white font-semibold" style={{ backgroundColor: '#002f34' }} type="submit">
                                Sell Item
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Sell