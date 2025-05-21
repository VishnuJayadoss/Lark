import React, { useEffect, useState, useRef } from "react";

import {
  Card,
  Button,
  Breadcrumbs,
  Dialog,
  DialogBody,
  IconButton,
  Radio,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "../../../axios.js";
import Cookies from "js-cookie";
import OrderTimeline from "./OrderTimeline.jsx";
import { toast, ToastContainer } from "react-toastify";
import ReviewPopup from "./ReviewPopup.jsx";

const OrderDetails = () => {
  // useNavigate
  const navigate = useNavigate();
  // Remove Modal popup Start
  const [orderCancel, setOrderCancel] = useState(false);
  const handleOrder = () => {
    setOrderCancel((data) => !data);
  };

  // fetch token
  const location = useLocation();
  const token = Cookies.get("token");
  // api call

  const [orderDetailsForPro, setOrderDetailsForPro] = useState([]);

  // Parse query params
  const queryParams = new URLSearchParams(location.search);
  const order_id = queryParams.get("order_id");
  const product_id = queryParams.get("product_id");

  useEffect(() => {
    if (order_id && product_id) {
      fetchOrderDetails({ order_id, product_id });
    }
  }, [order_id, product_id]);

  const fetchOrderDetails = async ({ order_id, product_id }) => {
    try {
      const res = await axios.get(
        `/v2/order-product/${order_id}/${product_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        console.log("datas", res.data?.data);

        setOrderDetailsForPro(res.data?.data);
      }
    } catch (error) {
      console.error(
        "Fetch error:",
        error.response?.data?.message || error.message
      );
    }
  };

  console.log("orderDetailsForPro", orderDetailsForPro);
  const status = orderDetailsForPro?.delivery_status;

  // order cancel start
  const reasons = [
    "Changed my mind",
    "Ordered by mistake",
    "Expected faster delivery",
    "Ordered the wrong item",
    "Need to change shipping address",
    "Others",
  ];
  const [reasonsState, setReasonsState] = useState("");
  const remarkRef = useRef(null);

  const cancelOrder = async () => {
    const remarkValue = remarkRef.current?.value || "";

    try {
      const errorFormData = {
        order_id: order_id,
        product_id: product_id,
        reason: reasonsState,
        remark: remarkValue,
      };
      const res = await axios.post("/v2/order/item-cancel", errorFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseForApi = res.data;
      if (responseForApi.result === true) {
        if (order_id && product_id) {
          fetchOrderDetails({ order_id, product_id });
        }
        setOrderCancel(false);
        toast.success(responseForApi.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // order cancel end

  // review product start

  const [reviewAdd, setReviewAdd] = useState(false);
  const AddReview = () => setReviewAdd((data) => !data);
  // review product end

  return (
    <>
      <ToastContainer />
      {/* content start */}
      <div className="container mx-auto md:mt-20 mb-10 mt-24">
        <div className="grid grid-cols-12">
          {/* section 1 start*/}
          <div className="col-span-12">
            <Breadcrumbs className="bg-transparent">
              <Link
                to={"/"}
                className="opacity-60 hover:text-theme-primary lg:text-sm text-xs  duration-300"
              >
                Home
              </Link>
              <Link
                to={"/orderlist"}
                className="opacity-60 hover:text-theme-primary lg:text-sm text-xs  duration-300"
              >
                Order List
              </Link>
              <a
                href="#"
                className="hover:text-theme-primary lg:text-sm text-xs duration-300 capitalize"
              >
                {orderDetailsForPro.product_name}
              </a>
            </Breadcrumbs>
          </div>
          {/* section 1 End*/}

          {/* section 1 start*/}

          <div className="lg:col-span-8 col-span-12  mx-3">
            <Card className="shadow-md rounded-none border-2 lg:p-10 p-5">
              <div>
                <div className="grid grid-cols-2">
                  <div>
                    <p className="text-md text-theme-primary font-themefont">
                      {orderDetailsForPro.product_name}
                    </p>
                    <p className="text-xs mt-1 text-theme-primary/70 tracking-wide">
                      {orderDetailsForPro.variation},{" "}
                      {orderDetailsForPro.color_name}
                    </p>
                    <p className="text-xs mt-2 text-theme-primary/70 tracking-wide">
                      {orderDetailsForPro.price}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <img
                      src={orderDetailsForPro.thumbnail_image}
                      alt="test"
                      className="lg:w-1/5 w-[50%] cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/product-details/${orderDetailsForPro.product_slug}`
                        )
                      }
                    />
                  </div>
                </div>

                <hr className="mt-5" />
                <div className="w-full mt-10">
                  <OrderTimeline currentStatus={status} />
                </div>
                {orderDetailsForPro?.delivery_status === "cancelled" ? null : (
                  <>
                    {orderDetailsForPro?.delivery_status === "delivered" ? (
                      <div className="mt-8 ">
                        <Button
                          onClick={AddReview}
                          className="text-xs w-full tracking-wider rounded-none bg-theme-secondary text-theme-primary border-2 border-theme-primary hover:bg-theme-primary hover:text-theme-secondary duration-300"
                        >
                          Add Review
                        </Button>
                      </div>
                    ) : (
                      <>
                        <hr />
                        <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-8 gap-2 mt-8">
                          <Button
                            onClick={handleOrder}
                            className="bg-theme-secondary text-theme-primary border-2 border-theme-primary text-xs tracking-wider rounded-none"
                          >
                            Cancel
                          </Button>
                          <Button className="text-xs tracking-wider rounded-none">
                            Track your Order
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-4 col-span-12 mx-3 mt-5 mb-20 lg:mt-0">
            <Card className="p-5 border-2 rounded-none shadow-md">
              <h2 className="text-xs text-theme-primary/50 font-themefont mb-2">
                Shipping Details
              </h2>
              <div className="bg-gray-50 p-4 border shadow-sm font-themefont">
                <div className="my-2">
                  <h3 className="text-md text-theme-primary">
                    {orderDetailsForPro.shipping_address?.name}
                  </h3>
                </div>

                <div className="my-2">
                  <p className="text-xs text-theme-primary/70 leading-5 tracking-wide">
                    {orderDetailsForPro.shipping_address?.address},<br />
                    {orderDetailsForPro.shipping_address?.city} -{" "}
                    {orderDetailsForPro.shipping_address?.postal_code}, <br />
                    {orderDetailsForPro.shipping_address?.state},
                  </p>
                </div>

                <div className="my-2">
                  <p className="text-xs text-theme-primary/70 tracking-wide">
                    Phone number: {orderDetailsForPro.shipping_address?.phone}
                  </p>
                </div>
              </div>
            </Card>
            <hr className="my-5" />
            {/* <Card className="p-5 border-2 mt-5 shadow-md rounded-none">
              <h2 className="text-xs text-theme-primary/50 font-themefont mb-2">
                Price Details
              </h2>
              <div className="p-5 border-2 shadow-md">
                <div className="bg-gray-50 p-4 border shadow-sm font-themefont">
                  <div className="flex justify-between text-sm text-theme-primary/80 my-2">
                    <span className="text-xs">Selling Price</span>
                    <span className="text-xs">- ₹ 200.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-theme-primary/80 my-2">
                    <span className="text-xs">Extra Discount</span>
                    <span className="text-xs">₹ 867.43</span>
                  </div>
                  <div className="flex justify-between text-sm text-theme-primary/80 my-2">
                    <span className="text-xs">Special Price</span>
                    <span className="text-xs">₹ 10</span>
                  </div>
                  <div className="flex justify-between text-sm text-theme-primary/80 my-2">
                    <span className="text-xs">Platform fee</span>
                    <span className="text-xs">₹ 3</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between font-semibold text-md text-theme-primary ">
                    <span className="text-xs">Total Amount</span>
                    <span className="text-xs">₹ 7095.00</span>
                  </div>
                </div>
              </div>

              <hr className="my-3" />
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-theme-primary/50 border-2 border-theme-primary/50"></div>
                  <p className="text-xs font-themefont">
                    Cash On Delivery: ₹ 338.0
                  </p>
                </div>
              </div>
            </Card> */}
          </div>

          {/* section 1 End*/}
        </div>
      </div>

      {/* content end */}

      {/* Review popup start */}
      <ReviewPopup
        AddReview={AddReview}
        reviewAdd={reviewAdd}
        setReviewAdd={setReviewAdd}
        orderDetailsForPro={orderDetailsForPro}
      />
      {/* Review Popup end */}

      {/* Modal start */}
      <Dialog
        open={orderCancel}
        handler={handleOrder}
        size={"sm"}
        className="rounded-none"
      >
        <DialogBody>
          <div className="flex justify-around">
            <div className="flex gap-2">
              <img
                src={orderDetailsForPro.thumbnail_image}
                alt="selected"
                className="md:w-1/6 w-1/4 "
              />

              <div className="px-3 md:max-w-[280px] max-w-[200px]">
                <p className="mt-2 text-custom-headingclr lg:text-[13px] text-[11px] font-semibold font-headingfont line-clamp-1">
                  Cancel Item From Orders
                </p>
                <p className="text-theme-primary/40 text-[11px] lg-text-[11px] mt-2 font-thin tracking-wide font-themefont">
                  Are you sure you want to Cancel this order?
                </p>
              </div>
            </div>

            <IconButton variant="text" color="blue-gray" onClick={handleOrder}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          <hr className="my-4" />
          <div>
            <div className="flex flex-col ">
              <p className="text-sm text-red-500">Cancel Reasons</p>
              {reasons.map((reason, index) => (
                <Radio
                  key={index}
                  name="cancel-reason"
                  value={reason}
                  size="xs"
                  onChange={(e) => setReasonsState(e.target.value)}
                  label={
                    <Typography
                      color="blue-gray"
                      className="text-xs font-medium text-blue-gray-700"
                    >
                      {reason}
                    </Typography>
                  }
                />
              ))}
            </div>
            {reasonsState === "Others" ? (
              <>
                <div className="my-4 mx-4">
                  <div className="w-full">
                    <div className="w-full">
                      <label className="text-sm text-gray-600">Remarks</label>
                      <textarea
                        ref={remarkRef}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-theme-primary/20 focus:ring focus:ring-theme-primary/20"
                        rows={3}
                        placeholder="Enter your remarks..."
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="mt-2">
            <div className="grid grid-cols-2 gap-5">
              <Button
                className="lg:test-xs text-[10px] py-2 lg:py-3 px-2 lg:px-3 bg-theme-primary/10 text-theme-primary border border-theme-primary tracking-wider rounded-none"
                onClick={handleOrder}
              >
                Don't Cancel
              </Button>
              <Button
                className="lg:test-xs text-[10px] py-2 lg:py-3 px-2 lg:px-3 tracking-wider rounded-none"
                onClick={cancelOrder}
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </DialogBody>
      </Dialog>
      {/* Model End */}
    </>
  );
};

export default OrderDetails;
