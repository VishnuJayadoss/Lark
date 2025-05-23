import React, { useState, useEffect, useRef } from "react";
import { Typography, Input, Button, Radio } from "@material-tailwind/react";
import { EyeOff, Eye } from "lucide-react";
import Iconblack from "../../assets/blacklogo.svg";
import { useForm } from "react-hook-form";
// toastify
import { ToastContainer, toast } from "react-toastify";
// import "./Register.css";
import axios from "../../axios.js";
import { useDispatch } from "react-redux";
import { setUser } from "./UserSlice.js";
import Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  // google recaptcha start
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef();

  const handleCaptchaChange = (value) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value);
  };
  // google recaptcha end

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  const [ConfirmpasswordShown, setConfirmPasswordShown] = useState(false);
  const toggleConfirmPasswordVisiblity = () =>
    setConfirmPasswordShown((cur) => !cur);

  const [selectedGender, setSelectedGender] = useState("");

  // form submit
  const form = useForm();
  const { register, handleSubmit, watch, setError, formState } = form;
  const { isSubmitSuccessful, errors } = formState;
  const password = watch("password");

  const [userDetails, setUserDetails] = useState([]);
  // form reset

  const dispatch = useDispatch();

  useEffect(() => {
    if (isSubmitSuccessful) {
      toast.success("Welcome to Our Family");
    }
  }, [isSubmitSuccessful]);

  const onSubmit = async (data) => {
    console.log("formdata", data);

    try {
      if (!captchaValue) {
        toast.error("Please complete the reCAPTCHA", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      if (data.honeypot) {
        toast.error("Bot submission detected.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const formData = {
        ...data,
        recaptcha_token: captchaValue,
      };

      const res = await axios.post("/v2/auth/signup", formData);
      const formres = res.data;
      console.log("formres", formres);
      if (formres.result === true) {
        const { access_token, user } = formres;
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
      }

      if (formres.result === false) {
        const messages = formres.message;
        console.log("message", messages);

        messages.forEach((msg) => {
          if (msg.toLowerCase().includes("email")) {
            setError("email", {
              type: "manual",
              message: msg,
            });
          }
          if (msg.toLowerCase().includes("phone")) {
            setError("email_or_phone", {
              type: "manual",
              message: msg,
            });
          }
        });
      }

      setUserDetails(formres);
      setCaptchaValue(null);
      recaptchaRef.current.reset();
    } catch (errors) {
      console.log("errors", errors);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="register-container">
      {/* ToastContainer start */}
      <div>
        <ToastContainer />
      </div>
      {/* ToastContainer end */}
      {/* content start */}
      {/* <div className="bg-gradient-to-r from-black via-black to-white"></div> */}
      <div className=" container mx-auto md:mt-16 mt-24">
        <div className="grid grid-cols-12">
          <div className="md:col-span-6 col-span-12 flex justify-center flex-col items-center">
            <img
              src={Iconblack}
              alt="logo"
              className="md:w-[50%] w-[40%] md:mt-0 mt-5"
            />

            <Typography className=" mt-8 text-theme-primary/80 font-normal font-themefont text-[18px]">
              Sign Up with
            </Typography>
            <div className="flex gap-4 items-center">
              <Button
                variant="outlined"
                size="lg"
                className="mt-6 flex h-12 items-center justify-center gap-2 rounded-none border-2 border-theme-primary text-theme-primary"
                fullWidth
              >
                <img
                  src={`https://www.material-tailwind.com/logos/logo-google.png`}
                  alt="google"
                  className="h-6 w-6"
                />{" "}
                <span className="font-themefont text-theme-primary/80">
                  google
                </span>
              </Button>
              <Button
                variant="outlined"
                size="lg"
                className="mt-6 flex h-12 items-center justify-center gap-2 rounded-none border-2 border-theme-primary text-theme-primary"
                fullWidth
              >
                <img
                  src={`https://www.material-tailwind.com/logos/logo-facebook.png`}
                  alt="google"
                  className="h-6 w-6"
                />{" "}
                <span className="font-themefont text-theme-primary/80">
                  Facebook
                </span>
              </Button>
            </div>
            <Typography
              variant="small"
              color="gray"
              className="!mt-4 text-center font-normal text-theme-primary/80 font-headingfont"
            >
              Already a Customer ?{" "}
              <a
                href="#"
                className="font-headingfont font-bold underline ml-1 text-theme-primary underline-offset-2"
              >
                Login
              </a>
            </Typography>
          </div>
          {/* <div className="md:col-span-2 col-span-12 flex justify-center items-center md:mt-0 mt-5">
            <span className="text-theme-primary bg-theme-secondary p-1 rounded-md">- OR -</span>
          </div> */}
          <div className="md:col-span-6 col-span-12">
            <section className="w-full text-center items-center p-8 md:p-5 lg:p-10">
              <div className="w-full bg-theme-secondary p-8 border border-theme-primary/20 shadow-md shadow-theme-gray-300">
                <Typography
                  variant="h3"
                  color="blue-gray"
                  className="text-2xl font-themefont uppercase"
                >
                  Sign Up
                </Typography>
                <hr className="my-2" />
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  action="#"
                  className="mt-4 mx-auto text-left"
                >
                  <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-5">
                    <div className="mb-6">
                      <label htmlFor="fname">
                        <Typography
                          variant="small"
                          className="mb-2 block font-medium font-themefont text-gray-900"
                        >
                          First Name *
                        </Typography>
                      </label>
                      <Input
                        id="fname"
                        color="gray"
                        size="md"
                        type="text"
                        // name="fname"
                        {...register("name", {
                          required: {
                            value: true,
                            message: "Your Name Field is Required",
                          },
                        })}
                        placeholder="First Name"
                        className="lg:w-full placeholder:opacity-100 focus:!border-gray-900 rounded-none"
                        labelProps={{
                          className: "hidden",
                        }}
                      />
                      <p className="text-red-600 text-xs mt-1">
                        {errors.name?.message}
                      </p>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="lname">
                        <Typography
                          variant="small"
                          className="mb-2 block font-medium font-themefont text-gray-900"
                        >
                          Last Name *
                        </Typography>
                      </label>
                      <Input
                        id="lname"
                        color="gray"
                        size="md"
                        type="text"
                        // name="lname"
                        {...register("lastname", {
                          required: {
                            value: true,
                            message: "Your Last Name Field is Required",
                          },
                        })}
                        placeholder="Last Name"
                        className="lg:w-full placeholder:opacity-100 focus:!border-gray-900 rounded-none"
                        labelProps={{
                          className: "hidden",
                        }}
                      />
                      <p className="text-red-600 text-xs mt-1">
                        {errors.lastname?.message}
                      </p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label>
                      <Typography
                        variant="small"
                        className="mb-2 block font-medium font-themefont text-gray-900"
                      >
                        Date of Birth *
                      </Typography>
                    </label>
                    <Input
                      id="dob"
                      color="gray"
                      size="md"
                      type="date"
                      // name="dob"
                      {...register("dob", {
                        required: {
                          value: true,
                          message: "Your DOB Field is Required",
                        },
                      })}
                      className="lg:w-full placeholder:opacity-100 focus:!border-gray-900 !border-gray-900/20 rounded-none"
                      labelProps={{
                        className: "hidden",
                      }}
                    />
                    <p className="text-red-600 text-xs mt-1">
                      {errors.dob?.message}
                    </p>
                  </div>
                  <div className="mb-6">
                    <label>
                      <Typography
                        variant="small"
                        className="mb-2 block font-medium font-themefont text-gray-900"
                      >
                        Email ID *
                      </Typography>
                    </label>
                    <Input
                      id="email"
                      color="gray"
                      size="lg"
                      type="email"
                      // name="email"
                      {...register("email", {
                        required: {
                          value: true,
                          message: "Your Email Field is Required",
                        },
                        pattern: {
                          value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: "Invalid email formate",
                        },
                      })}
                      placeholder="name@mail.com"
                      className="lg:w-full placeholder:opacity-100 focus:!border-gray-900 !border-gray-900/20 rounded-none"
                      labelProps={{
                        className: "hidden",
                      }}
                    />
                    <p className="text-red-600 text-xs mt-1">
                      {errors.email?.message}
                    </p>
                  </div>
                  <div className="mb-6">
                    <label>
                      <Typography
                        variant="small"
                        className="mb-2 block font-medium font-themefont text-gray-900"
                      >
                        Phone Number *
                      </Typography>
                    </label>
                    <Input
                      id="email"
                      color="gray"
                      size="lg"
                      type="tel"
                      maxLength={10}
                      // name="email"
                      {...register("email_or_phone", {
                        required: {
                          value: true,
                          message: "Your Number Field is Required",
                        },
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: "Enter a valid 10-digit Indian number",
                        },
                        minLength: {
                          value: 10,
                          message: "Phone number must be 10 digits",
                        },
                        maxLength: {
                          value: 10,
                          message: "Phone number must be 10 digits",
                        },
                      })}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }}
                      placeholder="Number"
                      className="lg:w-full placeholder:opacity-100 focus:!border-gray-900 !border-gray-900/20 rounded-none"
                      labelProps={{
                        className: "hidden",
                      }}
                    />
                    <p className="text-red-600 text-xs mt-1">
                      {errors.email_or_phone?.message}
                    </p>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="password">
                      <Typography
                        variant="small"
                        className="mb-2 block font-medium font-themefont text-gray-900"
                      >
                        Choose New Password *
                      </Typography>
                    </label>
                    <Input
                      size="lg"
                      {...register("password", {
                        required: {
                          value: true,
                          message: "Password Filed is Required",
                        },
                        validate: (value) =>
                          value.length >= 6 ||
                          "Password min length should be 6 characters",
                      })}
                      placeholder="********"
                      labelProps={{
                        className: "hidden",
                      }}
                      className="lg:w-full placeholder:opacity-100 focus:!border-gray-900 !border-gray-900/20 rounded-none"
                      type={passwordShown ? "text" : "password"}
                      icon={
                        <i onClick={togglePasswordVisiblity}>
                          {passwordShown ? (
                            <Eye className="h-5 w-5" />
                          ) : (
                            <EyeOff className="h-5 w-5" />
                          )}
                        </i>
                      }
                    />
                    <p className="text-red-600 text-xs mt-1">
                      {errors.password?.message}
                    </p>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="password">
                      <Typography
                        variant="small"
                        className="mb-2 block font-medium font-themefont text-gray-900"
                      >
                        Confirm Password *
                      </Typography>
                    </label>
                    <Input
                      size="lg"
                      {...register("password_confirmation", {
                        required: {
                          value: true,
                          message: "Password Filed is Required",
                        },
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                      placeholder="********"
                      labelProps={{
                        className: "hidden",
                      }}
                      className="lg:w-full placeholder:opacity-100 focus:!border-gray-900 !border-gray-900/20 rounded-none"
                      type={ConfirmpasswordShown ? "text" : "password"}
                      icon={
                        <i onClick={toggleConfirmPasswordVisiblity}>
                          {ConfirmpasswordShown ? (
                            <Eye className="h-5 w-5" />
                          ) : (
                            <EyeOff className="h-5 w-5" />
                          )}
                        </i>
                      }
                    />
                    <p className="text-red-600 text-xs mt-1">
                      {errors.password_confirmation?.message}
                    </p>
                  </div>

                  {/* <div className="relative">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-4">
                        <span className="text-theme-primary">Gender</span>

                        <div className="flex gap-4">
                          {["Male", "Female", "Other"].map((gender) => (
                            <label
                              key={gender}
                              className={`flex items-center gap-2 text-sm cursor-pointer ${
                                selectedGender === gender
                                  ? "text-theme-primary"
                                  : "text-theme-primary/40"
                              }`}
                            >
                              <input
                                type="radio"
                                name="gender"
                                value={gender}
                                checked={selectedGender === gender}
                                onChange={(e) =>
                                  setSelectedGender(e.target.value)
                                }
                                className="hidden"
                                id={gender}
                              />
                              <div
                                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                                  selectedGender === gender
                                    ? "border-black"
                                    : "border-gray-400"
                                }`}
                              >
                                {selectedGender === gender && (
                                  <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                                )}
                              </div>
                              {gender}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LeghEQrAAAAACXcC0-c1uMLYsmSF3VpKS7YVlpi"
                    onChange={handleCaptchaChange}
                    className="my-4"
                  />
                  </div>
                  <div className="hidden">
                    <Input
                      type="text"
                      {...register("honeypot")}
                      className="hidden"
                      autoComplete="off"
                    />
                  </div>
                  <Button
                    color="gray"
                    size="lg"
                    type="submit"
                    className="mt-6 font-themefont rounded-none bg-theme-secondary border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white"
                    fullWidth
                  >
                    sign up
                  </Button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
