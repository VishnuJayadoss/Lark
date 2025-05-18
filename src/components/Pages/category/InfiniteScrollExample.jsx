import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card } from "@material-tailwind/react";
import axios from "axios";
import Bottom1 from "../../../assets/category/bottom.webp";

const InfiniteScrollExample = () => {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 8;

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${limit}`
      );

      const newItems = res.data;

      // If no new data, stop further loading
      if (newItems.length === 0) {
        setHasMore(false);
        return;
      }

      setItems((prevItems) => [...prevItems, ...newItems]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderSkeletons = () =>
    Array.from({ length: 8 }).map((_, idx) => (
      <div key={idx} className="col-span-12 md:col-span-3 p-3">
        <Card className="p-3">
          <h2 className="text-md font-extrabold">
            <Skeleton width={80} />
          </h2>
          <div>
            <Skeleton count={4} />
          </div>
        </Card>
      </div>
    ));

  return (
    <div className="mx-auto md:mt-16 mb-10 mt-24">
      <div className="container mx-auto">
        <InfiniteScroll
          dataLength={items.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<div className="grid grid-cols-12">{renderSkeletons()}</div>}
        >
          <div className="grid grid-cols-12">
            {items.map((user) => (
              <div key={user.id} className="col-span-12 md:col-span-3 p-3">
                <Card className="p-3">
                  <img src={Bottom1} alt="" />
                </Card>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default InfiniteScrollExample;
