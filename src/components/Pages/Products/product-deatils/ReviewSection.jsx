import React, { useEffect, useState } from "react";
import { Drawer, Typography, IconButton } from "@material-tailwind/react";
import { Star, StarHalf } from "lucide-react";
import axios from "../../../../axios.js";
import "../product-deatils/Drawer.css";
const ReviewSection = ({ openReview, setOpenReview, isMobile, productId }) => {
  const closeRivewRight = () => {
    setOpenReview(false);
  };

  // api intergration

  const [userReview, setUserReview] = useState([]);
  const [averageRating, setAverageRating] = useState("");

  useEffect(() => {
    if (productId) {
      fetchReviewData();
    }
  }, [productId]);

  const fetchReviewData = async () => {
    try {
      const res = await axios.get(`/v2/reviews/product/${productId}`);
      console.log("review res", res.data);

      const reviewUserDetails = res.data?.reviews?.data;
      const getTotalReview = res.data?.average_rating;
      // console.log('getTotalReview res.data',res.data);

      // console.log('getTotalReview',getTotalReview);

      setAverageRating(getTotalReview);
      console.log("review res", res.data);
      setUserReview(reviewUserDetails);
    } catch (error) {
      console.log("review section", error);
    }
  };

  // console.log("averageRating", averageRating);

  return (
    <>
      <Drawer
        placement="right"
        open={openReview}
        onClose={closeRivewRight}
        className="p-4 h-screen overflow-y-scroll z-[1000]"
        size={isMobile ? 500 : 600}
        overlayProps={{ className: "fixed-backdrop" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div></div>
          {/* <Typography
            variant="h5"
            color="blue-gray"
            className="text-theme-primary text-lg tracking-wider font-bold font-themefont"
          >
            Reviews (10000)
          </Typography> */}
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={closeRivewRight}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <div className="relative">
          <div>
            <h2 className="flex justify-center text-theme-primary text-xl font-themefont tracking-wider font-theme-primary">
              WHAT OTHER CUSTOMERS THINK
            </h2>
          </div>
          {averageRating !== 0 ? (
            <>
              <div className="flex justify-center mt-4">
                {[...Array(5)].map((_, i) => {
                  const filled = i + 1 <= Math.floor(averageRating);
                  const half =
                    i + 1 > Math.floor(averageRating) && i < averageRating;

                  return filled ? (
                    <Star
                      key={i}
                      className="w-[20px] text-theme-primary fill-theme-primary"
                    />
                  ) : half ? (
                    <StarHalf
                      key={i}
                      className="w-[20px] text-theme-primary fill-theme-primary"
                    />
                  ) : (
                    <Star
                      key={i}
                      className="w-[20px] text-gray-300 fill-gray-300"
                    />
                  );
                })}
                <div className="ml-2 text-theme-primary text-xl font-bold font-headingfont flex items-center">
                  {averageRating}/5
                </div>
              </div>
            </>
          ) : (
            ""
          )}

          <div>
            {userReview.length !== 0 ? (
              <>
                {userReview.map(
                  ({ user_name, time, rating, comment }, index) => (
                    <div
                      key={index}
                      className="border p-4 rounded-none mt-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {/* Render stars dynamically */}
                        <div className="flex items-center mt-4">
                          {[...Array(5)].map((_, i) => {
                            const filled = i + 1 <= Math.floor(rating);
                            const half =
                              i + 1 > Math.floor(rating) && i < rating;

                            return filled ? (
                              <Star
                                key={i}
                                className="w-[20px] text-theme-primary fill-theme-primary"
                              />
                            ) : half ? (
                              <StarHalf
                                key={i}
                                className="w-[20px] text-theme-primary fill-theme-primary"
                              />
                            ) : (
                              <Star
                                key={i}
                                className="w-[20px] text-gray-300 fill-gray-300"
                              />
                            );
                          })}
                          <span className="ml-2 text-sm text-theme-primary font-semibold">
                            {rating.toFixed(1)}/5
                          </span>
                        </div>
                        <p className="text-sm text-theme-primary/60">{time}</p>
                      </div>

                      <p className="font-bold text-lg font-themefont text-theme-primary/70">
                        {user_name}
                      </p>
                      <p className="text-theme-primary/70 mt-2 text-sm font-headingfont">
                        {comment}
                      </p>
                    </div>
                  )
                )}
              </>
            ) : (
              <>
                <p className="text-theme-primary text-xl mt-10 text-center">
                  No Review Found
                </p>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ReviewSection;
