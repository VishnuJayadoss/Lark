import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  IconButton,
  Typography,
  Input,
} from "@material-tailwind/react";
import Iconblack from "../../../assets/iconblack.svg";
import { ToastContainer, toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "../../../axios.js";
import { setUser } from "../../Auth/UserSlice.js";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// PhoneNumberUpdate component for verifying OTP and updating the user's phone number
const PhoneNumberUpdate = ({ handleOpen, open, tempNumberBased, setOpen }) => {
  // Get current user's email from Redux store
  const { email } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get token and user data from cookies
  const token = Cookies.get("token");
  let cookiesUser = "";
  if (Cookies.get("user")) {
    cookiesUser = JSON.parse(Cookies.get("user"));
  }

  // Input refs for handling OTP focus behavior
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));

  // Handle OTP input change and auto-focus next input
  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, "");
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace key for OTP input focus navigation
  function handleBackspace(event, index) {
    if (event.key === "Backspace" && !event.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  // Initialize React Hook Form
  const { register, handleSubmit } = useForm();
  const [backendError, setBackendError] = useState("");

  // Handle OTP form submit
  const [errorForOtp, setErrorForOtp] = useState([]);
  const onSubmit = async (data) => {
    const otpValue = data.otp.join("");

    const formData = {
      ...tempNumberBased,
      verification_code: otpValue,
    };

    try {
      // Send updated phone number and OTP to server
      const res = await axios.post(
        `/v2/profile/update/${cookiesUser.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If successful, update user in Redux and cookies
      const user = res.data?.user;
      setOpen(false);
      dispatch(setUser({ user }));
      Cookies.set("user", JSON.stringify(user), {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
    } catch (error) {
      console.log("Profile update error", error.response?.data);
      const errorMessage = error.response?.data;
      setErrorForOtp(errorMessage);
    }
  };

  // Main UI: Dialog with OTP input and submit/cancel buttons
  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <DialogBody className="p-0">
          <div className="border-2 p-5 shadow-xl bg-theme-secondary border-gray-300">
            <div className="flex justify-between">
              <Typography className="text-theme-primary/60 font-normal font-themefont text-[16px] uppercase flex items-center">
                Lark Brennet
              </Typography>
              {/* Close button */}
              <IconButton variant="text" color="blue-gray" onClick={handleOpen}>
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

            {/* App icon image */}
            <div className="md:col-span-4 col-span-12 px-3 flex items-center justify-center">
              <img
                src={Iconblack}
                alt="Iconblack"
                className="md:w-1/4 size-1/3"
              />
            </div>

            {/* OTP form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mx-auto max-w-[24rem] text-left"
            >
              <div className="w-full max-w-sm">
                {/* OTP instruction text */}
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex flex-col items-center justify-center gap-1 text-center font-themefont text-theme-primary/60"
                >
                  Enter the 6-digit OTP sent to{" "}
                  <span className="font-bold text-theme-primary">
                    +91 {tempNumberBased.phone}
                  </span>
                </Typography>

                {/* OTP input fields */}
                <div className="my-4 flex items-center justify-center gap-2">
                  {otp.map((digit, index) => (
                    <React.Fragment key={index}>
                      <Input
                        type="text"
                        maxLength={1}
                        {...register(`otp[${index}]`, {
                          required: {
                            value: true,
                            message: "This field is required",
                          },
                        })}
                        className="!w-10 appearance-none !border-t-blue-gray-200 text-center !text-lg placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                        containerProps={{
                          className: "!min-w-0 !w-10 !shrink-0",
                        }}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleBackspace(e, index)}
                        inputRef={(el) => (inputRefs.current[index] = el)}
                      />
                      {/* Add a dash after 3rd digit */}
                      {index === 2 && (
                        <span className="text-2xl text-slate-700">-</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Backend error message (if any) */}

                <p className="text-red-600 text-xs my-1 text-center">
                  {errorForOtp?.message}
                </p>

                {/* Submit and Cancel buttons */}
                <div className="w-full justify-between flex mt-6">
                  <Button
                    onClick={handleOpen}
                    className="w-full rounded-none tracking-wider bg-theme-secondary text-theme-primary border-2 border-theme-primary hover:bg-theme-primary hover:text-theme-secondary duration-300 m-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full rounded-none tracking-wider bg-theme-secondary text-theme-primary border-2 border-theme-primary hover:bg-theme-primary hover:text-theme-secondary duration-300 m-2"
                  >
                    Submit
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

export default PhoneNumberUpdate;
