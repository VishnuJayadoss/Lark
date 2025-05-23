import React, { useState, useRef } from "react";
import { Typography, Input, Button, Textarea } from "@material-tailwind/react";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "../../../axios.js";
import { ToastContainer, toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const Contact = () => {
  const form = useForm();
  const { register, handleSubmit, reset, formState } = form;
  const { errors } = formState;
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef();

  const handleCaptchaChange = (value) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value);
  };
  const onSubmit = async (data) => {
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

      const toastId = toast.loading("Sending mail...", {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: true,
      });

      const formData = {
        ...data,
        recaptcha_token: captchaValue,
      };

      const res = await axios.post("/mail", formData);
      const resData = res.data;

      if (resData?.message) {
        toast.update(toastId, {
          render: resData?.message,
          type: "success",
          isLoading: false,
          closeOnClick: false,
          autoClose: 5000,
        });
        reset();
        setCaptchaValue(null);
        recaptchaRef.current.reset();
      }
    } catch (error) {
      console.log("contact page", error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="bg-theme-primary">
      {/* content start */}
      <div>
        <ToastContainer />
      </div>
      <div className="container mx-auto md:mt-20 mt-24">
        <div className="grid grid-cols-12">
          {/* section 1 start*/}

          <div className="col-span-12 md:col-span-12 lg:col-span-7  mt-10">
            <div className="md:p-10 p-8">
              <h2 className="text-2xl font-themefont uppercase font-black">
                Get in Touch
              </h2>
              <p className="mt-4 text-justify">
                You need more information? Check what other persons are saying
                about our product. They are very happy with their purchase.You
                need more information? Check what other persons are saying about
                our product. They are very happy with their purchase. You need
                more information? Check what other persons are saying about our
                product. They are very happy with their purchase.
              </p>
            </div>

            {/* section 2 start */}
            <div className="md:mt-2 p-8 md:px-10">
              <div className="flex items-center gap-2">
                {" "}
                <Mail className="fill-theme-secondary text-theme-primary size-[23px]" />
                <p className="text-[16px] font-themefont font-black">
                  <a href="mailto:example@gmail.com">example@gmail.com</a>
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4">
                {" "}
                <Phone className="fill-theme-secondary text-theme-primary size-[23px]" />
                <p className="text-[16px] font-themefont font-black">
                  <a href="tel:+911234567890"> +91 1234567890</a>
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                {" "}
                <MapPin className="fill-theme-secondary text-theme-primary size-[40px]" />
                <p className="text-[16px] font-themefont font-black text-justify">
                  D.No. 54, 1st Floor, Above Hang Out, Bharathi Park Rd, 7th
                  cross, Saibaba colony, Coimbatore-641011.
                </p>
              </div>
            </div>
            {/* section 2 end */}

            {/* section 3 start */}
            <div className="md:mt-10 md:mx-2 mx-12 md:px-10">
              <div className="flex items-center gap-2">
                {" "}
                <Instagram className="fill-theme-secondary text-theme-primary size-[40px] border rounded-full border-white p-2" />
                <Facebook className="fill-theme-secondary text-theme-primary  size-[40px] border rounded-full border-white p-2" />
                <Twitter className="fill-theme-secondary text-theme-primary  size-[40px] border rounded-full border-white p-2" />
              </div>
            </div>
            {/* section 4 end */}
          </div>
          <div className="col-span-12 md:col-span-12 lg:col-span-5  my-10">
            <section className="flex justify-center items-center md:p-10 p-8">
              <div className="bg-theme-secondary border-2 p-8 shadow-xl">
                <div>
                  <Typography
                    variant="h3"
                    color="blue-gray"
                    className="mb-5 text-2xl text-center font-themefont uppercase"
                  >
                    Contact Us
                  </Typography>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    action="#"
                    className="mx-auto max-w-[24rem] text-left"
                  >
                    <div className="mb-6">
                      <div className="w-full max-w-sm min-w-[300px]">
                        <div className="relative">
                          <Input
                            type="text"
                            {...register("honeypot")}
                            className="hidden"
                            autoComplete="off"
                          />
                          <Input
                            label="Your Name"
                            className="border-t-0 focus:border-t-0"
                            {...register("name", {
                              required: {
                                value: true,
                                message: "Name Field is Required",
                              },
                            })}
                          />
                          <p className="text-red-600 text-xs mt-1">
                            {errors.name?.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="w-full max-w-sm min-w-[300px]">
                        <div className="relative">
                          <Input
                            label="Your Email"
                            {...register("email", {
                              required: {
                                value: true,
                                message: "Email Field is Required",
                              },
                              pattern: {
                                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: "Invalid email formate",
                              },
                            })}
                            className="border-t-0 focus:border-t-0"
                          />
                          <p className="text-red-600 text-xs mt-1">
                            {errors.email?.message}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-6">
                      <div className="w-full max-w-sm min-w-[300px]">
                        <div className="relative">
                          <Input
                            label="Your Number"
                            type="tel"
                            maxLength={10}
                            {...register("phone", {
                              required: {
                                value: true,
                                message: "Number Field is Required",
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
                              e.target.value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                            }}
                            className="border-t-0 focus:border-t-0"
                          />
                          <p className="text-red-600 text-xs mt-1">
                            {errors.phone?.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="w-full max-w-sm min-w-[300px]">
                        <div className="relative">
                          <Textarea
                            variant="outlined"
                            {...register("message", {
                              required: {
                                value: true,
                                message: "Message Field is Required",
                              },
                            })}
                            label="Message"
                            className="border-t-0 focus:border-t-0"
                          />
                          <p className="text-red-600 text-xs mt-1">
                            {errors.message?.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6LeghEQrAAAAACXcC0-c1uMLYsmSF3VpKS7YVlpi"
                      onChange={handleCaptchaChange}
                      className="my-4"
                    />
                    <Button
                      color="gray"
                      size="lg"
                      className="mt-6 font-themefont rounded-none"
                      fullWidth
                      type="submit"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* content end */}
      <hr />
    </div>
  );
};

export default Contact;
