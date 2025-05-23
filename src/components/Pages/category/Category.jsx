import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import axios from "../../../axios";

// other component
import CategoryList from "./CategoryList";
import NewArrivals from "./NewArrivals";
import FirstSection from "./FirstSection";
import SecondSection from "./SecondSection";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Category = () => {
  const [allItems, setAllItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [desktopBanner, setDesktopBanner] = useState([]);
  const [mobileBanner, setMobileBanner] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { slug } = useParams();

  const batchSize = 4;

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
  // const mobileImg = [Mob1, Mob2, Mob3];
  // const deskImg = [Banner1, Banner2];

  // response based image load

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const banner = isMobile ? mobileImg : deskImg;

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      // setLoading(true);
      const res = await axios.get(`/V4/sub-categories/${slug}`);
      const newItems = res.data?.Category?.data ?? [];
      console.log("newItemsnewItems", res.data);
      setDesktopBanner(res.data?.Category?.data[0]?.banner);
      setMobileBanner(res.data?.Category?.data[0]?.mobile_banner);
      setAllItems(newItems);
      setVisibleItems(newItems.slice(0, batchSize));
      setHasMore(newItems.length > batchSize);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // loader start
  const renderCategorySkeletons = () => (
    <>
      {/* Banner Skeleton */}
      <div className="w-full mb-6">
        <Skeleton height={200} className="rounded-md" />
      </div>

      {/* Product/Card Grid Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="p-3 border border-gray-200 shadow-sm rounded-md"
          >
            <Skeleton height={150} className="rounded-md mb-2" />
            <Skeleton height={16} width={`80%`} className="mb-1" />
            <Skeleton height={14} width={`60%`} className="mb-2" />
            <Skeleton height={20} width={`40%`} />
          </div>
        ))}
      </div>
    </>
  );

  // loader end

  return (
    <>
      <div className="mx-auto md:mt-16 mb-10 mt-24">
        {/* banner section */}
        {loading ? (
          renderCategorySkeletons()
        ) : (
          <div className="w-full">
            <>
              {(isMobile ? mobileBanner : desktopBanner)?.length > 0 && (
                <Slider {...Banner}>
                  {(isMobile ? mobileBanner : desktopBanner).map(
                    (img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`banner-${index}`}
                        className="w-full h-full object-cover"
                      />
                    )
                  )}
                </Slider>
              )}
            </>
          </div>
        )}
        ;{/* CategoryList */}
        <CategoryList
          hasMore={hasMore}
          loadMoreLoading={loadMoreLoading}
          loading={loading}
          visibleItems={visibleItems}
          allItems={allItems}
          setLoadMoreLoading={setLoadMoreLoading}
          setHasMore={setHasMore}
          setVisibleItems={setVisibleItems}
          slug={slug}
        />
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
