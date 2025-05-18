import { React, useState, useEffect } from "react";
import Productimg from "../../../assets/category/bottom.webp";
import Count from "../../layouts/Count.jsx";
import axios from "../../../axios.js";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import Thank from "../../../assets/thankyou.jpg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const Thankyou = () => {
  // responsive start
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
 
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // responsive end
 
  // get user id
  const token = Cookies.get("token");
  let cookiesUser = "";
  if (Cookies.get("user")) {
    cookiesUser = JSON.parse(Cookies.get("user"));
  }
  // get user id
 
  // triggerCount count start
  const [triggerCount, setTriggerCount] = useState(false);
  useEffect(() => {
    setTriggerCount(true);
  }, []);
  // triggerCount count end
  const [ordersList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchOrders();
  }, []);
 
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/v2/my-orders/${cookiesUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data?.success === true) {
        const getTotalOrders = res.data?.orders?.data;
        setOrderList(getTotalOrders);
      }
      // console.log("order response", res.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  // console.log("data", ordersList);
  const lastOrder = ordersList[ordersList.length - 1];
  const lastOrderItemsCount = lastOrder ? lastOrder.order_details.length : 0;

  // skeleton Loader start
 
  const renderOrderSkeleton = () => (
    <div className="mx-4 my-10 p-6 bg-white border shadow-sm animate-pulse">
      {/* Thank You Image Placeholder */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-16 border-b">
        <Skeleton circle width={288} height={192} className="mb-6" />{" "}
        {/* 72*48 *4 */}
        <Skeleton width={200} height={20} className="mb-1" />
        <Skeleton width={150} height={16} className="mb-5" />
        <Skeleton width={150} height={40} />
      </div>
 
      {/* Order Summary */}
      <h3 className="text-xl font-bold text-black mb-6 border-b pb-3">
        <Skeleton width={150} height={28} />
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border">
            <Skeleton width={80} height={14} className="mb-2" />
            <Skeleton width={100} height={20} />
          </div>
        ))}
      </div>
 
      {/* Shipping Address */}
      <div className="mt-6">
        <h4 className="text-md font-bold font-themefont text-gray-700 mb-2">
          <Skeleton width={180} height={20} />
        </h4>
        <div className="text-sm text-gray-700 border p-4 bg-gray-50 space-y-1">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} width={`90%`} height={16} />
          ))}
        </div>
      </div>
 
      {/* Ordered Products */}
      <div className="mx-4 mb-10 space-y-4 mt-10">
        <h3 className="text-xl font-bold font-themefont text-black mb-6 border-b pb-3">
          <Skeleton width={120} height={28} />
        </h3>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
          {[...Array(2)].map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 border p-4 bg-white shadow-sm"
            >
              <Skeleton width={80} height={80} /> {/* Image */}
              <div className="flex flex-col flex-1 gap-1">
                <Skeleton width={`80%`} height={20} />
                <Skeleton width={`60%`} height={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
 
  // skeleton Loader end
 
  return (
    <>
      {loading && renderOrderSkeleton()}
      {lastOrder && (
        <>
          <Count triggerCount={triggerCount} />
          {/* Thank You Section */}
          <section className="min-h-[60vh] mx-4 font-themefont flex flex-col items-center justify-center text-center px-4 py-16 bg-white border-b">
            <img
              src={Thank}
              alt="Thank You"
              className="w-72 h-48 object-contain mb-6"
            />
            <p className="text-gray-600  mb-1">
              Your order has been placed successfully.
            </p>
            <p className="text-gray-700 text-sm mb-5">
              Order ID: <span className="font-medium">{lastOrder.id}</span>
            </p>
            <Link to="/">
              <button className="bg-black text-white px-5 py-2 hover:bg-gray-900 transition">
                Continue Shopping
              </button>
            </Link>
          </section>
 
          {/* Order Summary */}
          <div className="mx-4 my-10 p-6 font-themefont bg-white  border shadow-sm">
            <h3 className="text-xl font-bold text-black mb-6 border-b pb-3">
              Order Summary
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="p-4 border">
                <p className="text-gray-500">Total</p>
                <p className="text-black font-medium mt-2">{lastOrder.total}</p>
              </div>
              <div className="p-4 border">
                <p className="text-gray-500">Payment</p>
                <p className="text-black font-medium mt-2">
                  {lastOrder.payment_status === "unpaid"
                    ? "Cash on Delivery"
                    : lastOrder.payment_status}
                </p>
              </div>
              <div className="p-4 border">
                <p className="text-gray-500">Phone</p>
                <p className="text-black font-medium mt-2">
                  {lastOrder.phone || lastOrder.shipping_address?.phone}
                </p>
              </div>
            </div>
 
            {/* Address */}
            <div className="mt-6">
              <h4 className="text-md font-bold  font-themefont text-gray-700 mb-2">
                Shipping Address
              </h4>
              <div className="text-sm text-gray-700 border p-4 bg-gray-50 tracking-wide">
                <p>{lastOrder.shipping_address?.name},</p>
                <p>{lastOrder.shipping_address?.address},</p>
                <p>
                  {lastOrder.shipping_address?.city} - {lastOrder.shipping_address?.postal_code},{" "}
                
                </p>
                <p>
                    {lastOrder.shipping_address?.state_name}, {lastOrder.shipping_address?.country_name} 
                  
                </p>
              </div>
            </div>
          </div>
 
          {/* Ordered Products */}
          <div className="mx-4 mb-10 space-y-4">
            <h3 className="text-xl font-bold font-themefont text-black mb-6 border-b pb-3">
              Product
            </h3>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
              {lastOrder.order_details?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 border p-4 bg-white shadow-sm"
                >
                  <img
                    src={item.thumbnail_image || Productimg}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover"
                  />
                  <div>
                    <h5 className="text-black text-sm font-themefont">
                      {item.product_name}
                    </h5>
                    <p className="text-xs mt-2 text-gray-600 ">
                      Qty: {item.quantity} | Size: {item.variation || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};
 
export default Thankyou;