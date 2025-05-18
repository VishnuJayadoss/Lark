import React, { useEffect, useState } from "react";

import {
  List,
  ListItem,
  Card,
  Button,
  Input,
  Radio,
  Textarea,
  Dialog,
  DialogBody,
  IconButton,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { EyeOff, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setUser } from "../../Auth/UserSlice.js";
import Cookies from "js-cookie";
import axios from "../../../axios.js";
import { toast } from "react-toastify";
const PasswordChange = ({ pwdChange, setPasswordChange, passwordChange }) => {
  const token = Cookies.get("token");
  let cookiesUser = "";
  if (Cookies.get("user")) {
    cookiesUser = JSON.parse(Cookies.get("user"));
  }
  console.log("user for profile page", cookiesUser);

  // form data
  const { register, handleSubmit, formState, reset, watch } = useForm();
  const { errors } = formState;
  const password = watch("password");
  const [passwordField, setPasswordField] = useState("");

  // old password
  const [oldpasswordShown, setOldPasswordShown] = useState(false);
  const toggleOldPasswordVisiblity = () => setOldPasswordShown((cur) => !cur);

  // new password
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  //confirm password
  const [ConfirmpasswordShown, setConfirmPasswordShown] = useState(false);
  const toggleConfirmPasswordVisiblity = () =>
    setConfirmPasswordShown((cur) => !cur);

  // Remove Modal popup Start
  const dispatch = useDispatch();

  const ProfileSubmitPassword = async (data) => {
    try {
      const res = await axios.post(
        `/v2/profile/update/${cookiesUser.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("res.data", res.data);
      const user = res.data?.user;
      console.log("res.data?.user", res.data?.user);
      if (res.data?.result === true) {
        setPasswordChange(false);
        reset();
        toast.success(res.data?.message);
      }

      dispatch(setUser({ user }));
      Cookies.set("user", JSON.stringify(user), {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
    } catch (error) {
      console.log("Profile update error", error);
      setPasswordField(error.response?.data?.message);
    }
  };

  return (
    <>
      <Dialog
        open={passwordChange}
        handler={pwdChange}
        size={"sm"}
        className="rounded-none"
      >
        <DialogBody>
          <form onSubmit={handleSubmit(ProfileSubmitPassword)}>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <div className="md:max-w-[280px] max-w-[200px]">
                  <p className="mt-2 text-theme-primary lg:text-[15px] text-[11px] font-semibold font-headingfont line-clamp-1">
                    Change Password
                  </p>
                </div>
              </div>

              <IconButton variant="text" color="blue-gray" onClick={pwdChange}>
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

            <div>
              <div>
                <label className="text-xs text-theme-primary/70 xs:text-red-600 font-themefont ">
                  Old Password*{" "}
                </label>
                <Input
                  size="lg"
                  placeholder="********"
                  labelProps={{
                    className: "hidden",
                  }}
                  {...register("current_password", {
                    required: {
                      value: true,
                      message: "Password Filed is Required",
                    },
                    validate: (value) =>
                      value.length >= 6 ||
                      "Password min length should be 6 characters",
                  })}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  type={oldpasswordShown ? "text" : "password"}
                  icon={
                    <i onClick={toggleOldPasswordVisiblity}>
                      {oldpasswordShown ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </i>
                  }
                />
                <p className="text-red-600 text-xs mt-1">
                  {errors.current_password?.message || passwordField}
                </p>
              </div>

              <div className="mt-4">
                <label className="text-xs text-theme-primary/70 xs:text-red-600 font-themefont ">
                  New Password*{" "}
                </label>
                <Input
                  size="lg"
                  placeholder="********"
                  labelProps={{
                    className: "hidden",
                  }}
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password Filed is Required",
                    },
                    validate: (value) =>
                      value.length >= 6 ||
                      "Password min length should be 6 characters",
                  })}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
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

              <div className="mt-4">
                <label className="text-xs text-theme-primary/70 xs:text-red-600 font-themefont ">
                  Confirm Password*{" "}
                </label>
                <Input
                  size="lg"
                  placeholder="********"
                  labelProps={{
                    className: "hidden",
                  }}
                  {...register("confirm_password", {
                    required: {
                      value: true,
                      message: "Password Filed is Required",
                    },
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
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
                  {errors.confirm_password?.message}
                </p>
              </div>
            </div>

            <hr className="my-4" />
            <div className="mt-2">
              <div className="grid grid-cols-2 gap-5">
                <Button
                  className="py-2 lg:py-3 px-2 lg:px-3 bg-theme-primary/10 text-theme-primary border border-theme-primary tracking-wider rounded-none"
                  onClick={pwdChange}
                >
                  Cancel
                </Button>
                <Button
                  className="py-2 lg:py-3 px-2 lg:px-3 tracking-wider rounded-none"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default PasswordChange;
