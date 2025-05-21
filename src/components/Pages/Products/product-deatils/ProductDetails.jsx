import React, { useState, useEffect, useRef } from "react";
import { ShoppingBag, Heart, Star, StarHalf } from "lucide-react";
import Instagram from "../../../../assets/productdetails/instagram.png";
import Whatsapp from "../../../../assets/productdetails/whatsapp.png";
import Twitter from "../../../../assets/productdetails/twitter.png";
import Facebook from "../../../../assets/productdetails/facebook.png";
import Cleancloths from "../../../../assets/productdetails/clean-clothes_1.svg";
import DeleveryStatus from "../../../../assets/productdetails/delivery-status.svg";
import Shipped from "../../../../assets/productdetails/shipped.svg";
import { useInView } from "react-intersection-observer";
import Clr0 from "../../../../assets/productdetails/clr0.webp";
import Clr1 from "../../../../assets/productdetails/clr1.webp";
import Clr2 from "../../../../assets/productdetails/clr2.webp";
import Clr3 from "../../../../assets/productdetails/clr3.webp";
import Clr4 from "../../../../assets/productdetails/clr4.webp";
import { Link, useNavigate, useParams } from "react-router-dom";
// axios
import axios from "../../../../axios.js";

// gsap animation
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductDetails.css";
import Slider from "react-slick";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Button,
  Card,
} from "@material-tailwind/react";

