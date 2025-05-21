import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "../../../axios";
import { useParams, useNavigate } from "react-router-dom";

const CategoryList = () => {
  const [allItems, setAllItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  const batchSize = 4;

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: false,
  });

  const fetchData = async () => {
    try {
      // setLoading(true);
      const res = await axios.get(`/V4/sub-categories/${slug}`);
      const newItems = res.data?.Category?.data ?? [];
      console.log(
        "newItems",
        newItems.map((item) => item.slug)
      );

      // console.log('res ponce', res.data);
      

      setAllItems(newItems);
      setVisibleItems(newItems.slice(0, batchSize));
      setHasMore(newItems.length > batchSize);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (inView && hasMore && !loading && !loadMoreLoading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMoreLoading, slug]);

  // Automatically load until screen is filled
  useEffect(() => {
    if (!inView && hasMore && !loading && !loadMoreLoading) {
      const timeout = setTimeout(() => {
        loadMore();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [visibleItems, hasMore, loading, loadMoreLoading]);

  const loadMore = () => {
    if (!hasMore || loadMoreLoading) return;

    setLoadMoreLoading(true);

    setTimeout(() => {
      const nextItems = allItems.slice(
        visibleItems.length,
        visibleItems.length + batchSize
      );
      setVisibleItems((prev) => [...prev, ...nextItems]);

      if (visibleItems.length + nextItems.length >= allItems.length) {
        setHasMore(false);
      }

      setLoadMoreLoading(false);
    }, 500); // Delay for skeleton loader
  };

  const renderImageSkeletons = () => {
    return Array.from({ length: batchSize }).map((_, idx) => (
      <div
        className="md:col-span-3 col-span-6 md:mt-2 cardimg animate-pulse"
        key={idx}
      >
        <div className="px-2 pb-3 md:pb-0">
          <Skeleton height={300} className="rounded-lg" />
        </div>
      </div>
    ));
  };

  // navigate to productlist
  const navigateToProductList = (slug) => {
    navigate(`/productlist/${slug}`);
  };

  return (
    <section className="mx-auto mt-7">
      {visibleItems.length !== 0 && (
        <div className="flex items-center justify-center py-6">
          <h2 className="font-headingfont md:text-2xl text-xl tracking-wide uppercase font-semibold text-theme-primary">
            Categories
          </h2>
        </div>
      )}

      <div className="grid grid-cols-12 gap-y-3 md:px-3 md:mx-3 mt-1 pb-3">
        {visibleItems.map((item, index) => (
          <div
            className="md:col-span-3 col-span-6 md:mt-2 cardimg transition-all duration-500 transform hover:scale-105"
            key={index}
          >
            <div
              className="px-2 pb-3 md:pb-0 cursor-pointer"
              onClick={() => navigateToProductList(item.slug)}
            >
              <img
                src={item.banner}
                alt={item.name}
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>
        ))}

        {loadMoreLoading && (
          <div className="col-span-12 grid grid-cols-12">
            {renderImageSkeletons()}
          </div>
        )}

        {hasMore && !loadMoreLoading && (
          <div ref={ref} className="col-span-12 h-1" />
        )}
      </div>
    </section>
  );
};

export default CategoryList;
