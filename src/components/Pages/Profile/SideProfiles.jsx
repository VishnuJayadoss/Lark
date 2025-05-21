import React, { useState } from "react";
import {
  List,
  ListItem,
  Card,
  Button,
  Avatar,
  Dialog,
  DialogBody,
  IconButton,
} from "@material-tailwind/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "../../../axios.js";
import Cookies from "js-cookie";
import { clearUser } from "../../Auth/UserSlice.js";
import { useForm } from "react-hook-form";
const SideProfiles = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //   get token
  const token = Cookies.get("token");
  const cookiesUser = JSON.parse(Cookies.get("user"));
  //   logout start
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(clearUser());
    Cookies.remove("user");
    Cookies.remove("token");
    navigate("/login");
  };
  //   logout end

  //   delete my accout start

  //   delete confirm
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const DeleteMYAccout = () => {
    setOpen(true);
  };
  //   delete confirm end

  //   delete function start
  const DeleteUserProfile = async () => {
    try {
      const res = await axios.get("/v2/auth/account-deletion", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responnse = res.data;
      if (responnse.result === true) {
        setOpen(false);
        logout();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  // delete function end
  // delete my account end

  //   profile image update start

  const [openProfileImg, setOpenProfileImg] = useState(false);
  const handleProfileImg = () => setOpenProfileImg(!openProfileImg);

  const UpdateProfileImg = () => {
    setOpenProfileImg(true);
  };

  //   form submit start
  const { register, handleSubmit, watch, setError, formState } = useForm();
  const { isSubmitSuccessful, errors } = formState;
  const password = watch("password");

  const updateImgae = async (data) => {
    console.log("form data", data.image[0]);

    const formData = new FormData();
    formData.append("image", data.image[0]); // This is how you send file data

    try {
      const res = await axios.post("/v2/profile/image-upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

      const response = res.data;
      if (response.result === true) {
        setOpenProfileImg(false);
        console.log("Image uploaded successfully", response);
      } else {
        console.log("Upload failed", response.message);
      }
    } catch (error) {
      console.error("Upload error", error);
    }
  };

  // form submit end
  // profile image update end

  return (
    <>
      <div className="lg:col-span-4 md:col-span-6 sm:col-span-12 col-span-12 mt-10 lg:mx-10 mx-4">
        <Card className="w-full px-4 py-5 items-center bg-theme-primary/10 rounded-none">
          <div className="flex justify-center items-center flex-col">
            <Avatar
              src="https://docs.material-tailwind.com/img/face-2.jpg"
              alt="avatar"
              withBorder={true}
              className="p-0.5"
              size="xxl"
            />
            {/* <h2 className="text-[10px] mt-2 tracking-wider flex justify-end text-theme-primary/70 xs:text-red-600 font-themefont mb-2">
              <span>
                <Button
                  className="tracking-widest py-1 px-2 text-[9px] rounded-none bg-theme-primary/70"
                  onClick={UpdateProfileImg}
                >
                  Update
                </Button>
              </span>
            </h2> */}
          </div>

          <div className="flex justify-center items-center flex-col mt-4">
            <p className="text-sm font-themefont text-theme-primary">
              {cookiesUser?.name}
            </p>
            <p className="text-xs mt-1 uppercase">
              Lark Brennet ID :{" "}
              <span className="font-bold">LB{cookiesUser?.id}</span>
            </p>
            <p className="text-sm mt-1">{cookiesUser?.email}</p>
          </div>
        </Card>
        <Card className="w-full shadow-lg mt-2 py-2 hidden md:block rounded-none">
          <List className="">
            <Link to={"/orderlist"}>
              <ListItem
                className={`border rounded-none text-sm font-themefont grid grid-cols-2 focus:bg-theme-primary focus:text-theme-secondary ${
                  location.pathname === "/orderlist"
                    ? "bg-theme-primary text-theme-secondary"
                    : ""
                }`}
              >
                <span>Orders</span> <span>(Track your order here)</span>
              </ListItem>
            </Link>
            <Link to={"/faq"}>
              <ListItem className="border rounded-none text-sm font-themefont focus:bg-theme-primary focus:text-theme-secondary">
                FAQ
              </ListItem>
            </Link>
            <Link to={"/profile"}>
              <ListItem
                className={`border rounded-none text-sm font-themefont focus:bg-theme-primary focus:text-theme-secondary ${
                  location.pathname === "/profile"
                    ? "bg-theme-primary text-theme-secondary"
                    : ""
                }`}
              >
                Profile
              </ListItem>
            </Link>
          </List>

          <div className="m-2 flex flex-col ">
            <Button
              className="my-2 bg-theme-secondary rounded-none border border-theme-primary text-theme-primary"
              onClick={DeleteMYAccout}
            >
              Delete My Account
            </Button>
            <Button className="rounded-none" onClick={logout}>
              Logout
            </Button>
          </div>
        </Card>
      </div>

      {/* remove popup start */}

      <Dialog
        open={open}
        handler={handleOpen}
        size={"sm"}
        className="rounded-none"
      >
        <DialogBody>
          <div className="flex justify-between">
            <div className="flex gap-2">
              {/* <img
                src={removeCartImage}
                alt="selected"
                className="md:w-1/6 w-1/4 "
              /> */}

              <div className="px-3 md:max-w-[280px] max-w-[200px]">
                <p className="mt-2 text-custom-headingclr text-[13px] font-semibold font-headingfont">
                  Are you sure you want to delete your account?
                </p>
              </div>
            </div>

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
          <hr className="my-4" />
          <div className="mt-2">
            <div className="grid grid-cols-2 gap-5">
              <Button
                className="test-sm bg-theme-secondary text-theme-primary rounded-none border-2 border-theme-primary"
                onClick={handleOpen}
              >
                No
              </Button>
              <Button
                className="test-sm rounded-none"
                onClick={DeleteUserProfile}
              >
                Yes
              </Button>
            </div>
          </div>
        </DialogBody>
      </Dialog>
      {/* remove popup end */}

      {/* update IMage popup start */}

      <Dialog
        open={openProfileImg}
        handler={handleProfileImg}
        size={"sm"}
        className="rounded-none"
      >
        <DialogBody>
          <form onSubmit={handleSubmit(updateImgae)}>
            <div className="flex justify-between">
              <div className="flex gap-2">
                {/* <img
                src={removeCartImage}
                alt="selected"
                className="md:w-1/6 w-1/4 "
              /> */}

                <div className="px-3 md:max-w-[280px] max-w-[200px]">
                  <p className="mt-2 text-custom-headingclr text-sm font-semibold font-headingfont">
                    Upload Image
                  </p>
                </div>
              </div>

              <IconButton
                variant="text"
                color="blue-gray"
                onClick={handleProfileImg}
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
            <hr className="my-4" />

            <div>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    {...register("image")}
                  />
                </label>
              </div>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-2 gap-5">
                <Button
                  className="test-sm bg-theme-secondary text-theme-primary rounded-none border-2 border-theme-primary"
                  onClick={handleProfileImg}
                >
                  Cancel
                </Button>
                <Button className="test-sm rounded-none" type="submit">
                  Update
                </Button>
              </div>
            </div>
          </form>
        </DialogBody>
      </Dialog>
      {/* update IMage popup end */}
    </>
  );
};

export default SideProfiles;
