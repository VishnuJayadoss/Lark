import React, { useState } from 'react'
import { Heart } from 'lucide-react'
import Card1 from '../../../assets/productlist/card1.webp'
import Card2 from '../../../assets/productlist/card2.jpg'
import NodataImg from '../../../assets/nodata.png'
import { Link } from 'react-router-dom'
import NodataButton from '../../layouts/NodataButton'

const NotFound = () => {
  const [wishlist, setWishlist] = useState(false)

  const addtoWishlist = () => {
    setWishlist(data => !data)
  }
  return (
    <>
      {/* content start */}
      <div className='mx-auto mt-24 md:mt-20 mb-3 container'>
        <div className='grid grid-cols-12'>
          {/* section 1 start*/}
          <div className='col-span-12 bg-theme-primary text-theme-secondary'>
            <div className='p-8 font-headingfont text-[13px] text-center leading-[1.5] tracking-wide'>
              <div className='flex justify-center w-full'>
                <img src={NodataImg} alt='' className='w-1/2 lg:w-1/4' />
              </div>
              <p className='mt-8 font-themefont text-theme-secondary sm:text-md text-xs lg:text-xl'>
                We can't seem to find the page you are looking for
              </p>

              <div className="pt-6 text-center">
                <NodataButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound
