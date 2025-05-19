import React from "react";
import Slider from "react-slick";
import WishlistButton from "../../wishlist/WishlistButton.jsx";
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
      <div className="mx-auto py-2 container">
        {RelatedProducts.length !== 0 && (
          <>
            <h3 className="mx-5 md:mx-0 pt-14 pb-8 font-headingfont font-bold text-custom-headingclr text-md uppercase tracking-wide">
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
              <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
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
            className="hover:scale-110 transition-transform duration-300 transform"
            alt="Product"
          />
          <img
            src={items.thumbnail_image_second}
            className="top-0 left-0 absolute opacity-0 hover:opacity-100 transition-opacity duration-300 transform"
            alt="Hover Product"
          />

          <div
            className="top-3 right-3 absolute bg-theme-secondary/40 p-1.5 rounded-full cursor-pointer"
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
            <p className="font-headingfont font-semibold text-custom-headingclr text-sm">
              {items.name}
            </p>
            <hr className="my-1" />
            <p className="font-themefont font-medium text-custom-headingclr/50 text-sm">
              {items.tags}
            </p>

            <div className="mt-2">
              <p className="font-themefont font-semibold text-custom-headingclr text-md">
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
