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
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { EyeOff, Eye } from "lucide-react";
import axios from "../../../axios.js";
import { useDispatch } from "react-redux";
import { setUser } from "../../Auth/UserSlice.js";
import PhoneNumberUpdate from "./PhoneNumberUpdate.jsx";
import SideProfiles from "./SideProfiles.jsx";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PasswordChange from "./PasswordChange.jsx";
const Profile = () => {
  // fetch details start
  const token = Cookies.get("token");
  let cookiesUser = "";
  if (Cookies.get("user")) {
    cookiesUser = JSON.parse(Cookies.get("user"));
  }
  console.log("user for profile page", cookiesUser);

  const [oldPhone, setOldPhone] = useState("");
  // form data
  const { register, handleSubmit, formState, reset, watch } = useForm({
    defaultValues: {
      name: cookiesUser.name || "",
      email: cookiesUser.email || "",
      lastname: cookiesUser.lastname || "",
      phone: cookiesUser.phone || "",
      dob: cookiesUser.dob || "",
      gender: cookiesUser.gender || "Male",
    },
  });
  const { errors } = formState;

  // otp modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  // otp modal
  // ========================
  // profile update
  const dispatch = useDispatch();
  const [tempNumber, setTempNumber] = useState(null);
  const [tempNumberBased, setTempNumberBased] = useState([]);
  const [passwordField, setPasswordField] = useState("");
  const ProfileSubmit = async (data) => {
    console.log("formdata test", data);

    const newphone = data?.phone;

    if (cookiesUser.phone !== newphone) {
      setTempNumberBased(data);

      const formData = {
        phone: newphone,
      };
      const res = await axios.post(
        `/v2/profile/update/${cookiesUser.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("profile updated successfully");
      setOpen(true);
      return;
    } else {
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
        // console.log("res.data?.user", res.data?.user);
        toast.success("profile updated successfully");
        dispatch(setUser({ user }));
        Cookies.set("user", JSON.stringify(user), {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      } catch (error) {
        console.log("Profile update error", error);
        toast.error(error.response?.data?.message);
      }
    }
  };

  // fetch details end
  const [dob, setDob] = useState("2025-07-03");

  // const [email, setEmail] = useState("jegadees@technox.in");

  // BillingAddress
  const [address, setAddress] = useState([]);

  useEffect(() => {
    fetchBillingAddress();
  }, []);

  const fetchBillingAddress = async () => {
    try {
      const res = await axios.get(
        `/v2/user/shipping/billingaddress/${cookiesUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const getdata = res.data?.data;
      console.log("getdata", getdata);

      setAddress(getdata);
    } catch (error) {
      console.log("error", error);
    }
  };

  // navigate to profile address start
  const navigate = useNavigate();
  const getShippingAds = () => {
    navigate("/profile-address");
  };
  // navigate to profile address end

  const [passwordChange, setPasswordChange] = useState(false);
  const pwdChange = () => {
    setPasswordChange((data) => !data);
  };

  return (
    <>
      <ToastContainer />
      {/* content start */}
      <div className="container mx-auto md:mt-20 mt-24">
        <div className="grid grid-cols-12">
          {/* section 1 start*/}
          {/* SideProfiles start */}
          <SideProfiles />
          {/* SideProfiles end */}

          <div className="lg:col-span-8 md:col-span-6 sm:col-span-12 col-span-12 mt-9 mb-10 lg:mx-2 px-4">
            <Card className="w-full border rounded-none border-theme-primary/10 shadow-lg mt-1 p-10">
              <div>
                <h2 className="lg:text-sm text-xs text-theme-primary/70 xs:text-red-600 font-themefont mb-6 bg-theme-primary/80 p-1 text-center text-theme-secondary ">
                  Edit Profile
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-12 gap-8">
                {/* <h2 className="text-sm text-theme-primary/70 xs:text-red-600 font-themefont mb-6">
                Email Id
              </h2> */}

                <div>
                  <label className="text-xs text-theme-primary/70 xs:text-red-600 font-themefont ">
                    Email Id{" "}
                  </label>
                  <Input
                    type="text"
                    {...register("email")}
                    className="mt-2"
                    disabled
                    onChange={(e) => console.log(e.target.value)}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                <div className="mt-2">
                  <div className="flex justify-between">
                    <label className="text-xs text-theme-primary/70 xs:text-red-600 font-themefont ">
                      Password{" "}
                    </label>
                    <label
                      onClick={pwdChange}
                      className="text-xs text-red-500 xs:text-red-600 font-themefont cursor-pointer "
                    >
                      Change Password{" "}
                    </label>
                  </div>
                  <Input
                    type="text"
                    value={"********"}
                    disabled
                    onChange={(e) => console.log(e.target.value)}
                    className="mt-2"
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>
              </div>

              <hr className="lg:my-8 my-4" />

              <div>
                <h2 className="text-sm text-theme-primary/70 xs:text-red-600 font-themefont mb-6">
                  General Information
                </h2>
                {/* form start */}
                <form onSubmit={handleSubmit(ProfileSubmit)}>
                  <div>
                    <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-12 gap-4">
                      <div>
                        <div>
                          <Input
                            variant="outlined"
                            label="First Name"
                            placeholder="First Name"
                            required
                            {...register("name")}
                          />
                        </div>

                        <div className="lg:mt-10 mt-7">
                          <Input
                            variant="outlined"
                            label="DOB"
                            placeholder="mm/dd/yyyy"
                            required
                            type="date"
                            {...register("dob")}
                            // onChange={(e) => setDob(e.target.value)}
                          />
                        </div>

                        <div className="lg:mt-10 mt-7">
                          <h2 className="text-xs  text-theme-primary/70 xs:text-red-600 font-themefont mb-2">
                            Gender
                          </h2>
                          <div className="flex flex-wrap md:gap-5">
                            <label className="flex justify-center items-center text-sm font-themefont text-theme-primary">
                              <Radio
                                {...register("gender")}
                                name="gender"
                                value="Male"
                                ripple={false}
                              />
                              <span> Male</span>
                            </label>
                            <label className="flex justify-center items-center text-sm font-themefont text-theme-primary">
                              <Radio
                                {...register("gender")}
                                name="gender"
                                value="Female"
                                ripple={false}
                              />
                              <span> Female</span>
                            </label>
                            <label className="flex justify-center items-center text-sm font-themefont text-theme-primary">
                              <Radio
                                {...register("gender")}
                                name="gender"
                                value="Other"
                                ripple={false}
                              />
                              <span> Other</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* row 2 start */}
                      <div>
                        <div>
                          <Input
                            variant="outlined"
                            label="Last Name"
                            placeholder="Last Name"
                            required
                            {...register("lastname")}
                          />
                        </div>

                        <div className="lg:mt-10 mt-7">
                          <Input
                            variant="outlined"
                            label="Mobile Number"
                            placeholder="Mobile Number"
                            required
                            {...register("phone")}
                          />
                        </div>

                        <div className="lg:mt-10 mt-7">
                          <h2 className="text-[10px] tracking-wider flex justify-end text-theme-primary/70 xs:text-red-600 font-themefont mb-2">
                            <span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  getShippingAds();
                                }}
                                className="uppercase"
                              >
                                change
                              </button>{" "}
                              / <button className="uppercase">Edit</button>
                            </span>
                          </h2>
                          <div className="w-full">
                            <Textarea
                              variant="outlined"
                              label="Default Address"
                              value={address[0]?.address}
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      {/* row 2 end */}
                    </div>

                    <hr className="my-5" />

                    <div className="text-center">
                      <Button
                        fullWidth
                        type="submit"
                        className="font-themefont text-sm py-2 rounded-none bg-theme-secondary hover:bg-theme-primary border border-theme-primary text-theme-primary hover:text-theme-secondary tracking-wider"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </form>
                {/* form end  */}
              </div>
            </Card>
          </div>
          {/* section 1 End*/}
        </div>
      </div>

      {/* content end */}

      {/* Modal start */}
      <PasswordChange
        pwdChange={pwdChange}
        setPasswordChange={setPasswordChange}
        passwordChange={passwordChange}
      />
      {/* Model End */}

      {/* phone number otp validation */}
      <PhoneNumberUpdate
        handleOpen={handleOpen}
        open={open}
        setOpen={setOpen}
        tempNumberBased={tempNumberBased}
      />
    </>
  );
};

export default Profile;
