import React, { useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeOff, Eye } from "lucide-react";

const ForgotPassword = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  return (
    <>
      <div className="container mx-auto md:mt-24 mt-28">
        <section className="flex justify-center text-center items-center md:p-10 p-8">
          <div className=" border-2 p-8 shadow-xl rounded-lg">
            <div>
              <Typography
                variant="h3"
                color="blue-gray"
                className="mb-2 text-2xl font-themefont"
              >
                Sign In
              </Typography>
              <Typography className="mb-10 text-gray-600 font-normal font-headingfont text-[14px]">
                Login with the Lark Brennet
              </Typography>
              <form action="#" className="mx-auto max-w-[24rem] text-left">
                <div className="mb-6">
                  <label htmlFor="email">
                    <Typography
                      variant="small"
                      className="mb-2 block font-medium font-themefont text-gray-900"
                    >
                      Your Email
                    </Typography>
                  </label>
                  <Input
                    id="email"
                    color="gray"
                    size="lg"
                    type="email"
                    name="email"
                    placeholder="name@mail.com"
                    className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                <Button
                  color="gray"
                  size="lg"
                  className="mt-6 text-xs tracking-wider font-themefont"
                  fullWidth
                >
                  Send Reset Link
                </Button>

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

export default ForgotPassword;
