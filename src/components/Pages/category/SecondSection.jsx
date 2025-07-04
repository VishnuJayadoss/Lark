import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link, useParams } from "react-router-dom";
import axios from "../../../axios.js";
import Cookies from "js-cookie";
import WishlistButton from "../../Pages/wishlist/WishlistButton.jsx";
import "./Category.css";
import { ToastContainer } from "react-toastify";

const SecondSection = () => {
  const { slug } = useParams();
  const cookiesUser = JSON.parse(Cookies.get("user") || "{}");
  const pageNum = 1;
  const [newarrivalsFirstData, setNewarrivalsFirstData] = useState([]);

  const fetchData = async () => {
    const cookiesUser = JSON.parse(Cookies.get("user") || "{}");

    const params = {
      user_id: cookiesUser.id,
      childcategory: slug,
      page: pageNum,
    };

    try {
      const res = await axios.get("/v2/categories/newarrivalsthree", {
        params,
      });
      const getData = res.data?.data ?? [];
      console.log("getData", getData);
      setNewarrivalsFirstData(getData);
    } catch (error) {
      console.error("NewArrivals", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2500,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    lazyLoad: "ondemand",
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  const ProductCard = ({ prod }) => (
    <div className="p-3">
      <div className="group relative cursor-pointer">
        {/* Wishlist */}
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="top-3 right-3 z-10 absolute bg-theme-secondary/40 hover:bg-theme-secondary p-1.5 rounded-full"
        >
          <WishlistButton
            productId={prod.id}
            wishlistStatus={prod.is_in_wishlist}
            fetchData={fetchData}
          />
        </div>

        {/* Clickable Card */}
        <Link to={`/product-details/${prod.slug}`}>
          <div className="relative">
            <img
              src={prod.thumbnail_image}
              className="md:rounded-none rounded-t-md hover:scale-110 transition-transform duration-300 transform"
              alt={prod.name}
            />
            <img
              src={prod.thumbnail_image_second}
              className="top-0 left-0 absolute opacity-0 hover:opacity-100 rounded-md md:rounded-none transition-opacity duration-300 transform"
              alt="New Image"
            />
          </div>
          {/* <img
            src={prod.thumbnail_image}
            alt={prod.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 transform"
          /> */}
          <div className="mt-2 px-3">
            <p className="font-headingfont font-semibold text-custom-headingclr text-sm">
              {prod.category_name}
            </p>
            <hr className="my-1" />
            <p className="font-primaryfont font-medium text-custom-headingclr/50 text-sm">
              {prod.name}
            </p>
            <div className="mt-2">
              <p className="font-headingfont font-semibold text-custom-headingclr text-md">
                {prod.main_price}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <section className="mx-auto mt-2 md:mt-7 category-page">
      <ToastContainer />
      {newarrivalsFirstData.length !== 0 && (
        <div className="flex justify-center items-center py-6">
          <h2 className="font-headingfont font-semibold text-theme-primary text-xl md:text-2xl uppercase tracking-wide">
            New Arrivals
          </h2>
        </div>
      )}

      <div className="md:mx-5">
        {newarrivalsFirstData.length >= 4 ? (
          <Slider {...settings}>
            {newarrivalsFirstData.map((prod) => (
              <ProductCard prod={prod} key={prod.id} />
            ))}
          </Slider>
        ) : (
          <div className="gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {newarrivalsFirstData.map((prod) => (
              <ProductCard prod={prod} key={prod.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SecondSection;
