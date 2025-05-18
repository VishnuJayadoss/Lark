import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../../../axios.js";
import "../../../assets/category/tshirt.webp"; // In case you use this image in the future
import "./Category.css";
import WishlistButton from "../Wishlist/WishlistButton.jsx";

const NewArrivals = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const cookiesUser = JSON.parse(Cookies.get("user") || "{}");
  const pageNum = 1;

  const [newarrivalsData, setNewarrivalsData] = useState([]);

  const params = {
    user_id: cookiesUser.id,
    childcategory: slug,
    page: pageNum,
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`/v2/new-arrivals/${slug}`, { params }); // ✅ Corrected template string
      const getData = res.data?.data ?? [];
      setNewarrivalsData(getData);
    } catch (error) {
      console.log("NewArrivals", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]); // ✅ Added slug as dependency

  const handleProductClick = (slug) => {
    navigate(`/product-details/${slug}`);
  };

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2500,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    lazyLoad: "ondemand",
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const ProductCard = ({ prod }) => (
    <div className="p-3" key={prod.id}>
      <div
        className="relative cursor-pointer"
        onClick={() => handleProductClick(prod.slug)}
      >
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
        <div
          className="absolute top-3 right-3 bg-theme-secondary/40 hover:bg-theme-secondary rounded-full p-1.5 z-10"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <WishlistButton
            productId={prod.id}
            wishlistStatus={prod.is_in_wishlist}
            fetchData={fetchData}
          />
        </div>
        <div className="mt-2 px-3">
          <p className="text-custom-headingclr text-sm font-semibold font-headingfont">
            {prod.category_name}
          </p>
          <hr className="my-1" />
          <p className="text-custom-headingclr/50 text-sm font-medium font-primaryfont">
            {prod.name}
          </p>
          <div className="mt-2">
            <p className="text-custom-headingclr text-md font-semibold font-headingfont">
              {prod.main_price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="category-page mx-auto md:mt-7 mt-2">
      {newarrivalsData.length !== 0 && (
        <div className="flex items-center justify-center py-6">
          <h2 className="font-headingfont md:text-2xl text-xl tracking-wide uppercase font-semibold text-theme-primary">
            New Arrivals
          </h2>
        </div>
      )}

      <div className="md:mx-5">
        {newarrivalsData.length >= 4 ? (
          <Slider {...settings}>
            {newarrivalsData.map((prod) => (
              <ProductCard prod={prod} key={prod.id} />
            ))}
          </Slider>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newarrivalsData.map((prod) => (
              <ProductCard prod={prod} key={prod.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
