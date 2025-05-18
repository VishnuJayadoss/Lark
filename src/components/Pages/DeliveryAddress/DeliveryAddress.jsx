import React, { useState, useEffect } from 'react'

import {
  Stepper,
  Step,
  Button,
  Typography,
  Radio,
  Dialog,
  DialogBody
} from '@material-tailwind/react'

import {
  MapPin,
  ShoppingBag,
  IndianRupee,
  CirclePlus,
  Check
} from 'lucide-react'
import AddShippingAddress from './AddShippingAddress'
import axios from '../../../axios.js'
import Cookies from 'js-cookie'
import EditShippingAddress from './EditShippingAddress.jsx'
import { Link } from 'react-router-dom'

const DeliveryAddress = () => {
  const token = Cookies.get('token')
  const cookiesUser = JSON.parse(Cookies.get('user'))

  const [activeStep, setActiveStep] = useState(1)
  const [isLastStep, setIsLastStep] = useState(false)
  const [isFirstStep, setIsFirstStep] = useState(false)

  const [selectedAddress, setSelectedAddress] = useState(0)

  // Remove Modal popup Start
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const handleOpen = id => {
    setOpen(data => {
      !data
    })
    setSelectedId(id)
  }
  //Remove Modal popup end

  // add form Modal popup Start
  const [createAddress, setcreateAddress] = useState(false)
  const handleAddOpen = () => {
    setcreateAddress(data => !data)
  }
  // add form Modal popup end
  // edit

  const [editFormAddress, setEditFormAddress] = useState(false)
  // const handleEditOpen = () => {
  //   setEditFormAddress((data) => !data);
  // };

  // edit address

  const [editDeliveryAddress, setEditDeliveryAddress] = useState([])

  const editAddress = id => {
    // addresses
    if (id) {
      const addressToEdit = fetShippingAddress.find(
        address => address.id === id
      )
      setEditDeliveryAddress(addressToEdit)
      setEditFormAddress(data => !data)
    }
  }

  // console.log("editDeliveryAddress", editDeliveryAddress);

  // api call start

  const [fetShippingAddress, setFetShippingAddress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAddress()
  }, [editFormAddress, setcreateAddress, createAddress, setEditFormAddress])

  const fetchAddress = async () => {
    try {
      const response = await axios.get(
        `/v2/user/shipping/getaddress/${cookiesUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const FetData = response.data
      if (FetData.status === 200) {
        setFetShippingAddress(FetData.data)
      }
    } catch (error) {
      console.log('Fetch Address Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // console.log("fetShippingAddress", fetShippingAddress);

  // remove address

  const removeAddress = async id => {
    try {
      // console.log("removeAddress", id);

      const res = await axios.get(`/v2/user/shipping/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // console.log("Remove Address Response:", res.data);
      if (res.data.result === true) {
        fetchAddress()
      }
    } catch (error) {
      console.log('Remove Address Error:', error)
    }
  }

  // api call end

  // Skeleton loader
  const renderAddressSkeletons = () =>
    Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className='shadow-md p-5 border-2 border-black/10 h-full font-themefont text-theme-primary/60 text-sm animate-pulse'
      >
        <div className='relative'>
          <div className='space-y-2 w-full'>
            {/* Name skeleton */}
            <div className='bg-gray-300 rounded w-1/3 h-4' />

            {/* Address lines skeleton */}
            <div className='space-y-1'>
              <div className='bg-gray-300 rounded w-5/6 h-3' />
              <div className='bg-gray-300 rounded w-2/3 h-3' />
            </div>

            {/* City and postal code */}
            <div className='bg-gray-300 rounded w-1/2 h-3' />

            {/* State name */}
            <div className='bg-gray-300 rounded w-1/2 h-3' />

            {/* Country name */}
            <div className='bg-gray-300 rounded w-1/2 h-3' />

            {/* Mobile number */}
            <div className='bg-gray-300 rounded w-2/3 h-3' />
          </div>

          {/* Radio button placeholder */}
          <div className='top-0 right-0 absolute'>
            <div className='bg-gray-300 rounded-full w-5 h-5' />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className='flex gap-2 mt-4'>
          <div className='bg-gray-300 rounded w-20 h-8' />
          <div className='bg-gray-300 rounded w-20 h-8' />
        </div>
      </div>
    ))

  // Skeleton loader end

  // setDefaultAddress start
  const setDefaultAddress = async id => {
    if (!id) return

    const addressToEdit = fetShippingAddress?.find(address => address.id === id)
    if (!addressToEdit) {
      console.error('Address not found for the given ID:', id)
      return
    }

    try {
      const addressString = addressToEdit.address || ''
      const addressParts = addressString.split(',').map(part => part.trim())

      const formData = {
        ...addressToEdit,
        building: addressParts[0] || '',
        street: addressParts[1] || '',
        landmark: addressParts.slice(2).join(', ') || '',
        set_default: 1
      }

      const res = await axios.post('/v2/user/shipping/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (res.data?.result === true) {
        fetchAddress() // Refresh the list of addresses
      } else {
        console.warn(
          'Failed to set default address:',
          res.data?.message || 'Unknown error'
        )
      }
    } catch (error) {
      console.error('Error setting default address:', error)
    }
  }
  // setDefaultAddress end

  return (
    <>
      {/* content start */}
      <div className='mx-auto mt-28 md:mt-20 mb-10 container'>
        <div className='gap-4 grid grid-cols-12 mt-8'>
          {/* stepper Start */}
          <div className='flex justify-center col-span-12'>
            <div className='z-0 md:px-24 md:py-2 pt-2 pb-2 w-[70%] md:w-[50%]'>
              <Stepper
                activeStep={activeStep}
                isLastStep={value => setIsLastStep(value)}
                isFirstStep={value => setIsFirstStep(value)}
              >
                <Step onClick={() => setActiveStep(0)}>
                  <Link to='/cart'>
                    <ShoppingBag className='w-4 h-4' />
                  </Link>
                  <div className='-bottom-[1.9rem] absolute w-max text-center'>
                    <Typography
                      color={activeStep === 0 ? 'blue-gray' : 'gray'}
                      className='font-themefont text-[12px]'
                    >
                      MY BAG
                    </Typography>
                  </div>
                </Step>
                <Step onClick={() => setActiveStep(1)}>
                  <MapPin className='w-4 h-4' />
                  <div className='-bottom-[1.9rem] absolute w-max text-center'>
                    <Typography
                      color={activeStep === 1 ? 'blue-gray' : 'gray'}
                      className='font-themefont text-[12px]'
                    >
                      ADDRESS
                    </Typography>
                  </div>
                </Step>
                <Step onClick={() => setActiveStep(2)}>
                  <IndianRupee className='w-4 h-4' />
                  <div className='-bottom-[1.9rem] absolute w-max text-center'>
                    <Typography
                      color={activeStep === 2 ? 'blue-gray' : 'gray'}
                      className='font-themefont text-[12px]'
                    >
                      PAYMENT
                    </Typography>
                  </div>
                </Step>
              </Stepper>
            </div>
          </div>
          {/* stepper End */}

          {/* line start */}

          <div className='col-span-12 mx-8 mt-4'>
            <hr />
          </div>

          {/* line end  */}

          {/* Delivery address start */}

          <div className='col-span-12 md:col-span-7 mx-4 my-3 md:my-2 md:ml-8'>
            <div>
              <h2 className='mb-6 font-themefont text-theme-primary/70 text-sm'>
                Delivery To
              </h2>
            </div>
            {/* add your address */}

            <div className='gap-4 grid grid-cols-0 md:grid-cols-2'>
              {loading ? (
                renderAddressSkeletons()
              ) : (
                <>
                  {fetShippingAddress.map((address, index) => (
                    <label
                      key={address.id}
                      className={`text-theme-primary/60 shadow-md cursor-pointer h-full font-themefont text-sm border-2  border-black/10 p-5 ${
                        address.set_default === 1 ? 'bg-theme-primary/10' : ''
                      }`}
                      onClick={() => setDefaultAddress(address.id)}
                    >
                      <div className='relative'>
                        <div className='w-full'>
                          <p className='font-black text-md text-theme-primary uppercase line-clamp-1'>
                            {address.name} {address.lname}
                          </p>
                          <p className='mt-1 truncate'>
                            {address.address
                              .split(',')
                              .map((part, index, arr) => (
                                <React.Fragment key={index}>
                                  {part.trim()},
                                  {index < arr.length - 1 && <br />}
                                </React.Fragment>
                              ))}
                          </p>

                          <p className='mt-1 line-clamp-1'>
                            {address.city_id} - {address.postal_code},{' '}
                          </p>
                          <p className='mt-1 line-clamp-1'>
                            {address.state_name},
                          </p>
                          <p className='mt-1 line-clamp-1'>
                            {address.country_name},
                          </p>
                          <p className='mt-1 line-clamp-1'>
                            Mobile:{' '}
                            <span className='font-semibold text-theme-primary'>
                              {address.phone}
                            </span>
                          </p>
                        </div>

                        <div className='top-0 right-0 absolute'>
                          <Radio
                            name='address'
                            value={address.set_default}
                            icon={
                              <Check className='bg-theme-primary p-1 rounded-full text-theme-secondary' />
                            }
                            checked={address.set_default === 1}
                            onChange={() =>
                              setSelectedAddress(address.set_default)
                            }
                            className='bg-gray-900/5 hover:before:opacity-0 p-0 border-gray-900/10 transition-all'
                            ripple={false}
                          />
                        </div>
                      </div>
                      {address.set_default === 1 && (
                        <>
                          <div className='flex gap-2 my-3'>
                            <Button
                              className='bg-theme-secondary px-3 py-2 border-2 border-theme-primary rounded-none text-theme-primary'
                              onClick={() => editAddress(address.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              className='px-3 py-2 rounded-none'
                              onClick={() => handleOpen(address.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </>
                      )}
                    </label>
                  ))}

                  <div
                    className='flex justify-center p-20 border-2 border-black/10 font-themefont text-theme-primary/60 text-sm cursor-pointer'
                    onClick={handleAddOpen}
                  >
                    <div className='flex flex-col justify-center items-center gap-1'>
                      <CirclePlus className='size-10 text-theme-primary/60' />
                      <p className='text-theme-primary/60'>Add New Address</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Delivery address End */}
          <div className='col-span-12 md:col-span-5 mx-4 my-3 md:my-4 md:mr-8'>
            <div>
              <h2 className='mb-4 font-themefont text-theme-primary/50 text-sm'>
                Billing Details
              </h2>

              <div className='shadow-md p-5 border-2'>
                <div className='bg-gray-50 shadow-sm p-4 border font-themefont'>
                  <div className='flex justify-between my-2 text-gray-700 text-sm'>
                    <span>Cart Total</span>
                    <span>₹ 7428.57</span>
                  </div>
                  <div className='flex justify-between my-2 text-red-600 text-sm'>
                    <span>Discount</span>
                    <span>- ₹ 200.00</span>
                  </div>
                  <div className='flex justify-between my-2 text-gray-700 text-sm'>
                    <span>GST</span>
                    <span>₹ 867.43</span>
                  </div>
                  <div className='flex justify-between my-2 text-gray-500 text-sm'>
                    <span>Shipping Charges</span>
                    <span>Free</span>
                  </div>
                  <hr className='my-3' />
                  <div className='flex justify-between font-semibold text-md text-theme-primary'>
                    <span>Total Amount</span>
                    <span>₹ 7095.00</span>
                  </div>
                </div>

                {/* Continue to Payment Button */}
                <Button className='bg-theme-secondary hover:bg-theme-primary/80 mt-6 py-3 border-2 border-theme-primary rounded-none w-full font-themefont font-semibold text-theme-primary hover:text-theme-secondary tracking-wider transition duration-300 ease-in-out'>
                  CONTINUE TO PAYMENT
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address popup start */}

      <AddShippingAddress
        createAddress={createAddress}
        setcreateAddress={setcreateAddress}
        // fetchAddress={fetchAddress}
      />

      <EditShippingAddress
        editFormAddress={editFormAddress}
        setEditFormAddress={setEditFormAddress}
        editDeliveryAddress={editDeliveryAddress}
        // setEditState={setEditState}
      />

      {/* Add Address popup end */}

      {/* remove popup start */}

      <Dialog
        open={!!selectedId}
        handler={() => handleOpen(null)}
        size={'sm'}
        className='rounded-none'
      >
        <DialogBody>
          <div className='flex justify-center'>
            <div className='flex gap-2'>
              <div className='px-3'>
                <p className='mt-2 font-headingfont font-semibold text-custom-headingclr text-sm'>
                  Are you sure you want to remove this address ?
                </p>
              </div>
            </div>
          </div>
          <hr className='my-2' />
          <div className='flex justify-center gap-5 mt-3'>
            <Button
              className='px-6 py-2 rounded-none'
              onClick={() => handleOpen(null)}
            >
              No
            </Button>
            <Button
              className='bg-red-600 px-6 py-2 rounded-none'
              onClick={() => {
                if (selectedId) {
                  removeAddress(selectedId)
                  handleOpen(null)
                }
              }}
            >
              Yes
            </Button>
          </div>
        </DialogBody>
      </Dialog>
      {/* remove popup end */}
      {/* Model Popup end */}

      {/* content end */}
    </>
  )
}

export default DeliveryAddress
