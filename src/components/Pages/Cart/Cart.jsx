import React, { useEffect, useState } from 'react'

import {
  Stepper,
  Step,
  Button,
  Typography,
  Radio,
  IconButton,
  Card,
  Dialog,
  DialogBody,
  Input,
  Select,
  Option,
  Checkbox,
  Accordion,
  AccordionHeader,
  AccordionBody
} from '@material-tailwind/react'
import NodataImg from '../../../assets/nodata.png'
import { useForm } from 'react-hook-form'

import { MapPin, ShoppingBag, IndianRupee, TicketPercent } from 'lucide-react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from '../../../axios.js'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import BIllingAddress from './BIllingAddress.jsx'
import Count from '../../layouts/Count.jsx'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import NodataButton from '../../layouts/NodataButton.jsx'

function Icon ({ id, open }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={2}
      stroke='currentColor'
      className={`${
        id === open ? 'rotate-180' : ''
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M19.5 8.25l-7.5 7.5-7.5-7.5'
      />
    </svg>
  )
}
const Cart = () => {
  const { register, formState, reset, handleSubmit } = useForm();
  const { errors } = formState;
  const [activeStep, setActiveStep] = useState(2);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [cartRemoveId, setCartRemoveId] = useState(null);
  const [removeCartImage, setRemoveCartImage] = useState(null);
  const [triggerCount, setTriggerCount] = useState(false);
  const navigate = useNavigate();
  // Remove Modal popup Start
  const [removetoCart, setRemovetoCart] = useState(false)
  const handleRemove = ({ id, product_thumbnail_image }) => {
    setRemovetoCart(data => !data)
    setCartRemoveId(id)
    setRemoveCartImage(product_thumbnail_image)
  }
  //Remove Modal popup end

  const [open, setOpen] = useState(0)

  const handleOpen = value => setOpen(open === value ? 0 : value)

  // api call start
  const cookiesToken = Cookies.get('token')
  const cookiesUser = JSON.parse(Cookies.get('user'))
  const [cartItems, setCartItems] = useState([])
  const [cartItemDetails, setCartItemsdetails] = useState([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [payment, setPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [selectedItems, setSelectedItems] = useState([])
  const [billingAddressLength, setBillingAddressLength] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await axios.post(
        '/v2/carts',
        { user_id: cookiesUser.id },
        {
          headers: {
            Authorization: `Bearer ${cookiesToken}`
          }
        }
      )
      // console.log("res.data", res.data);

      // Set the cart items
      if (res.data.data.length > 0) {
        setGrandTotal(res.data?.grand_total)
        setCartItems(res.data?.data[0]?.cart_items)
        console.log(
          'res.data?.data[0]?.cart_items',
          res.data?.data[0]?.cart_items
        )

        setCartItemsdetails(res.data?.data[0])
      } else {
        setCartItems([])
        setCartItemsdetails([])
        setGrandTotal(0)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMasterCheckboxChange = async isChecked => {
    const readyToOrder = isChecked ? 0 : 1

    try {
      await Promise.all(
        cartItems.map(cart =>
          axios.post(
            '/v2/carts',
            {
              user_id: cookiesUser.id,
              cart_id: cart.id,
              ready_to_order: readyToOrder
            },
            {
              headers: {
                Authorization: `Bearer ${cookiesToken}`
              }
            }
          )
        )
      )
      console.log('All cart items updated successfully')

      setSelectedItems(isChecked ? cartItems.map(c => c.id) : [])
      await fetchData()
    } catch (error) {
      console.error('Error updating all cart items:', error)
    }
  }

  const handleCheckboxChange = async (cartId, isChecked) => {
    const readyToOrder = isChecked ? 0 : 1

    const formData = {
      user_id: cookiesUser.id,
      cart_id: cartId,
      ready_to_order: readyToOrder
    }
    try {
      const res = await axios.post('/v2/carts', formData, {
        headers: {
          Authorization: `Bearer ${cookiesToken}`
        }
      })
      console.log('Checkbox update success:', res.data)

      setSelectedItems(prev =>
        isChecked ? [...prev, cartId] : prev.filter(id => id !== cartId)
      )

      await fetchData()
    } catch (error) {
      console.error('Error updating cart item:', error)
    }
  }

  // cart items remove start
  const handleRemoveCartList = async () => {
    try {
      setRemovetoCart(data => !data)

      const res = await axios.get(`/v2/carts/delete/${cartRemoveId}`, {
        headers: {
          Authorization: `Bearer ${cookiesToken}`
        }
      })
      // refetch cart fetch api
      await fetchData()
      setTriggerCount(data => !data)
    } catch (error) {
      console.error('Error fetching CartRemove:', error)
    }
  };
  //checkout start
  const proceedCheckout = async () => {
    // console.log("proceedCheckout");
      const formData = {
      user_id: cookiesUser.id,
      grand_total: grandTotal,
      payment_type: 'cash_on_delivery'

       };
      try {

      const res = await axios.post(`/v2/checkout`, formData, {
        headers: {
          Authorization: `Bearer ${cookiesToken}`,
        },
      });
      // refetch cart fetch api
      console.log('res-',res);
      if (res.data?.result == true) {
        navigate("/thank-you");
        return;
      } else {
        toast.error("Something went wrong");
        return;
      }
    } catch (error) {
      console.error("Error :", error);
    }
  }
  // cart items remove end

  const handleMoveToWishlist = async (cartId, productId) => {
    const token = Cookies.get('token')
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null

    if (!user || !token) {
      toast.error('Please log in to move item to wishlist.')
      return
    }

    try {
      // 1. Remove from cart
      await axios.get(`/v2/carts/delete/${cartId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // 2. Add to wishlist
      await axios.get(`/v2/wishlists-add-product/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          product_id: productId
        }
      })

      await fetchData()
      setTriggerCount(data => !data)
      toast.success('Product successfully moved to wishlist!')
    } catch (error) {
      console.error('Move to wishlist error:', error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  const handleVariantChange = (cartId, newVariant) => {
    const updatedItems = cartItems.map(item =>
      item.id === cartId ? { ...item, variation: newVariant } : item
    )
    setCartItems(updatedItems)
  }

  const handleQuantityChange = async (cartId, quantity) => {
    const data = {
      id: cartId,
      quantity: quantity
    }
    try {
      const res = await axios.post('/v2/carts/change-quantity', data, {
        headers: {
          Authorization: `Bearer ${cookiesToken}`
        }
      })
      console.log('Cart Quantity update success:', res.data)
      setTriggerCount(data => !data)
      toast.success('Cart quantity updated successfully');

      await fetchData()
    } catch (error) {
      console.error('Error updating cart Quantity:', error)
      toast.error('Failed to update cart quantity');
    }
  }

  // form submit
  const [couponError, setCouponError] = useState('')
  const OnSubmit = async data => {
    const formData = {
      user_id: cookiesUser.id,
      coupon_code: data.coupon_code
    }

    try {
      const res = await axios.post('/v2/coupon-apply', formData, {
        headers: {
          Authorization: `Bearer ${cookiesToken}`
        }
      })
      const resData = res.data

      if (resData.result === false) {
        setCouponError(resData.message)
      } else {
        setCouponError(resData.message)
      }
    } catch (error) {
      console.log('coupan code', error)
      setCouponError('Something went wrong. Please try again.')
    }
  }

  // api call end

  // console.log("cartItems cartItems cartItems", cartItems);

  // Skeleton loader
  const renderProductSkeletons = () =>
    Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className='shadow-md mt-2 px-1 py-3 border-2 animate-pulse'
      >
        <div className='md:flex justify-between items-center gap-4'>
          <div className='flex items-center gap-1 md:gap-4 w-full'>
            {/* Checkbox skeleton */}
            <div className='bg-gray-300 rounded-sm w-4 h-4' />

            {/* Image skeleton */}
            <Skeleton
              height={100}
              width={100}
              className='rounded-md size-1/3'
            />

            {/* Product details skeleton */}
            <div className='flex-1 p-2 md:p-0'>
              <h3 className='font-themefont font-black text-theme-primary text-xs md:text-sm'>
                <Skeleton width={120} height={14} />
              </h3>
              <p className='mt-3 font-headingfont font-thin text-[10px] text-theme-primary md:text-xs'>
                <Skeleton width={180} height={12} />
              </p>

              {/* Size and Quantity */}
              <div className='items-center gap-2 lg:gap-5 grid grid-cols-1 lg:grid-cols-2 mt-2'>
                <Skeleton width={80} height={25} />
                <Skeleton width={60} height={25} />
              </div>

              {/* Price below for mobile */}
              <div className='md:hidden block mt-3'>
                <h3 className='font-themefont font-black text-[10px] text-theme-primary md:text-sm'>
                  <Skeleton width={100} height={14} />
                </h3>
              </div>

              {/* Estimated delivery */}
              <p className='mt-3 font-headingfont font-thin text-[10px] text-theme-primary md:text-[11px]'>
                <Skeleton width={140} height={10} />
              </p>
            </div>
          </div>

          {/* Price for desktop */}
          <div className='hidden md:block mr-2.5 w-full text-end'>
            <h3 className='font-themefont font-black text-theme-primary text-sm'>
              <Skeleton width={60} height={16} />
            </h3>
            <p className='mt-1 font-headingfont font-thin text-[10px] text-theme-primary md:text-xs'>
              <Skeleton width={100} height={12} />
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className='md:flex justify-end gap-2 grid grid-cols-2 mx-10 md:mx-0 md:mr-2.5 pt-2 md:pt-0'>
          <Skeleton height={35} width={100} />
          <Skeleton height={35} width={120} />
        </div>
      </div>
    ))
  // Skeleton loader end

  // navigate to category start
  // const NodataImage = () => {
  //   const userGender = cookiesUser?.gender;

  //   if (userGender == "Female") {
  //     navigate("/category/3");
  //     console.log("userGender female", userGender);
  //   } else if (userGender == "Male") {
  //     navigate("/category/2");
  //     console.log("userGender male", userGender);
  //   } else {
  //     navigate("/category/2");
  //     console.log("userGender unknow", userGender);
  //   }
  // };
  // navigate to category start

  return (
    <>
      <ToastContainer />
      <Count triggerCount={triggerCount} />
      {/* content start */}
      <div className='mx-auto mt-28 mb-10 container'>
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
                  <Link to='/deliveryaddress'>
                    <MapPin className='w-4 h-4' />
                  </Link>
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

          <div className='col-span-12 lg:col-span-8 mx-4 my-3 lg:my-2 lg:ml-8'>
            <div>
              <h2 className='mb-6 font-themefont text-theme-primary/70 xs:text-red-600 text-sm'>
                Delivery To
              </h2>
            </div>
            {/* add your address */}

            {/* address section start */}

            <BIllingAddress onAddressLengthChange={setBillingAddressLength} />

            {/* address section end */}
            {cartItems.length > 0 ? (
              <div className='flex justify-between items-center gap-4 shadow-md mt-2 px-1 py-1 border-2'>
                <label className='flex items-center gap-2 font-themefont text-blue-gray-700 text-xs tracking-wide cursor-pointer'>
                  <Checkbox
                    id='0'
                    onChange={e => handleMasterCheckboxChange(e.target.checked)}
                    checked={cartItems.length > 0 && cartItems.every(item => item.ready_to_order == 1)}
                    className='bg-theme-secondary checked:bg-theme-primary checked:border-gold border-theme-primary/30 w-4 h-4 text-gold'
                    ripple={true}
                  />
                  {`${selectedItems.length}/${cartItems.length} ITEMS SELECTED`}{' '}
                  ({grandTotal})
                </label>
              </div>
            ) : (
              ''
            )}

            {loading ? (
              renderProductSkeletons()
            ) : (
              <>
                {cartItems.length > 0 ? (
                  <>
                    {cartItems.map((cart, index) => (
                      <div
                        key={cart.id}
                        className='shadow-md mt-2 px-1 py-3 border-2'
                      >
                        <div className='md:flex justify-between items-center gap-4'>
                          <div className='flex items-center gap-1 md:gap-4 w-full'>
                            <Checkbox
                              id={`cart-${cart.id}`}
                              checked={
                                selectedItems.includes(cart.id) ||
                                cart.ready_to_order == 1
                              }
                              onChange={e =>
                                handleCheckboxChange(cart.id, e.target.checked)
                              }
                              className={`bg-theme-secondary checked:bg-theme-primary checked:border-gold border-theme-primary/30 w-4 h-4 text-gold`}
                              ripple={true}
                            />

                            <Link to={`/product-details/${cart.slug}`} className='w-40 md:w-full'>
                              <img
                                src={cart.product_thumbnail_image}
                                alt={cart.product_name}
                                className='size-1/2 cursor-pointer'
                              />
                            </Link>
                            <div className='p-2 md:p-0'>
                              <h3 className='font-themefont font-black text-theme-primary text-xs md:text-sm'>
                                {cart.product_name}
                              </h3>
                              <p className='mt-3 font-headingfont font-thin text-[10px] text-theme-primary md:text-xs'>
                                {cart.productDesc}
                              </p>
                              <div className='items-center gap-2 lg:gap-20 grid grid-cols-1 lg:grid-cols-2 mt-2'>
                                <div className='flex items-center gap-1 md:gap-1'>
                                  <label className='text-theme-primary text-xs md:text-sm'>
                                    Size:
                                  </label>
                                  <select
                                    id='variation'
                                    value={cart.variation}
                                    onChange={e =>
                                      handleVariantChange(
                                        cart.id,
                                        e.target.value
                                      )
                                    }
                                    className='block bg-gray-50 dark:bg-gray-700 p-1.5 px-1 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 w-100 text-gray-900 dark:text-white text-xs dark:placeholder-gray-400'
                                  >
                                    {cart.available_variants.map(
                                      (variant, i) => (
                                        <option key={i} value={variant.variant}>
                                          {variant.variant}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>

                                <div className='z-99 relative flex items-center gap-2.5 lg:gap-1'>
                                  <label className='text-theme-primary text-xs md:text-sm'>
                                    Qty:{' '}
                                  </label>
                                  <select
                                    value={cart.quantity}
                                    onChange={e =>
                                      handleQuantityChange(
                                        cart.id,
                                        e.target.value
                                      )
                                    }
                                    className='block bg-gray-50 dark:bg-gray-700 p-1.5 px-4 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 w-100 text-gray-900 dark:text-white text-xs dark:placeholder-gray-400'
                                  >
                                    {(() => {
                                      const variantData =
                                        cart.available_variants?.find(
                                          v => v.variant === cart.variation
                                        )
                                      const maxQty = Math.min(
                                        Number(variantData?.qty) || 1,
                                        10
                                      )

                                      return Array.from(
                                        { length: maxQty },
                                        (_, i) => i + 1
                                      ).map(qty => (
                                        <option key={qty} value={qty}>
                                          {qty}
                                        </option>
                                      ))
                                    })()}
                                  </select>
                                </div>
                              </div>

                              <div className='md:hidden block mt-3'>
                                <h3 className='font-themefont font-black text-[10px] text-theme-primary md:text-sm'>
                                  {cart.tot_price} MRP incl. of all taxes
                                </h3>
                              </div>

                              <p className='mt-3 font-headingfont font-thin text-[10px] text-theme-primary md:text-[11px]'>
                                Estimated Delivery by {cart.EstimatedDate}
                              </p>
                            </div>
                          </div>
                          <div className='hidden md:block mr-2.5 w-full text-end'>
                            <h3 className='font-themefont font-black text-theme-primary text-sm'>
                              ₹ {cart.price}
                            </h3>
                            <p className='mt-1 font-headingfont font-thin text-[10px] text-theme-primary md:text-xs'>
                              MRP incl. of all taxes
                            </p>
                          </div>
                        </div>
                        <div className='md:flex justify-end gap-2 grid grid-cols-2 mx-10 md:mx-0 md:mr-2.5 pt-2 md:pt-0'>
                          <Button
                            className='bg-theme-secondary px-4 py-2 border-2 border-theme-primary rounded-none font-themefont text-[10px] text-theme-primary tracking-wider'
                            onClick={() => handleRemove(cart)}
                          >
                            Remove
                          </Button>
                          <Button
                            onClick={() =>
                              handleMoveToWishlist(cart.id, cart.product_id)
                            }
                            className='p-2 rounded-none font-themefont text-[10px] tracking-wider'
                          >
                            Move To Wishlist
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className='mt-10 text-center'>
                      <div className='flex justify-center items-center'>
                        <img
                          src={NodataImg}
                          alt='nodata'
                          className='my-3 w-[30%]'
                        />
                      </div>
                      <h2 className='font-bold text-md text-theme-primary tracking-wide'>
                        Your Cart is lonely and looking for love.
                      </h2>
                      <p className='my-4 text-md text-theme-primary/70 tracking-wide'>
                        Add products to your cart, review them anytime and
                        easily move to cart.
                      </p>
                      <NodataButton />
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Delivery address End */}
          <div className='col-span-12 lg:col-span-4 mx-4 my-3 lg:my-4 md:mr-8'>
            <div>
              <div className='shadow-md md:mt-9 p-5 border-2'>
                <Accordion
                  open={open === 1}
                  icon={<Icon id={1} open={open} />}
                  className='shadow-md px-4 border-2'
                >
                  <AccordionHeader
                    onClick={() => handleOpen(1)}
                    className='border-0 font-themefont text-sm'
                  >
                    <div className='flex items-center gap-4'>
                      <TicketPercent /> Apply Coupan
                    </div>
                  </AccordionHeader>
                  <AccordionBody>
                    <div className='mb-2 md:mb-5'>
                      <form onSubmit={handleSubmit(OnSubmit)}>
                        <div className='flex justify-around w-full'>
                          <div className='relative'>
                            <Input
                              {...register('coupon_code')}
                              label='Enter Code Hear'
                              className='border-t-0 focus:border-t-0 w-[90%] md:w-full'
                            />
                          </div>

                          <Button
                            type='submit'
                            className='px-4 rounded-sm text-xs'
                            disabled={!cartItems.some(item => item.ready_to_order == 1)}
                          >
                            Apply
                          </Button>
                        </div>
                        {couponError && (
                          <p className='mt-1 px-4 text-red-500 text-sm'>
                            {couponError}
                          </p>
                        )}
                      </form>
                    </div>
                  </AccordionBody>
                </Accordion>

                {/* <Accordion
                  open={open === 2}
                  icon={<Icon id={2} open={open} />}
                  className="shadow-md px-4 border-2"
                >
                  <AccordionHeader
                    onClick={() => handleOpen(2)}
                    className="border-0 font-themefont text-sm"
                  >
                    <div className="flex items-center gap-4">
                      <TicketPercent />
                      Gift Voucher
                    </div>
                  </AccordionHeader>
                  <AccordionBody>
                    <div className="mb-2 md:mb-5">
                      <div className="flex justify-around w-full">
                        <div className="relative">
                          <Input
                            label="Enter Code Hear"
                            className="border-t-0 focus:border-t-0 w-[90%] md:w-full"
                          />
                        </div>

                        <Button className="px-4 rounded-sm text-xs">
                          Apply
                        </Button>
                      </div>
                    </div>
                  </AccordionBody>
                </Accordion> */}
              </div>

              <h2 className='mt-4 mb-4 font-themefont text-theme-primary/50 text-sm'>
                Billing Details
              </h2>

              <div className='shadow-md p-5 border-2'>
                <div className='bg-gray-50 shadow-sm p-4 border font-themefont'>
                  <div className='flex justify-between my-2 text-gray-700'>
                    <span className='text-xs'>
                      Cart Total (Excl. of all taxes)
                    </span>
                    <span className='text-xs'>{cartItemDetails.sub_total}</span>
                  </div>
                  <div className='flex justify-between my-2 text-red-600 text-sm'>
                    <span className='text-xs'>Discount</span>
                    <span className='text-xs'>
                      - {cartItemDetails.discount_total}
                    </span>
                  </div>
                  <div className='flex justify-between my-2 text-gray-700 text-sm'>
                    <span className='text-xs'>GST</span>
                    <span className='text-xs'>{cartItemDetails.tax_total}</span>
                  </div>
                  <div className='flex justify-between my-2 text-gray-500 text-sm'>
                    <span className='text-xs'>Shipping Charges</span>
                    <span className='text-xs'>
                      {cartItemDetails.ship_total}
                    </span>
                  </div>
                  <div className='flex justify-between my-2 text-gray-500 text-sm'>
                    <span className='text-xs'>Gift Packing Charges</span>
                    <span className='text-xs'>Free</span>
                  </div>
                  <hr className='my-3' />
                  <div className='flex justify-between font-semibold text-md text-theme-primary'>
                    <span className='text-xs'>Total Amount</span>
                    <span className='text-xs'>{grandTotal}</span>
                  </div>
                </div>

                {/* Continue to Payment Button */}

                <Button
                  onClick={() => setPayment(true)}
                  disabled={
                    !cartItems.some(item => item.ready_to_order == 1) || billingAddressLength === 0
                  }
                  className='mt-6 py-3 rounded-none w-full font-themefont font-semibold tracking-wider'
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* content end */}

      {/* Modal popup */}

      {/* remove popup start */}

      <Dialog
        open={removetoCart}
        handler={handleRemove}
        size={'sm'}
        className='rounded-none'
      >
        <DialogBody>
          <div className='flex justify-around'>
            <div className='flex gap-2'>
              <img
                src={removeCartImage}
                alt='selected'
                className='w-1/4 md:w-1/6'
              />

              <div className='px-3 max-w-[200px] md:max-w-[280px]'>
                <p className='mt-2 font-headingfont font-semibold text-[13px] text-custom-headingclr line-clamp-1'>
                  Remove Item From Cart
                </p>
                <p className='mt-2 font-themefont font-thin text-[13px] text-theme-primary/40 tracking-wide'>
                  Are you sure you want to remove this product from your cart?
                </p>
              </div>
            </div>

            <IconButton variant='text' color='blue-gray' onClick={handleRemove}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </IconButton>
          </div>
          <hr className='my-4' />
          <div className='mt-2'>
            <div className='gap-5 grid grid-cols-2'>
              <Button
                className='bg-theme-secondary border-2 border-theme-primary rounded-none text-theme-primary test-sm'
                onClick={handleRemove}
              >
                No
              </Button>
              <Button
                className='rounded-none test-sm'
                onClick={() => handleRemoveCartList(cartItemDetails.id)}
              >
                Yes
              </Button>
            </div>
          </div>
        </DialogBody>
      </Dialog>
      {/* remove popup end */}

      {/* payment popup start */}

      <Dialog open={payment} className='rounded-none'>
        <DialogBody className='relative'>
          {/* Close Button */}
          <div className='flex justify-between items-center'>
            <h3 className='font-semibold text-black'>
              Select Your Payment Method
            </h3>
            <div className='text-end'>
              <IconButton
                variant='text'
                color='blue-gray'
                onClick={() => setPayment(false)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </IconButton>
            </div>

            {/* Dialog Content */}
          </div>
          <div className='space-y-4 mt-6'>
            <Radio
              name='payment'
              label='Cash on Delivery (COD)'
              value='COD'
              checked={paymentMethod === 'COD'}
              onChange={() => setPaymentMethod('COD')}
            />
            <br></br>
            <Radio
              name='payment'
              label='Prepaid'
              value='Prepaid'
              checked={paymentMethod === 'Prepaid'}
              onChange={() => setPaymentMethod('Prepaid')}
              disabled
            />

            <div className='border-t text-end'>
              <button onClick={() => proceedCheckout()} className='bg-black mt-2 px-5 py-2 text-white'>
                Proceed
              </button>
            </div>
          </div>
        </DialogBody>
      </Dialog>
      {/* payment popup end */}
    </>
  )
}

export default Cart
