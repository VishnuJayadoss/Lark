import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  IconButton,
} from "@material-tailwind/react";
import Card1 from "../../assets/productlist/card1.webp";

const Logout = () => {
  // Remove Modal popup Start
  const [orderCancel, setOrderCancel] = useState(false);
  const handleOrder = () => {
    setOrderCancel((data) => !data);
  };
  return (
    <div>
      {/* Modal start */}
      <Dialog open={orderCancel} handler={handleOrder} size={"sm"}>
        <DialogBody>
          <div className="flex justify-around">
            <div className="flex gap-2">
              <img src={Card1} alt="selected" className="md:w-1/6 w-1/4 " />

              <div className="px-3 md:max-w-[280px] max-w-[200px]">
                <p className="mt-2 text-custom-headingclr lg:text-[13px] text-[11px] font-semibold font-headingfont line-clamp-1">
                  Cancel Item From Orders
                </p>
                <p className="text-theme-primary/40 text-[10px] lg-text-[11px] mt-2 font-thin tracking-wide font-themefont">
                  Are you sure you want to Cancel this order?
                </p>
              </div>
            </div>

            <IconButton variant="text" color="blue-gray" onClick={handleOrder}>
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
          <div className="mt-2">
            <div className="grid grid-cols-2 gap-5">
              <Button
                className="lg:test-xs text-[9px] py-2 lg:py-3 px-2 lg:px-3 bg-theme-primary/10 text-theme-primary border border-theme-primary tracking-wider"
                onClick={handleOrder}
              >
                Don't Cancel
              </Button>
              <Button
                className="lg:test-xs text-[9px] py-2 lg:py-3 px-2 lg:px-3 tracking-wider"
                onClick={handleOrder}
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </DialogBody>
      </Dialog>
      {/* Model End */}
    </div>
  );
};

export default Logout;
