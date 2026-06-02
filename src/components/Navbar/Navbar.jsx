
import React from 'react'
import './Navbar.css'
import logo from '../../assets/symbol.png'
import search from '../../assets/search1.svg'
import arrow from '../../assets/arrow-down.svg'
const Navbar = () => {
  return (
    <div>
        <nav>
            <img src={logo} alt="" className='w-12'/>

            <div>
                <img src={search} alt="" className='absolute top-4 left-2 w-5' />
                <input placeholder='Search city,area, or locality...'
                 type="text" name='' id='' />
                <img src={arrow} alt="" className='absolute top-4 right-3 w-5 cursor-pointer'/>
            </div>
        </nav>
    </div>
  )
}

export default Navbar