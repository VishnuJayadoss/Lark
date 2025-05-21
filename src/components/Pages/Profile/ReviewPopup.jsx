import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Textarea,
  Dialog,
  DialogBody,
  IconButton,
  Rating,
} from "@material-tailwind/react";
import axios from "../../../axios.js";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ReviewPopup = ({
  reviewAdd,
  AddReview,
  orderDetailsForPro,
  setReviewAdd,
}) => {
  //   get token
  const token = Cookies.get("token");
  // get order_id
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const order_id = queryParams.get("order_id");
  // const cookiesUser = JSON.parse(Cookies.get("user"));
  // form
  const { control, handleSubmit, register, watch, reset } = useForm({
    defaultValues: {
      rating: 0,
      description: "",
    },
  });

  const selectedRating = watch("rating");
  const [ratingKey, setRatingKey] = useState(0);
  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    try {
      const formData = {
        ...data,
        order_id: order_id,
        product_id: orderDetailsForPro.product_id,
      };
      const res = await axios.post("/v2/reviews/submit", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responce = res.data;
      console.log("review responce,", responce);
      if (res.data?.success === true) {
        toast.success(res.data?.message);
        reset({ rating: 0, description: "" });
        setRatingKey((prev) => prev + 1);
        setReviewAdd(false);
      }
    } catch (error) {
      console.log("api error", error);
      reset({ rating: 0, description: "" });
      setRatingKey((prev) => prev + 1);
      setReviewAdd(false);
    }
  };

  return (
    <>
      <Dialog
        open={reviewAdd}
        handler={AddReview}
        size="sm"
        className="rounded-none"
      >
        <DialogBody>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div className="px-3">
                <p className="mt-2 text-theme-primary/90 text-lg font-black font-themefont line-clamp-1">
                  Add Review
                </p>
                <p className="text-theme-primary/70 text-sm mt-2 tracking-wide font-themefont">
                  Share your shopping experience with us!{" "}
                  <span
                    role="img"
                    className="text-theme-primary"
                    aria-label="smile"
                  >
                    😊
                  </span>
                </p>
              </div>
            </div>
            <IconButton variant="text" color="blue-gray" onClick={AddReview}>
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
          <hr className="my-4" />
          <div className="flex justify-center font-themefont">
            <form className="mb-2 p-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-2">
                <img
                  src={orderDetailsForPro.thumbnail_image}
                  alt="selected"
                  className="w-1/4 md:w-1/6"
                />

                <div className="px-3 max-w-[200px] md:max-w-[280px]">
                  <p className="mt-2 font-headingfont font-semibold text-[13px] text-theme-primary line-clamp-1">
                    Rate Product
                  </p>
                  <p className="mt-2 font-themefont font-thin text-[13px] text-theme-primary/60 tracking-wide">
                    {orderDetailsForPro.product_name}
                  </p>
                </div>
              </div>
              <hr className="my-4" />
              <div className="mb-1 flex flex-col gap-6">
                <div className="flex gap-2 items-center">
                  <Controller
                    control={control}
                    name="rating"
                    render={({ field: { onChange, value } }) => (
                      <Rating
                        key={ratingKey}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <p className="text-sm">{selectedRating} out of 5</p>{" "}
                </div>
                <div className="w-full">
                  <Textarea
                    label="Review description"
                    {...register("comment")}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="mt-6 font-themefont tracking-widest rounded-none"
                fullWidth
              >
                Add Review
              </Button>
            </form>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default ReviewPopup;
