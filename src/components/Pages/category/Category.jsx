import React, { useState, useEffect } from "react";
import Slider from "react-slick";

// images
import Banner1 from "../../../assets/category/men.webp";
import Banner2 from "../../../assets/category/slider2.webp";
import Mob1 from "../../../assets/category/mob1.webp";
import Mob2 from "../../../assets/category/mob2.webp";
import Mob3 from "../../../assets/category/mob3.webp";

import CategoryList from "./CategoryList";
import NewArrivals from "./NewArrivals";
import FirstSection from "./FirstSection";
import SecondSection from "./SecondSection";

const Category = () => {
  // banner slider
  var Banner = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  // images
  const mobileImg = [Mob1, Mob2, Mob3];
  const deskImg = [Banner1, Banner2];

  // response based image load

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const banner = isMobile ? mobileImg : deskImg;

  return (
    <>
      <div className="mx-auto md:mt-16 mb-10 mt-24">
        {/* banner section */}
        <div className="w-full">
          <>
            <Slider {...Banner}>
              {banner.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="banner1"
                  className="w-full h-full object-cover"
                />
              ))}
            </Slider>
          </>
        </div>

        {/* CategoryList */}

        <CategoryList />

        {/* NewArrivals */}

        <NewArrivals />

        {/* section 1 */}

        <FirstSection />

        {/* section 2 */}
        <SecondSection />
      </div>
    </>
  );
};

export default Category;
