import React, { useState } from "react";
import {
  Typography,
  IconButton,
  Button,
  Input,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import axios from "../../../../axios.js";
import { ToastContainer, toast } from "react-toastify";

const NotifyPopup = ({ notify, setNotify, isMobile, product_id }) => {
  const handleNotification = () => {
    setNotify(false);
  };

  // form validation start
  const token = Cookies.get("token");
  // const cookiesUser = JSON.parse(Cookies.get("user"));
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);

  const notificationForm = async (data) => {
    setSizeError(false);
    if (selectedSize === "") {
      setSizeError(true);
      return;
    }
    const formData = {
      ...data,
      size: selectedSize,
      product_id: product_id,
    };
    console.log("selectedSize", formData);

    const res = await axios.post("/V4/notifystock", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data?.success === true) {
      setNotify(false);
      setSelectedSize("");
      reset();
      toast.success(res.data?.message);
    }
    console.log("red res", res.data);
  };

  // form validation end

  return (
    <>
      <Dialog
        open={notify}
        handler={handleNotification}
        className="rounded-none"
      >
        <DialogBody>
          <div className="flex items-center pt-3 pb-5 justify-between">
            <Typography
              color="blue-gray"
              className="font-headingfont px-2 text-custom-headingclr md:text-sm text-md font-semibold"
            >
              Please select your size
            </Typography>
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={handleNotification}
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

          <div className={`${notify ? "block" : "hidden"}`}>
            <form onSubmit={handleSubmit(notificationForm)}>
              <div className="font-headingfont px-2 pb-4 flex justify-between">
                {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map(
                  (item, index) => (
                    <Button
                      key={index}
                      onClick={() => setSelectedSize(item)}
                      className={`border bg-transparent w-1/2 px-1 py-2 mx-2 border-custom-headingclr rounded-sm ${
                        selectedSize === item
                          ? "bg-theme-primary text-theme-secondary"
                          : "text-custom-headingclr"
                      }`}
                    >
                      {item}
                    </Button>
                  )
                )}
              </div>
              <p className="text-red-600 text-sm mx-auto text-center">
                {sizeError ? "please select size" : ""}
              </p>

              <div className="mt-2 pb-3 bg-gray-300/50 px-3 mx-2 py-2 rounded-none">
                <p className="text-custom-headingclr font-themefont md:text-sm text-xs mt-2 ">
                  Get notified once the product is back in stock.
                </p>
                <hr className="my-3" />
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="-mb-3 font-headingfont md:text-md text-sm"
                >
                  Your Email
                </Typography>
                <div className="flex gap-2 mt-6 md:flex-row flex-col items-start">
                  <div className="flex flex-col w-full">
                    <Input
                      placeholder="name@mail.com"
                      className=" !border-t-blue-gray-200 md:w-3/4 focus:!border-t-gray-900 size rounded-none"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                      {...register("email", {
                        required: {
                          value: true,
                          message: "Your Email Field is Required",
                        },
                        pattern: {
                          value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: "Invalid email format",
                        },
                      })}
                    />
                    <p className="text-red-600 text-xs mt-1">
                      {errors.email?.message}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="md:w-1/4 bg-theme-primary rounded-none"
                    fullWidth
                  >
                    submit
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default NotifyPopup;
