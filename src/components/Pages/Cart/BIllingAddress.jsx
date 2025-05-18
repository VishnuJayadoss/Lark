import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@material-tailwind/react'
import Cookies from 'js-cookie'
import axios from '../../../axios.js'
const BIllingAddress = ({ onAddressLengthChange }) => {
  const cookiesToken = Cookies.get('token')
  let cookiesUser = ''
  if (Cookies.get('user')) {
    cookiesUser = JSON.parse(Cookies.get('user'))
  }

  const [address, setAddress] = useState([])

  useEffect(() => {
    fetchBillingAddress()
  }, [])

  const fetchBillingAddress = async () => {
    try {
      const res = await axios.get(
        `/v2/user/shipping/billingaddress/${cookiesUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${cookiesToken}`
          }
        }
      )
      const getdata = res.data?.data
      setAddress(getdata)
      onAddressLengthChange(getdata.length)
    } catch (error) {
      onAddressLengthChange(0)
      console.log('error', error)
    }
  }
  //   console.log("address", address);

  return (
    <>
      {address.length === 0 ? (
        <div className='flex justify-between items-center gap-4 shadow-md px-4 py-3 border-2'>
          <div>
            <h2 className='font-themefont font-black text-theme-primary text-sm'>
              No billing address found
            </h2>
            <p className='mt-1 font-headingfont font-thin text-theme-primary text-xs'>
              Please add a billing address to proceed.
            </p>
          </div>
          <div>
            <Link to='/deliveryaddress'>
              <Button className='bg-theme-secondary px-4 py-2 border-2 border-theme-primary rounded-none text-[10px] text-theme-primary tracking-widest'>
                Add
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        address.map((items, index) => (
          <div
            key={index}
            className='flex justify-between items-center gap-4 shadow-md px-4 py-3 border-2'
          >
            <div>
              <h2 className='font-themefont font-black text-theme-primary text-sm'>
                Deliver To: {items.name},
              </h2>
              <p className='mt-1 font-headingfont font-thin text-theme-primary text-xs line-clamp-2'>
                {items.address},
              </p>
              <p className='mt-1 font-headingfont font-thin text-theme-primary text-xs line-clamp-2'>
                {items.city_id} - {items.postal_code},
              </p>
              {/* <p className='mt-1 font-headingfont font-thin text-theme-primary text-xs'>
                Estimated delivery by 23 Mar
              </p> */}
            </div>
            <div>
              <Link to='/deliveryaddress'>
                <Button className='bg-theme-secondary px-4 py-2 border-2 border-theme-primary rounded-none text-[10px] text-theme-primary tracking-widest'>
                  Change
                </Button>
              </Link>
            </div>
          </div>
        ))
      )}
    </>
  )
}

export default BIllingAddress