import RelatedProducts from "./RelatedProducts.jsx";
import Sizechart from "./Sizechart.jsx";
import ReviewSection from "./ReviewSection.jsx";
import NotifyPopup from "./NotifyPopup.jsx";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import WishlistButton from "../../wishlist/WishlistButton.jsx";
import Count from "../../../layouts/Count.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}
const ProductDetails = () => {
  const { slug } = useParams();
  const [open, setOpen] = useState(1);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  // buttons
  const [cart, setCart] = useState(false);
  // const [wishlist, setWishlist] = useState(false);

  // const addtoWishlist = () => {
  //   setWishlist((data) => !data);
  // };

  // responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // mobile banner slider

  var Banner = {
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  // color filter slider

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 7,
    autoplay: false,
    autoplaySpeed: 3000,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
    ],
  };

  // Drawer

  const [openRight, setOpenRight] = useState(false);
  const openDrawerRight = () => {
    setOpenRight(true);
  };

  // review drawer

  const [openReview, setOpenReview] = useState(false);
  const openRivewRight = () => {
    setOpenReview(true);
  };

  // notification
  const [notify, setNotify] = useState(false);
  const handleNotification = () => {
    setNotify(true);
  };

  // view port element animation
  const { ref: buttonRef, inView: topZero } = useInView();
  // console.log("topZero", topZero);

  const stickyRef = useRef(null);
  // scroll pin animation
  useGSAP(() => {
    if (!isMobile) {
      const stickyElement = document.querySelector(".stickyanm");

      if (stickyElement) {
        gsap.to(stickyElement, {
          scrollTrigger: {
            trigger: stickyElement,
            start: "top top",
            end: "+=500px",
            pin: true,
            scrub: 1,
            markers: false,
            pinSpacing: false,
          },
        });
      } else {
        console.warn("GSAP: .stickyanm element not found");
      }
    }
  });

  //  API CALL
  const [productDetailCollection, setProductDetailCollection] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [wishlistStatus, setWishlistStatus] = useState(false);
  const [colorFilter, setColorFilter] = useState([]);
  // const [] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ParentCategoryName, SetParentCategoryName] = useState("");
  const [CategoryName, SetCategoryName] = useState("");
  const [ProductName, SetProductName] = useState("");

  const navigate = useNavigate();
  const cookiesToken = Cookies.get("token");
  let cookiesUser = "";
  if (Cookies.get("user")) {
    cookiesUser = JSON.parse(Cookies.get("user")) || "";
  }

  const fetchData = async () => {
    try {
      const userId = {
        user_id: cookiesUser?.id,
      };
      const res = await axios.post(`/v3/product-details/${slug}`, userId, {
        headers: {
          Authorization: `Bearer ${cookiesToken}`,
        },
      });

      const prodDetails = res.data;
      console.log("res.datares.data", res.data);
      const FullProdDetails = prodDetails?.ProductDetailCollection?.data ?? [];
      const RelatedProd = prodDetails?.related_products?.data ?? [];
      const colorFilterOptions = prodDetails?.color_variants?.data ?? [];
      const ParentCategoryName = prodDetails?.product_categories?.[0] ?? [];
      const CategoryName = prodDetails?.product_categories?.[1] ?? [];
      const ProductName = prodDetails?.ProductDetailCollection?.data?.[0]?.name;

      SetParentCategoryName(ParentCategoryName);
      SetCategoryName(CategoryName);
      setProductDetailCollection(FullProdDetails);
      setRelatedProducts(RelatedProd);
      setColorFilter(colorFilterOptions);
      setWishlistStatus(prodDetails?.in_wishlist);
      setSelectedSize("");
      setCart(false);
      setselectedQty(1);
      SetProductName(ProductName);
    } catch (error) {
      console.log("prodDetails", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [slug]);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQty, setselectedQty] = useState(1);
  const [triggerCount, setTriggerCount] = useState(false);
  const addtoCart = async () => {
    if (selectedSize) {
      try {
        const cartData = {
          id: productDetailCollection[0]?.id,
          user_id: cookiesUser?.id,
          quantity: selectedQty,
          variant: selectedSize,
        };

        const res = await axios.post("/v2/carts/add", cartData, {
          headers: {
            Authorization: `Bearer ${cookiesToken}`,
          },
        });
        // console.log("res for add to cart", res.data);
        // console.log("selectedSize", selectedSize);
        toast.success("This producted added successfully");
        setCart((data) => !data);
        setTriggerCount((data) => !data);
      } catch (error) {
        console.log("add to cart", error);
        toast.error(error);
      }
    } else {
      toast.error("Please select size");
    }
  };

  // api call end

  const renderProductSkeletons = () =>
    Array.from({ length: 1 }).map((_, index) => (
      <div key={index} className="mx-auto px-2 container">
        <div className="gap-4 grid grid-cols-12">
          {/* Image Section */}
          <div className="col-span-12 md:col-span-7">
            {isMobile ? (
              <Skeleton className="bg-gray-300 w-full h-72" />
            ) : (
              <div className="gap-2 grid grid-cols-12">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="col-span-6">
                    <Skeleton className="bg-gray-300 w-full h-56" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail Section */}
          <div className="col-span-12 md:col-span-5">
            <Skeleton className="bg-gray-300 mb-2 w-3/4 h-8" /> {/* Title */}
            <Skeleton className="bg-gray-300 mb-2 w-1/2 h-4" /> {/* Tags */}
            <Skeleton className="bg-gray-300 mb-2 w-1/2 h-6" /> {/* Price */}
            <Skeleton className="bg-gray-300 mb-4 w-1/4 h-4" /> {/* Tax text */}
            <Skeleton className="bg-gray-300 mb-2 w-full h-12" /> {/* Slider */}
            <Skeleton className="bg-gray-300 mb-2 w-full h-6" />{" "}
            {/* Size options */}
            <Skeleton className="bg-gray-300 mb-4 w-full h-10" /> {/* Button */}
            <Skeleton className="bg-gray-300 w-full h-16" />{" "}
            {/* Policy icons */}
          </div>
        </div>
      </div>
    ));

  return (
    <div>
      <ToastContainer />
      <Count triggerCount={triggerCount} />
      <section className="mt-[100px] md:mt-20">
        {/* breadcrumbs */}

        {loading ? (
          renderProductSkeletons()
        ) : (
          <>
            {productDetailCollection.map((items, index) => (
              <div key={index} className="mx-auto container">
                <div className="px-1 md:px-0">
                  <nav aria-label="breadcrumb" className="w-max">
                    <ol className="flex flex-wrap items-center bg-slate-50 px-1 py-2 rounded-md w-full">
                      <li className="flex items-center font-thin text-custom-headingclr/50 hover:text-theme-primary text-sm transition-colors duration-300 cursor-pointer">
                        <Link to={`/category/${ParentCategoryName.slug}`}>
                          {ParentCategoryName.name}
                        </Link>
                        <span className="mx-2 text-slate-800 pointer-events-none">
                          /
                        </span>
                      </li>
                      <li className="flex items-center font-thin text-custom-headingclr/50 hover:text-theme-primary text-sm transition-colors duration-300 cursor-pointer">
                        <Link to={`/productlist/${CategoryName.slug}`}>
                          {CategoryName.name}
                        </Link>
                        <span className="mx-2 text-slate-800 pointer-events-none">
                          /
                        </span>
                      </li>
                      <li className="flex items-center font-bold text-theme-primary hover:text-theme-primary text-sm transition-colors duration-300 cursor-pointer">
                        <a href="#">{ProductName}</a>
                      </li>
                    </ol>
                  </nav>
                </div>

                <div className="grid grid-cols-12">
                  {isMobile ? (
                    <div className="col-span-12 md:col-span-7 mb-3 md:mb-0">
                      <div className="relative">
                        <Slider {...Banner}>
                          {items.slider_image.map((prodImage, index) => (
                            <div
                              key={index}
                              className="px-1 py-1 w-full h-full"
                            >
                              <img src={prodImage} alt="" />
                            </div>
                          ))}
                        </Slider>
                        <div className="top-[20px] right-3 absolute p-2">
                          <button className="bg-none md:ml-3">
                            <div className="flex justify-center items-center gap-1">
                              <WishlistButton
                                productId={items.id}
                                // wishlist={wishlist}
                                wishlistStatus={wishlistStatus}
                                setWishlistStatus={setWishlistStatus}
                                isProductDetailsPage={true}
                                fetchData={fetchData}
                              />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-12 md:col-span-7">
                      <div className="grid grid-cols-12">
                        {items.slider_image.map((prodImage, index) => (
                          <div
                            key={index}
                            className="col-span-6 px-1 py-1 w-full h-full"
                          >
                            <img src={prodImage} alt="" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* product details section */}
                  <div
                    ref={stickyRef}
                    className={`md:col-span-5  col-span-12 mx-8 pt-6 ${
                      isMobile ? "" : "stickyanm"
                    }`}
                  >
                    <div className="container">
                      <div>
                        <div className="flex justify-between items-center">
                          <h3 className="font-headingfont font-bold text-theme-primary text-lg md:text-3xl uppercase tracking-wide">
                            {items.name}
                          </h3>

                          <button className="hidden md:block bg-none md:ml-3">
                            <div className="flex justify-center items-center gap-1">
                              <WishlistButton
                                productId={items.id}
                                // wishlist={wishlist}
                                wishlistStatus={wishlistStatus}
                                setWishlistStatus={setWishlistStatus}
                                isProductDetailsPage={true}
                                fetchData={fetchData}
                              />
                              {/* <Heart
                            className={`w-[100%] h-full mx-1  hover:fill-[#e50010] hover:text-[#e50010] ${
                              wishlist
                                ? "fill-[#e50010] text-[#e50010]"
                                : "text-theme-primary/50"
                            } `}
                          /> */}
                            </div>
                          </button>
                        </div>

                        <div className="flex gap-2">
                          {items.tags.map((tag, index) => (
                            <p
                              key={index}
                              className="font-themefont text-theme-primary/50 text-sm tracking-wide"
                            >
                              {tag}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 md:pt-4">
                        <hr />
                      </div>

                      <div>
                        {/* price */}

                        <h3 className="pt-2 md:pt-5 font-theme-primary text-custom-headingclr text-xl">
                          {items.main_price}
                          <span className="px-2 font-medium text-custom-headingclr/50 text-sm line-through">
                            {items.stroked_price}
                          </span>{" "}
                          <span className="bg-gray-300 dark:bg-gray-700 me-2 px-2.5 py-0.5 rounded-full font-headingfont font-bold text-theme-primary dark:text-gray-300text-sm text-xs md:text-sm">
                            {items.discount}
                          </span>
                        </h3>
                        <p className="pt-2 font-themefont text-theme-primary/50 text-xs tracking-wide">
                          MRP incl. of all taxes
                        </p>
                      </div>

                      <div className="md:mt-1 md:pt-3">
                        {colorFilter.map((item, index) => (
                          <div key={index}>
                            {item.status === true && (
                              <p className="my-4 md:my-3 font-headingfont text-custom-headingclr text-xs md:text-sm">
                                {item.name}
                              </p>
                            )}
                          </div>
                        ))}

                        <Slider {...sliderSettings}>
                          {colorFilter.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-around items-center my-2 px-2 rounded-lg transition duration-300"
                            >
                              <Link
                                to={`/product-details/${item.product_slug}`}
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className={`md:w-20 md:h-20 w-12 h-12 object-cover rounded cursor-pointer ${
                                    item.status
                                      ? "ring-2 ring-[#000] ring-offset-2 scale-105" // Highlight selected
                                      : "opacity-70 hover:opacity-100"
                                  }`}
                                />
                              </Link>
                            </div>
                          ))}
                        </Slider>
                      </div>

                      <div className="flex pt-0 md:pt-2">
                        <h3 className="py-3 md:py-5 font-primary text-custom-headingclr md:text-md text-sm">
                          Please select a size :
                        </h3>
                        <button
                          className="px-3 font-themefont text-theme-primary md:text-md text-sm underline"
                          onClick={openDrawerRight}
                        >
                          Size Chart
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 py-2 md:py-3 font-headingfont">
                        {items.choice_options[0]?.options.map((size) => (
                          <Button
                            key={size}
                            onClick={() => {
                              setSelectedSize(size);
                              setCart(false);
                            }}
                            className={`border px-4 py-2 rounded-sm 
                          ${
                            selectedSize === size
                              ? "bg-theme-primary text-theme-secondary"
                              : "bg-transparent text-custom-headingclr border-custom-headingclr"
                          }`}
                          >
                            {size}
                          </Button>
                        ))}
                      </div>

                      <div>
                        <div className="flex gap-3 py-2 md:py-5">
                          <p className="font-headingfont text-custom-headingclr md:text-md text-sm">
                            Size not available?
                          </p>{" "}
                          <button
                            className="font-themefont text-theme-primary md:text-md text-sm underline"
                            onClick={handleNotification}
                          >
                            Notify Me
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-start items-center gap-4 pt-2 md:pt-3 pb-3 md:pb-8 text-custom-headingclr md:text-md text-sm">
                        <p>Quantity :</p>

                        <div>
                          <select
                            onChange={(e) =>
                              setselectedQty(Number(e.target.value))
                            }
                            className="block bg-gray-50 dark:bg-gray-700 p-2.5 px-2 py-1 border-2 border-gray-300 dark:border-gray-600 border-theme-primary/50 focus:border-blue-500 dark:focus:border-blue-500 rounded-lg focus:ring-blue-500 dark:focus:ring-blue-500 w-50 w-full h-full font-themefont text-gray-900 md:text-md dark:text-theme-secondary text-sm dark:placeholder-gray-400"
                          >
                            <option value="1">01</option>
                            <option value="2">02</option>
                            <option value="3">03</option>
                            <option value="4">04</option>
                            <option value="5">05</option>
                            <option value="6">06</option>
                            <option value="7">07</option>
                            <option value="8">08</option>
                            <option value="9">09</option>
                            <option value="10">10</option>
                          </select>
                        </div>
                      </div>
                      <div
                        className={`mx-auto mobilebtn  ${isMobile ? "" : ""}`}
                      >
                        <div className="flex md:flex-row flex-col md:justify-between gap-2 md:gap-0">
                          <Button
                            ref={buttonRef}
                            className={`mr-3 border-2 mobilebtn2 md:size-full w-full bg-theme-secondary text-theme-secondary py-4 md:py-2 px-14 rounded-md font-medium h-full sticky top-[10%] ${
                              cart
                                ? "bg-theme-secondary text-theme-primary border-2 border-theme-primary"
                                : "bg-theme-primary"
                            }`}
                            onClick={() => {
                              if (cart) {
                                navigate("/cart");
                              } else {
                                addtoCart();
                              }
                            }}
                          >
                            <div className="flex justify-center items-center gap-1">
                              <ShoppingBag className="mx-1 w-4" />
                              <span className="font-headingfont text-[14px]">
                                {cart ? "GO TO CART" : "ADD TO CART"}
                              </span>
                            </div>
                          </Button>
                        </div>
                      </div>

                      {/* return policy */}

                      <section className="flex justify-around md:my-5 font-primary">
                        <div>
                          <div className="flex justify-center items-center my-3">
                            <img src={Shipped} alt="" className="w-9" />
                          </div>
                          <p className="font-themefont text-custom-headingclr text-sm">
                            Free shipping
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-center items-center my-3">
                            <img src={DeleveryStatus} alt="" className="w-9" />
                          </div>
                          <p className="font-themefont text-custom-headingclr text-sm">
                            Easy Returns
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-center items-center my-3">
                            <img src={Cleancloths} alt="" className="w-9" />
                          </div>
                          <p className="font-themefont text-custom-headingclr text-sm">
                            Fresh Fashion
                          </p>
                        </div>
                      </section>

                      {/* review section */}
                      <div className="mt-4 md:mt-0">
                        <button className="my-3" onClick={openRivewRight}>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 text-theme-primary fill-theme-primary" // Gold color
                              />
                            ))}
                            <p className="pl-2 text-custom-headingclr text-sm">
                              ({items.rating_count} Reviews)
                            </p>
                          </div>
                        </button>
                      </div>

                      {/* share */}

                      <div className="flex py-4 md:py-6 font-primary">
                        <p className="font-headingfont text-custom-headingclr">
                          Share :
                        </p>

                        <div className="flex items-center ml-4">
                          <a href="">
                            <img
                              src={Instagram}
                              alt=""
                              className="mx-1 w-5 md:w-6 h-5 md:h-6"
                            />
                          </a>
                          <a href="">
                            <img
                              src={Whatsapp}
                              alt=""
                              className="mx-1 w-5 md:w-6 h-5 md:h-6"
                            />
                          </a>
                          <a href="">
                            <img
                              src={Twitter}
                              alt=""
                              className="mx-1 w-4 md:w-5 h-4 md:h-5"
                            />
                          </a>

                          <a href="">
                            <img
                              src={Facebook}
                              alt=""
                              className="mx-1 w-5 h-5"
                            />
                          </a>
                        </div>
                      </div>

                      {/* accordion */}
                      <div>
                        <Accordion
                          open={open === 1}
                          icon={<Icon id={1} open={open} />}
                          className="my-2 border-2 rounded-md"
                        >
                          <AccordionHeader
                            onClick={() => handleOpen(1)}
                            className="px-4 border-none font-headingfont text-theme-primary/40 text-sm"
                          >
                            Product Details
                          </AccordionHeader>

                          <AccordionBody className="bg-blue-gray-50/50 px-4 font-themefont text-xs tracking-wide">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: items.detail || "No details available.",
                              }}
                            />
                          </AccordionBody>
                        </Accordion>

                        <Accordion
                          open={open === 2}
                          icon={<Icon id={2} open={open} />}
                          className="my-2 border-2 rounded-md"
                        >
                          <AccordionHeader
                            onClick={() => handleOpen(2)}
                            className="px-4 border-none font-headingfont text-theme-primary/40 text-sm"
                          >
                            Product Description
                          </AccordionHeader>

                          <AccordionBody className="bg-blue-gray-50/50 px-4 font-themefont text-xs tracking-wide">
                            <span
                              dangerouslySetInnerHTML={{
                                __html:
                                  items.description || "No details available.",
                              }}
                            />
                          </AccordionBody>
                        </Accordion>

                        <Accordion
                          open={open === 3}
                          icon={<Icon id={3} open={open} />}
                          className="my-2 border-2 rounded-md"
                        >
                          <AccordionHeader
                            onClick={() => handleOpen(3)}
                            className="px-4 border-none font-headingfont text-theme-primary/40 text-sm"
                          >
                            Artist's Details
                          </AccordionHeader>
                          <AccordionBody className="bg-blue-gray-50/50 px-4 font-themefont text-xs tracking-wide">
                            <span
                              dangerouslySetInnerHTML={{
                                __html:
                                  items.artis_details ||
                                  "No details available.",
                              }}
                            />
                          </AccordionBody>
                        </Accordion>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* related products */}
        <RelatedProducts
          RelatedProducts={relatedProducts}
          fetchData={fetchData}
          setWishlistStatus={setWishlistStatus}
          triggerCount={triggerCount}
        />
        {/* related products end*/}
      </section>

      <div>
        {/* size chart  */}
        <Sizechart
          openRight={openRight}
          setOpenRight={setOpenRight}
          isMobile={isMobile}
        />
        {/* size chart end */}

        {/* review section start*/}

        <ReviewSection
          openReview={openReview}
          setOpenReview={setOpenReview}
          isMobile={isMobile}
          productId={productDetailCollection[0]?.id}
        />
        {/* review section end*/}

        {/*NotifyPopup  modal popup */}

        <NotifyPopup
          notify={notify}
          setNotify={setNotify}
          isMobile={isMobile}
          product_id={productDetailCollection[0]?.id}
        />
        {/*NotifyPopup  modal popup end */}
      </div>

      {topZero ? (
        ""
      ) : (
        <div className="md:hidden bottom-[55px] fixed flex md:flex-row flex-col md:justify-between gap-2 md:gap-0 w-full">
          <Button
            className={`mr-3 border-2 md:size-full w-full bg-theme-primary text-theme-secondary py-4 md:py-2 px-14 rounded-md font-medium`}
            onClick={() => {
              if (cart) {
                navigate("/cart");
              } else {
                addtoCart();
              }
            }}
          >
            <div className="flex justify-center items-center gap-1">
              <ShoppingBag className="mx-1 w-4" />
              <span className="font-headingfont text-[14px]">
                {cart ? "GO TO CART" : "ADD TO CART"}
              </span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

// StarCount component
const StarCount = ({ ratingCount }) => {
  const fullStars = Math.floor(ratingCount);
  const hasHalfStar = ratingCount - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {ratingCount === 0 ? (
        Array.from({ length: 5 }).map((_, emptyIndex) => (
          <Star
            key={`empty-${emptyIndex}`}
            className="w-[17px] text-gray-300"
          />
        ))
      ) : (
        <>
          {Array.from({ length: fullStars }).map((_, starIndex) => (
            <Star
              key={`full-${starIndex}`}
              className="fill-theme-primary w-[17px] text-theme-primary"
            />
          ))}

          {hasHalfStar && (
            <StarHalf
              key="half"
              className="fill-theme-primary w-[17px] text-theme-primary"
            />
          )}

          {Array.from({ length: emptyStars }).map((_, emptyIndex) => (
            <Star
              key={`empty-${emptyIndex}`}
              className="w-[17px] text-gray-300"
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ProductDetails;
