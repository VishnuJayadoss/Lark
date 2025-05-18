import React, { useEffect, useState } from "react";

import { TriangleAlert, ChevronRight } from "lucide-react";
import { Card } from "@material-tailwind/react";
import SideProfiles from "./SideProfiles";
import axios from "../../../axios.js";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import NodataImg from "../../../assets/nodata.png";
import NodataButton from "../../layouts/NodataButton.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const OrderList = () => {
  // get user id
  const token = Cookies.get("token");
  let cookiesUser = "";
  if (Cookies.get("user")) {
    cookiesUser = JSON.parse(Cookies.get("user"));
  }

  // Api call start

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
      console.log("order response", res.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  // Api call End

  // navigate to productpage
  const navigate = useNavigate();

  const NavigatetoProduct = (data) => {
    navigate(`/product-details/${data}`);
  };

  // loader start
  const renderOrderCardSkeletons = () =>
    Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="shadow-lg mt-2 p-3 border border-theme-primary/10 rounded-none w-full"
      >
        {/* Mobile view delivery status */}
        <div className="md:hidden block mb-2">
          <div className="flex items-center gap-1 text-theme-primary text-xs">
            <Skeleton className="h-3 w-3 rounded-full bg-gray-300" />
            <Skeleton className="h-3 w-24 bg-gray-300 rounded" />
          </div>
        </div>

        <hr className="md:hidden block mb-4" />

        {/* Main content grid */}
        <div className="items-center gap-5 md:gap-3 grid grid-cols-3 md:grid-cols-4">
          {/* Image thumbnail */}
          <div className="md:w-[60px]">
            <Skeleton className="w-full h-[60px] bg-gray-300" />
          </div>

          {/* Product name */}
          <div className="flex justify-center md:justify-start">
            <Skeleton className="h-4 w-24 bg-gray-300 rounded" />
          </div>

          {/* Delivery status (desktop only) */}
          <div className="hidden md:flex justify-center">
            <div className="flex items-center gap-1 text-theme-primary text-xs">
              <Skeleton className="h-3 w-3 rounded-full bg-gray-300" />
              <Skeleton className="h-3 w-20 bg-gray-300 rounded" />
            </div>
          </div>

          {/* Arrow icon */}
          <div className="flex justify-center">
            <Skeleton className="h-4 w-4 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    ));
  // loader end
  return (
    <>
      {/* content start */}
      <div className="mx-auto mt-24 md:mt-20 container">
        <div className="grid grid-cols-12">
          {/* section 1 start*/}
          <div className="col-span-12 bg-theme-primary mx-4 md:mx-0 mt-2 md:mt-0 text-theme-secondary">
            <div className="flex lg:flex-row flex-col items-center gap-3 p-8 font-headingfont text-[13px] text-justify leading-[1.5] tracking-wide">
              <TriangleAlert className="w-14" />
              <p>
                Hey! Please note that The Lark Brennet team will never ask you
                to disclose any financial information or for payment regarding
                any contest. For COD orders we do not collect money before the
                order delivery. Do not share any such sensitive details. Stay
                secure and stay safe.
              </p>
            </div>
          </div>
          {/* section 1 End*/}

          {/* section 1 start*/}

          <SideProfiles />
          <div className="col-span-12 sm:col-span-12 lg:col-span-8 lg:mx-2 mt-9 mb-10 px-4">
            <h3 className="mt-1 font-themefont text-theme-primary text-sm">
              Orders
            </h3>
            <hr className="mt-2 mb-3" />
            {loading ? (
              renderOrderCardSkeletons()
            ) : (
              <>
                {ordersList.length !== 0 ? (
                  <Card className="rounded-none shadow-none">
                    {ordersList.map((order) => (
                      <div key={order.id} className="mb-10 bg-gray-300">
                        {/* Order ID */}
                        <div>
                          <p className="text-xs mx-2 mt-2">
                            Order ID = {order.id}
                          </p>
                        </div>

                        {/* Order Card */}
                        <Card className="shadow-lg mt-2 p-3 border border-theme-primary/10 rounded-none w-full">
                          {/* Product List under one Order */}
                          {order.order_details?.map((items, index) => (
                            <div
                              key={index}
                              className="mb-4 border border-gray-200 rounded-none p-2 bg-white"
                            >
                              {/* Mobile View Status */}
                              <div className="md:hidden block mb-2">
                                <div className="flex items-center gap-1 text-theme-primary text-xs">
                                  <div
                                    className={`h-3 w-3 border-2 ${
                                      order.delivery_status === "cancelled"
                                        ? "border-red-500 bg-red-500"
                                        : "border-green-500 bg-green-500"
                                    } rounded-full`}
                                  ></div>
                                  <span className="w-full line-clamp-1">
                                    {order.delivery_status}
                                  </span>
                                </div>
                              </div>

                              {/* Product Info */}
                              <div className="items-center gap-5 md:gap-3 grid grid-cols-3 md:grid-cols-4">
                                <div className="md:w-[60px]">
                                  <img
                                    src={items.thumbnail_image}
                                    alt={items.product_name}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      NavigatetoProduct(items.product_slug);
                                    }}
                                    className="w-full h-auto cursor-pointer"
                                  />
                                </div>
                                <div className="flex justify-center md:justify-start">
                                  <p className="text-theme-primary text-xs line-clamp-2">
                                    {items.product_name}
                                  </p>
                                </div>

                                {/* Desktop View Status */}
                                <div className="hidden md:block">
                                  <div className="flex justify-center">
                                    <div className="flex items-center gap-1 text-theme-primary text-xs">
                                      <div
                                        className={`h-3 w-3 border-2 rounded-full ${
                                          items.delivery_status === "pending"
                                            ? "border-yellow-500 bg-yellow-500"
                                            : items.delivery_status ===
                                              "cancelled"
                                            ? "border-red-500 bg-red-500"
                                            : "border-green-500 bg-green-500"
                                        }`}
                                      ></div>
                                      <span className="w-full line-clamp-1">
                                        {items.delivery_status}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className="flex justify-center cursor-pointer"
                                  onClick={() =>
                                    navigate(
                                      `/order-details?order_id=${order.id}&product_id=${items.product_id}&slug=${items.product_slug}`
                                    )
                                  }
                                >
                                  <ChevronRight className="size-4" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </Card>
                      </div>
                    ))}
                  </Card>
                ) : (
                  <>
                    <div className="mt-10 text-center">
                      <div className="flex justify-center items-center">
                        <img
                          src={NodataImg}
                          alt="nodata"
                          className="my-3 w-[30%]"
                        />
                      </div>
                      <h2 className="font-bold text-md text-theme-primary tracking-wide">
                        You haven't placed any orders yet.
                      </h2>
                      <p className="my-4 text-md text-theme-primary/70 tracking-wide">
                        Browse products, place an order, and your history will
                        appear here.
                      </p>
                      <NodataButton />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          {/* section 1 End*/}
        </div>
      </div>

      {/* content end */}
    </>
  );
};

export default OrderList;
