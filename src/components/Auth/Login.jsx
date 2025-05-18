import React, { useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
// import { EyeOff, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "../../axios.js";
import { useDispatch } from "react-redux";
import { getPhone } from "./UserSlice.js";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();

  // const [passwordShown, setPasswordShown] = useState(false);
  // const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  // form validation
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const [backendError, setBackendError] = useState("");
  // const [phone, setPhone] = useState("");
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    console.log("data", data);

    // const formData = {
    //   ...data,
    //   login_by: "phone",
    //   password: "212121", // no need to send password in login by phone
    // };

    // console.log("formData", formData);

    // handle login logic here

    try {
      setBackendError("");
      const res = await axios.post("/v2/auth/login", data);
      const loginResponse = res.data;
      // setPhone(data.email);
      console.log("loginResponse", loginResponse);
      if (loginResponse.result === true) {
        navigate("/otpvalidations", { replace: true });
      }

      dispatch(getPhone({ email: data.email }));
      // console.log("loginResponse", data.email);
    } catch (error) {
      // console.log("error", error.response.data.message);
      setBackendError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {/* content start */}
      <div className="container mx-auto md:mt-24 mt-28">
        <section className="flex justify-center text-center items-center md:p-10 p-8">
          <div className=" border-2 p-8 shadow-xl">
            <div>
              <Typography
                variant="h3"
                color="blue-gray"
                className="mb-2 text-2xl font-themefont uppercase"
              >
                Sign In
              </Typography>
              <Typography className="mb-10 text-gray-600 font-normal font-headingfont text-[14px]">
                Login with the Lark Brennet
              </Typography>
              <form
                onSubmit={handleSubmit(onSubmit)}
                action="#"
                className="mx-auto max-w-[24rem] text-left"
              >
                <div className="mb-6">
                  <label htmlFor="email">
                    <Typography
                      variant="small"
                      className="mb-2 block font-medium font-themefont text-gray-900"
                    >
                      Phone Number
                    </Typography>
                  </label>
                  <Input
                    id="phone"
                    color="gray"
                    size="lg"
                    type="tel"
                    maxLength={10}
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Phone number is required",
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
                    className="w-full placeholder:opacity-100 focus:!border-gray-900 rounded-none"
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                  <p className="text-red-600 text-xs mt-1">
                    {errors.email?.message || backendError}
                  </p>
                </div>
                {/* <div className="mb-6">
                  <label htmlFor="password">
                    <Typography
                      variant="small"
                      className="mb-2 block font-medium font-themefont text-gray-900"
                    >
                      Password
                    </Typography>
                  </label>
                  <Input
                    size="lg"
                    placeholder="********"
                    labelProps={{
                      className: "hidden",
                    }}
                    className="w-full placeholder:opacity-100 focus:!border-gray-900 rounded-none"
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
                </div> */}
                <Button
                  color="gray"
                  size="lg"
                  type="submit"
                  className="mt-6 font-themefont rounded-none bg-theme-secondary hover:bg-theme-primary border border-theme-primary text-theme-primary hover:text-theme-secondary"
                  fullWidth
                >
                  sign in
                </Button>
                {/* <div className="!mt-4 flex justify-end">
                  <Typography
                    as="a"
                    href="#"
                    color="blue-gray"
                    variant="small"
                    className="font-medium font-headingfont"
                  >
                    Resend OTP
                  </Typography>
                </div> */}

                <div className="flex gap-4 items-center">
                  <Button
                    variant="outlined"
                    size="lg"
                    className="mt-6 flex h-12 items-center justify-center rounded-none gap-2"
                    fullWidth
                  >
                    <img
                      src={`https://www.material-tailwind.com/logos/logo-google.png`}
                      alt="google"
                      className="h-6 w-6"
                    />{" "}
                    <span className="font-themefont">google</span>
                  </Button>
                  <Button
                    variant="outlined"
                    size="lg"
                    className="mt-6 flex h-12 items-center justify-center rounded-none gap-2"
                    fullWidth
                  >
                    <img
                      src={`https://www.material-tailwind.com/logos/logo-facebook.png`}
                      alt="google"
                      className="h-6 w-6"
                    />{" "}
                    <span className="font-themefont">Facebook</span>
                  </Button>
                </div>
                <Typography
                  variant="small"
                  color="gray"
                  className="!mt-4 text-center font-normal font-headingfont"
                >
                  New User?{" "}
                  <a
                    href="#"
                    className="font-medium text-gray-900 font-headingfont"
                  >
                    Create account
                  </a>
                </Typography>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Login;
