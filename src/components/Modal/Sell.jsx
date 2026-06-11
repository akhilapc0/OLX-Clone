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
    const [errors, setErrors] = useState({})

    const auth = UserAuth()

    const resetForm = () => {
        setTitle(''); setCategory(''); setPrice('')
        setDescription(''); setImage(null); setErrors({})
    }

    const handleClose = () => { resetForm(); toggleModalSell() }

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0])
            if (errors.image) setErrors(prev => ({ ...prev, image: "" }))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!title.trim()) {
            newErrors.title = "Title is required"
        } else if (title.trim().length < 3) {
            newErrors.title = "Title must be at least 3 characters"
        }

        if (!category.trim()) {
            newErrors.category = "Category is required"
        }

        if (!price.trim()) {
            newErrors.price = "Price is required"
        } else if (isNaN(price) || Number(price) <= 0) {
            newErrors.price = "Enter a valid price (numbers only)"
        }

        if (!description.trim()) {
            newErrors.description = "Description is required"
        } else if (description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters"
        }

        if (!image) {
            newErrors.image = "Please upload an image"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!auth?.user) {
            setErrors({ general: "Please login to continue" })
            return
        }
        if (!validate()) return
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

        try {
            const imageUrl = await readImageAsDataUrl(image)
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
            setErrors({ general: "Failed to post ad. Please try again." })
        } finally {
            setSubmitting(false)
        }
    }

    if (!status) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleClose}>
            <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

                <div className="flex justify-between items-center mb-4">
                    <p className="font-bold text-lg text-[#002f34]">Post Your Ad</p>
                    <img onClick={handleClose} className="w-5 cursor-pointer" src={close} alt="close" />
                </div>

                {/* General error */}
                {errors.general && (
                    <p className="text-red-500 text-xs mb-3 bg-red-50 p-2 rounded text-center">
                        {errors.general}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Title */}
                    <div className="mb-3">
                        <Input id="sell-title" setInput={(val) => {
                            setTitle(val)
                            if (errors.title) setErrors(prev => ({ ...prev, title: "" }))
                        }} value={title} placeholder='Title' />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <span>⚠</span> {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                        <Input id="sell-category" setInput={(val) => {
                            setCategory(val)
                            if (errors.category) setErrors(prev => ({ ...prev, category: "" }))
                        }} value={category} placeholder='Category' />
                        {errors.category && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <span>⚠</span> {errors.category}
                            </p>
                        )}
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                        <Input id="sell-price" setInput={(val) => {
                            setPrice(val)
                            if (errors.price) setErrors(prev => ({ ...prev, price: "" }))
                        }} value={price} placeholder='Price' />
                        {errors.price && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <span>⚠</span> {errors.price}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                        <Input id="sell-description" setInput={(val) => {
                            setDescription(val)
                            if (errors.description) setErrors(prev => ({ ...prev, description: "" }))
                        }} value={description} placeholder='Description' />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <span>⚠</span> {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div className="mb-4">
                        <div className="relative h-48 w-full border-2 border-black rounded-md">
                            {image ? (
                                <div className="h-full flex items-center justify-center overflow-hidden">
                                    <img className="object-contain h-full" src={URL.createObjectURL(image)} alt="preview" />
                                </div>
                            ) : (
                                <>
                                    <input onChange={handleImageUpload} type="file"
                                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-30" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                        <img className="w-12" src={fileUpload} alt="upload" />
                                        <p className="text-center text-sm pt-2">Click to upload image</p>
                                        <p className="text-center text-xs text-gray-400">SVG, PNG, JPG</p>
                                    </div>
                                </>
                            )}
                        </div>
                        {errors.image && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <span>⚠</span> {errors.image}
                            </p>
                        )}
                    </div>

                    {submitting ? (
                        <div className="w-full flex justify-center pt-2">
                            <img className="w-24" src={loadingGif} alt="loading" />
                        </div>
                    ) : (
                        <button className="w-full mt-2 p-3 rounded-lg text-white font-semibold bg-[#002f34] hover:bg-teal-900"
                            type="submit">
                            Post Ad
                        </button>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Sell