import { Modal, ModalBody } from "flowbite-react"
import google from '../../assets/google.png'
import mobile from '../../assets/mobile.svg'
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
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [slideIndex, setSlideIndex] = useState(0)

    const handleGoogleLogin = async () => {
        try {
            setLoading(true)
            const result = await signInWithPopup(auth, provider)
            await saveUserToFirestore(result.user)
            toggleModal()
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleEmailAuth = async (e) => {
        e.preventDefault()
        setError("")
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
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!status) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={toggleModal}>
            <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
                
                {/* Close button */}
                <div className="relative">
                    <img onClick={toggleModal} className="w-6 absolute top-4 right-4 cursor-pointer z-10" src={close} alt="close" />
                </div>

                {/* Carousel */}
                <div className="px-6 pt-8 pb-4">
                    <div className="flex flex-col items-center justify-center h-48">
                        <img className="w-20 mb-3" src={slides[slideIndex].img} alt="slide" />
                        <p className="text-center font-semibold text-sm text-[#002f34] max-w-xs">
                            {slides[slideIndex].text}
                        </p>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mb-4">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setSlideIndex(i)}
                                className={`h-2 w-2 rounded-full ${i === slideIndex ? 'bg-teal-400' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 pb-6">
                    <div className="flex items-center justify-start rounded-md border-2 border-black p-3 mb-4 cursor-pointer">
                        <img className="w-6 mr-2" src={mobile} alt="mobile" />
                        <p className="text-sm font-bold">Continue with phone</p>
                    </div>

                    <div onClick={handleGoogleLogin} className="flex items-center justify-center rounded-md border-2 border-gray-300 p-3 mb-4 cursor-pointer relative hover:bg-gray-50">
                        <img className="w-6 absolute left-3" src={google} alt="google" />
                        <p className="text-sm text-gray-500">Continue with Google</p>
                    </div>

                    <div className="text-center mb-4">
                        <p className="font-semibold text-sm">OR</p>
                    </div>

                    <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="border p-2 rounded-md text-sm w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="border p-2 rounded-md text-sm w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                        <button type="submit" disabled={loading} className="bg-teal-600 text-white p-2 rounded-md text-sm font-semibold w-full">
                            {loading ? "Please wait..." : isSignup ? "Signup" : "Login"}
                        </button>
                    </form>

                    <div className="pt-4 text-center">
                        <p className="text-sm underline cursor-pointer text-blue-600" onClick={() => setIsSignup(!isSignup)}>
                            {isSignup ? "Already have an account? Login" : "Don't have an account? Signup"}
                        </p>
                    </div>

                    <div className="pt-6 flex flex-col items-center">
                        <p className="text-xs text-gray-500">All your personal details are safe with us.</p>
                        <p className="text-xs pt-3 text-center text-gray-500">
                            If you continue, you are accepting
                            <span className="text-blue-600"> OLX Terms and Conditions and Privacy Policy</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login