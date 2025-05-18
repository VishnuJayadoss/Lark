import React, { useRef, useState, useEffect } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import Iconblack from "../../assets/iconblack.svg";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "../../axios.js";
import { useDispatch } from "react-redux";
import { setUser } from "./UserSlice.js";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
// toastify
import { ToastContainer, toast } from "react-toastify";
const OtpValidations = () => {
  // otp validation

  const { email } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email]);

  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, "");
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  function handleBackspace(event, index) {
    if (event.key === "Backspace" && !event.target.value && index > 0) {
      console.log(inputRefs.current[index - 1]);
      inputRefs.current[index - 1].focus();
    }
  }

  // form

  const { register, handleSubmit } = useForm();

  const [backendError, setBackendError] = useState("");

  const onSubmit = async (data) => {
    console.log("data", data.otp.join(""));
    const otpValue = data.otp.join("");

    // handle login logic here
    const formData = {
      // login_by: "phone",
      email: email,
      // password: "212121",
      verification_code: otpValue,
    };

    console.log("formData", formData);

    try {
      setBackendError("");
      const res = await axios.post("/v2/auth/login", formData);
      const loginResponse = res.data;
      const { access_token, user } = loginResponse;
      dispatch(setUser({ access_token, user }));
      Cookies.set("token", access_token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("user", JSON.stringify(user), {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      console.log("loginResponse", loginResponse);
    } catch (error) {
      console.log("error", error.response.data.message);
      setBackendError(error.response?.data?.message || "Something went wrong");
    }
  };

  // otp resend

  const handleResendOtp = async () => {
    toast.success("Resend Sucessfully");
    setOtp(Array(6).fill("")); // Clear input fields
    const formData = {
      email_or_phone: email,
      verify_by: "phone",
    };
    const res = await axios.post("/v2/auth/password/resend_code", formData);
    const resendResponse = res.data;
    console.log("resendResponse", resendResponse);
    try {
    } catch (error) {
      console.log("error", error.response?.data?.message);
      setBackendError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {/* content start */}
      <ToastContainer />
      <div className="container mx-auto md:mt-20 mt-28 mb-10 bg-theme-primary">
        <section className="flex justify-center text-center items-center md:p-10 p-8">
          <div className=" border-2 p-8 shadow-xl bg-theme-secondary border-gray-300">
            <div>
              <Typography className="text-theme-primary/60 font-normal font-themefont text-[12px] uppercase">
                Login with the Lark Brennet
              </Typography>
              <div className="md:col-span-4 col-span-12 px-3 flex items-center justify-center">
                <img
                  src={Iconblack}
                  alt="Iconblack"
                  className="md:w-1/3 size-1/2"
                />
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                action="#"
                className="mx-auto max-w-[24rem] text-left"
              >
                <div className="w-full max-w-sm">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex flex-col items-center justify-center gap-1 text-center font-themefont text-theme-primary/60"
                  >
                    Enter the 6-digit OTP sent to{" "}
                    <span className="font-bold text-theme-primary">
                      +91 {email}
                    </span>
                  </Typography>

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
                        {index === 2 && (
                          <span className="text-2xl text-slate-700">-</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-red-600 text-xs my-1 text-center">
                    {backendError}
                  </p>
                  <Typography
                    variant="small"
                    className="text-center font-normal font-themefont  text-theme-primary/60"
                  >
                    Did not receive the code?{" "}
                    <span
                      onClick={handleResendOtp}
                      className="font-bold cursor-pointer text-theme-primary"
                    >
                      Resend
                    </span>
                  </Typography>

                  <div className="justify-center flex mt-6">
                    {" "}
                    <Button
                      type="submit"
                      className="w-full rounded-none tracking-wider bg-theme-secondary text-theme-primary border-2 border-theme-primary hover:bg-theme-primary hover:text-theme-secondary duration-300"
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default OtpValidations;
