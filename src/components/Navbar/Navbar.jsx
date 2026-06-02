
import React from 'react'
import './Navbar.css'
import logo from '../../assets/symbol.png'
import search from '../../assets/search1.svg'
import arrow from '../../assets/arrow-down.svg'
import searchIcon from '../../assets/search.svg'
import banner from '../../assets/car.png'
const Navbar = () => {
    return (
        <div>
            <nav className='flex items-center justify-between gap-4 px-6 py-4 bg-[#f7f8f8]'>

                <div className='flex items-center gap-4 flex-1'>

                    <img src={logo} alt="" className='w-12' />

                    <div className='relative'>
                        <img src={search} alt="" className='absolute top-1/2 left-3 -translate-y-1/2 w-5' />
                        <input
                            placeholder='Search city, area, or locality...'
                            type="text"
                            className='border-2 border-[#002f34] rounded-md pl-10 pr-10 py-3 w-[300px] outline-none bg-white'
                        />
                        <img src={arrow} alt="" className='absolute top-1/2 right-3 -translate-y-1/2 w-5 cursor-pointer' />
                    </div>

                    <div className='flex items-center flex-1 max-w-[800px]'>

                        <input
                            type="text"
                            placeholder='Find Cars, Mobile Phones and more...'
                            className='w-full border-2 border-[#002f34] rounded-l-md px-4 py-3 outline-none'
                        />

                        <div className='bg-[#002f34] p-4 rounded-r-md cursor-pointer'>
                            <img src={searchIcon} alt="" className='w-6 invert' />
                        </div>

                    </div>

                </div>


                <div className='flex items-center gap-6 ml-4'>

                    <div className='flex items-center cursor-pointer'>
                        <p className='font-semibold'>ENGLISH</p>
                        <img src={arrow} alt="" className='w-5' />
                    </div>

                    <p className='font-semibold underline cursor-pointer'>
                        Login
                    </p>

                    <button className='border-4 border-yellow-400 border-t-cyan-400 border-r-blue-500 rounded-full px-6 py-2 font-semibold bg-white'>
                        + SELL
                    </button>

                </div>




            </nav>

            <div className='flex items-center gap-6 px-6 py-3 bg-white shadow-sm text-sm'>

                <div className='flex items-center gap-2 font-semibold cursor-pointer'>
                    <p>ALL CATEGORIES</p>
                    <img src={arrow} alt="" className='w-4' />
                </div>

                <p className='cursor-pointer'>Cars</p>
                <p className='cursor-pointer'>Motorcycles</p>
                <p className='cursor-pointer'>Mobile Phones</p>
                <p className='cursor-pointer'>For Sale: Houses & Apartments</p>
                <p className='cursor-pointer'>Scooters</p>

            </div>

            <div className='w-full'>
                <img src={banner} alt="" className='w-full object-cover' />
            </div>


        </div>
    )
}

export default Navbar