import google from '../../assets/google.png'
import guitar from '../../assets/guita.png'
import love from '../../assets/love.png'
import avatar from '../../assets/avatar.png'
import close from '../../assets/close.svg'
import { useState } from "react"
import { signInWithPopup } from "firebase/auth"
import { auth, provider, signupWithEmail, loginWithEmail, saveUserToFirestore } from "../Firebase/Firebase"

const slides = [
    { img: guitar, text: "Help us become one of the safest place to buy and sell." },
    { img: love, text: "Close deals from the comfort of your home." },
    { img: avatar, text: "Keep all your favorites in one place." },
]

const Login = ({ toggleModal, status }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSignup, setIsSignup] = useState(false)
    const [loading, setLoading] = useState(false)
    const [slideIndex, setSlideIndex] = useState(0)

    // Separate error state for each field
    const [errors, setErrors] = useState({})

    const validate = () => {
        const newErrors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!email.trim()) {
            newErrors.email = "Email is required"
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Enter a valid email address"
        }

        if (!password) {
            newErrors.password = "Password is required"
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleGoogleLogin = async () => {
        try {
            setLoading(true)
            const result = await signInWithPopup(auth, provider)
            await saveUserToFirestore(result.user)
            toggleModal()
        } catch (err) {
            setErrors({ general: err.message })
        } finally {
            setLoading(false)
        }
    }

    const handleEmailAuth = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setErrors({})
        try {
            setLoading(true)
            let user
            if (isSignup) {
                user = await signupWithEmail(email, password)
            } else {
                user = await loginWithEmail(email, password)
            }
            await saveUserToFirestore(user)
            toggleModal()
        } catch (err) {
            setErrors({ general: "Invalid email or password. Please try again." })
        } finally {
            setLoading(false)
        }
    }

    if (!status) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={toggleModal}>
            <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>

                <div className="relative px-6 pt-6">
                    <img onClick={toggleModal} className="w-5 absolute top-4 right-4 cursor-pointer" src={close} alt="close" />

                    <h2 className="text-center text-xl font-bold text-[#002f34] mb-4">
                        {isSignup ? "Create an Account" : "Login to OLX"}
                    </h2>

                    {/* Carousel */}
                    <div className="flex flex-col items-center justify-center h-40 mb-2">
                        <img className="w-16 mb-2" src={slides[slideIndex].img} alt="slide" />
                        <p className="text-center font-semibold text-sm text-[#002f34] max-w-xs">
                            {slides[slideIndex].text}
                        </p>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mb-5">
                        {slides.map((_, i) => (
                            <button key={i} onClick={() => setSlideIndex(i)}
                                className={`h-2 w-2 rounded-full ${i === slideIndex ? 'bg-teal-400' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="px-6 pb-6">
                    {/* Google */}
                    <div onClick={handleGoogleLogin}
                        className="flex items-center justify-center rounded-md border border-gray-300 p-3 mb-4 cursor-pointer hover:bg-gray-50 relative">
                        <img className="w-5 absolute left-3" src={google} alt="google" />
                        <p className="text-sm text-gray-600">Continue with Google</p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <p className="text-sm text-gray-400">OR</p>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* General error */}
                    {errors.general && (
                        <p className="text-red-500 text-xs mb-3 text-center bg-red-50 p-2 rounded">
                            {errors.general}
                        </p>
                    )}

                    <form onSubmit={handleEmailAuth} className="flex flex-col gap-1">

                        {/* Email */}
                        <div className="mb-2">
                            <label className="text-sm text-gray-600 mb-1 block">Email Address</label>
                            <input
                                type="email"
                                placeholder="example@mail.com"
                                className={`border p-2 rounded-md text-sm w-full focus:outline-none ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-teal-500'}`}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (errors.email) setErrors(prev => ({ ...prev, email: "" }))
                                }}
                            />
                            {/* Error shown directly below input */}
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <span>⚠</span> {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                            <label className="text-sm text-gray-600 mb-1 block">Password</label>
                            <input
                                type="password"
                                placeholder="Min 6 characters"
                                className={`border p-2 rounded-md text-sm w-full focus:outline-none ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-teal-500'}`}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (errors.password) setErrors(prev => ({ ...prev, password: "" }))
                                }}
                            />
                            {/* Error shown directly below input */}
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <span>⚠</span> {errors.password}
                                </p>
                            )}
                        </div>

                        <button type="submit" disabled={loading}
                            className="bg-teal-600 text-white p-2 rounded-md text-sm font-semibold w-full hover:bg-teal-700">
                            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
                        </button>
                    </form>

                    <div className="pt-4 text-center">
                        {isSignup ? (
                            <p className="text-sm text-gray-500">
                                Already have an account?{" "}
                                <span className="text-teal-600 font-semibold cursor-pointer underline"
                                    onClick={() => { setIsSignup(false); setErrors({}) }}>
                                    Login here
                                </span>
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500">
                                Don't have an account?{" "}
                                <span className="text-teal-600 font-semibold cursor-pointer underline"
                                    onClick={() => { setIsSignup(true); setErrors({}) }}>
                                    Register here
                                </span>
                            </p>
                        )}
                    </div>

                    <p className="text-xs text-gray-400 text-center mt-4">
                        Your personal details are safe with us. By continuing, you agree to our{" "}
                        <span className="text-teal-600">Terms and Conditions and Privacy Policy</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login