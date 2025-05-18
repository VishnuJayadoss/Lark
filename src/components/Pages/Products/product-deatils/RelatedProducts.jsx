import React from "react";
import Slider from "react-slick";
import WishlistButton from "../../Wishlist/WishlistButton";
import Count from "../../../layouts/Count";
import { Link } from "react-router-dom";

const RelatedProducts = ({
  RelatedProducts,
  fetchData,
  setWishlistStatus,
  triggerCount,
}) => {
  // console.log('RelatedProducts',RelatedProducts);
  // slider settings
  var settings = {
    dots: false,
   infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <>
      <Count triggerCount={triggerCount} />
      <div className="container mx-auto py-2">
        {RelatedProducts.length !== 0 && (
          <>
            <h3 className="font-headingfont pt-14 pb-8 md:mx-0 mx-5 text-md tracking-wide uppercase font-bold text-custom-headingclr">
              Others Also Bought
            </h3>
            <hr className="pt-8" />
          </>
        )}

        <div className="w-full">
          {RelatedProducts.length > 0 &&
            (RelatedProducts.length > 4 ? (
              <Slider {...settings}>
                {RelatedProducts.map((items, index) => (
                  <ProductCard key={items.id} items={items}   fetchData={fetchData}/>
                ))}
              </Slider>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {RelatedProducts.map((items, index) => (
                  <ProductCard
                    key={items.id}
                    items={items}
                    fetchData={fetchData}
                  />
                ))}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

// html
const ProductCard = ({ items, fetchData }) => {
  return (
    <div className="p-3">
      <Link to={`/product-details/${items.slug}`}>
        <div className="relative">
          <img
            src={items.thumbnail_image}
            className="transition-transform duration-300 transform hover:scale-110"
            alt="Product"
          />
          <img
            src={items.thumbnail_image_second}
            className="absolute top-0 left-0 opacity-0 transition-opacity duration-300 transform hover:opacity-100"
            alt="Hover Product"
          />

          <div
            className="absolute top-3 right-3 cursor-pointer bg-theme-secondary/40 rounded-full p-1.5"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <WishlistButton
              productId={items.id}
              wishlistStatus={items.is_in_wishlist}
              fetchData={fetchData}
            />
          </div>

          <div className="mt-2 px-3">
            <p className="text-custom-headingclr text-sm font-semibold font-headingfont">
              {items.name}
            </p>
            <hr className="my-1" />
            <p className="text-custom-headingclr/50 text-sm font-medium font-themefont">
              {items.tags}
            </p>

            <div className="mt-2">
              <p className="text-custom-headingclr text-md font-semibold font-themefont">
                {items.main_price}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RelatedProducts;
