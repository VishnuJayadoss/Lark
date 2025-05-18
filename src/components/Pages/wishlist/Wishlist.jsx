import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Card1 from "../../../assets/productlist/card1.webp";
import axios from "../../../axios.js";
import cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogBody,
  Card,
} from "@material-tailwind/react";
import NodataImg from "../../../assets/nodata.png";
import Skeleton from "react-loading-skeleton";
import Count from "../../layouts/Count.jsx";
import NodataButton from "../../layouts/NodataButton.jsx";
const Wishlist = () => {
  const [triggerCount, setTriggerCount] = useState(false);
  // API CALL
  const cookiesUser = JSON.parse(cookies.get("user"));
  const cookiesToken = cookies.get("token");
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // setLoading(true);
      const res = await axios.get(`/v2/wishlists/${cookiesUser.id}`, {
        headers: {
          Authorization: `Bearer ${cookiesToken}`,
        },
      });
      // console.log("fetch data response", res);

      if (res.data.success === true) {
        setWishlistData(res.data?.data || []);
      }
      console.log("wishlist response", res.data.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistData([]);
    } finally {
      setLoading(false);
    }
  };

  // Modal popup
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const handleOpen = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setSelectedSize(null);
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  // Skeleton loader
  const renderProductSkeletons = () =>
    Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="col-span-6 md:col-span-3 mx-auto transition-opacity duration-500"
      >
        <Card className="m-2 p-2 rounded-none transition-opacity duration-500 mobskeleton">
          <div className="p-3">
            {/* card */}

            <Skeleton
              className={`relative grid md:h-56 h-36 place-items-center bg-gray-300 transition-opacity duration-500 ${
                loading ? "opacity-100" : "opacity-0"
              }`}
            />

            <div className="mt-2 px-3">
              <Skeleton
                count={4}
                className={`transition-opacity duration-500 ${
                  loading ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>
        </Card>
      </div>
    ));
  // Skeleton loader end

  // remove wishlist item
  const removeWishlistItem = async (productId) => {
    try {
      const res = await axios.get("/v2/wishlists-remove-product", {
        headers: {
          Authorization: `Bearer ${cookiesToken}`,
        },
        params: {
          product_id: productId,
        },
      });
      fetchData();
      toast.success("Product remove from your wishlist");
      setTriggerCount((data) => !data);
      console.log("response", res.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select your size");
      return;
    }

    try {
      // 1. Remove from wishlist
      await axios.get("/v2/wishlists-remove-product", {
        headers: { Authorization: `Bearer ${cookiesToken}` },
        params: { product_id: selectedProduct?.id },
      });

      // 2. Add to cart
      await axios.post(
        "/v2/carts/add",
        {
          id: selectedProduct?.id,
          user_id: cookiesUser?.id,
          quantity: 1,
          variant: selectedSize,
        },
        {
          headers: { Authorization: `Bearer ${cookiesToken}` },
        }
      );

      toast.success("Successfully added in cart");
      setOpen(false);
      fetchData();
      setTriggerCount((prev) => !prev);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <>
      <Count triggerCount={triggerCount} />
      <ToastContainer className="z-[9999999]" />
      {/* content start */}
      <div className="mx-auto mt-28 md:mt-20 mb-10 container">
        <div className="grid grid-cols-12">
          {loading ? (
            renderProductSkeletons()
          ) : (
            <>
              {wishlistData.length === 0 ? (
                <>
                  <div className="col-span-12 mt-10 text-center">
                    <div className="flex justify-center items-center">
                      <img
                        src={NodataImg}
                        alt="nodata"
                        className="my-3 w-[30%]"
                      />
                    </div>
                    <h2 className="font-bold text-md text-theme-primary tracking-wide">
                      Your wishlist is lonely and looking for love.
                    </h2>
                    <p className="my-4 text-md text-theme-primary/70 tracking-wide">
                      Add products to your wishlist, review them anytime and
                      easily move to cart.
                    </p>
                    <NodataButton />
                  </div>
                </>
              ) : (
                <>
                  {" "}
                  <div
                    className={`col-span-12 m-3 transition-opacity duration-500 ${
                      !loading ? "opacity-100" : "opacity-0 hidden"
                    }`}
                  >
                    <h2 className="font-themefont font-extrabold text-md text-theme-primary">
                      My Wishlist{" "}
                      <span className="text-theme-primary/50 text-sm">
                        ({wishlistData.length} items)
                      </span>
                    </h2>
                  </div>
                  {wishlistData.map((item) => (
                    <div
                      key={item.id}
                      className={`col-span-6 md:col-span-3 p-3 transition-opacity duration-500 ${
                        loading ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <div className="relative">
                        <Link to={`/product-details/${item.product?.slug}`}>
                          <div className="relative">
                            <img
                              src={item.product?.thumbnail_image}
                              className="md:rounded-none rounded-t-md hover:scale-110 transition-transform duration-300 transform"
                              alt={item.product?.name}
                            />
                            <img
                              src={item.product?.thumbnail_image_second}
                              className="top-0 left-0 absolute opacity-0 hover:opacity-100 rounded-md md:rounded-none transition-opacity duration-300 transform"
                              alt="New Image"
                            />
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                          >
                            <button
                              onClick={() =>
                                removeWishlistItem(item.product?.id)
                              }
                            >
                              <div className="top-3 right-3 absolute bg-theme-secondary/40 p-1 rounded-full cursor-pointer">
                                <X className="w-4 h-4 text-theme-primary md:hover:text-theme-primary" />
                              </div>
                            </button>
                          </div>

                          <div className="px-3 border border-theme-primary/20 md:rounded-none rounded-b-md">
                            <p className="mt-2 font-headingfont font-semibold text-[13px] text-custom-headingclr line-clamp-1">
                              {item.product?.name} {item.product?.id}
                            </p>
                            <hr className="my-1" />
                            <p className="font-themefont font-thin text-[13px] text-custom-headingclr/50 line-clamp-1">
                              {item.product?.tag}
                            </p>

                            <div className="mt-2">
                              <p className="font-headingfont font-semibold text-custom-headingclr text-sm">
                                {item.product?.base_price}
                              </p>
                            </div>

                            <div className="my-2 mt-2 text-end">
                              <Button
                                className="bg-theme-secondary hover:bg-theme-primary border-2 border-theme-primary rounded-none w-full text-theme-primary hover:text-theme-secondary duration-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleOpen(item.product);
                                }}
                              >
                                Move To Cart
                              </Button>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      <Dialog
        open={open}
        handler={() => handleOpen(null)}
        size="sm"
        className="z-9 rounded-none"
      >
        <DialogBody>
          <div className="flex justify-around">
            <div className="flex gap-2">
              <img
                src={selectedProduct?.thumbnail_image}
                alt={selectedProduct?.name}
                className="w-1/5 object-cover"
              />

              <div className="px-3 max-w-[200px] md:max-w-[280px]">
                <p className="mt-2 font-headingfont font-semibold text-[13px] text-custom-headingclr line-clamp-1">
                  {selectedProduct?.name}
                </p>
                <hr className="my-1" />
                <p className="font-themefont font-thin text-[13px] text-custom-headingclr/50 line-clamp-1">
                  {selectedProduct?.tag}
                </p>

                <div className="mt-2">
                  <p className="font-headingfont font-semibold text-custom-headingclr text-sm">
                     {selectedProduct?.base_price}
                  </p>
                </div>
              </div>
            </div>

            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => handleOpen(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
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

          <div className="mt-2">
            <Typography
              color="blue-gray"
              className="my-4 px-2 font-headingfont font-semibold text-custom-headingclr text-md md:text-sm"
            >
              Please select your size
            </Typography>

            <form action="">
              <div className="flex flex-row flex-wrap gap-2 mt-4 ml-2 px-2 pb-8 font-headingfont">
                {selectedProduct?.choice_options
                  ?.find((opt) => opt.attribute_name === "Size")
                  ?.options.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`bg-transparent border p-[15px] border-custom-headingclr rounded-none w-[50px] text-custom-headingclr
                ${
                  selectedSize === size
                    ? "bg-theme-primary text-theme-secondary"
                    : ""
                }
              `}
                    >
                      {size}
                    </Button>
                  ))}
              </div>

              <Button
                className="bg-theme-primary mt-4 rounded-none w-full"
                onClick={handleAddToCart}
              >
                Add To Cart
              </Button>
            </form>
          </div>
        </DialogBody>
      </Dialog>

      {/* Modal Popup end */}
      {/* content end */}
    </>
  );
};

export default Wishlist;
