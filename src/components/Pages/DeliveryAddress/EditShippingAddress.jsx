import React, { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogBody,
  Input,
  Select,
  Option,
  Checkbox,
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import axios from "../../../axios.js";

const EditShippingAddress = ({
  setEditFormAddress,
  editFormAddress,
  editDeliveryAddress,
  //   setEditState,
}) => {
  const handleEditOpen = () => setEditFormAddress(!editFormAddress);

  //   fetch states
  const token = Cookies.get("token");
  const cookiesUser = JSON.parse(Cookies.get("user"));
  const [stateList, setStateList] = useState([]);

  useEffect(() => {
    EditAddressData();
  }, []);

  const EditAddressData = async () => {
    try {
      const res = await axios.get("/v2/states-by-country/101", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data?.success === true) {
        reset();
        const stateData = res.data?.data;
        setStateList(stateData);
        // setEditState(true);
      } else {
        setStateList([]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  //   form Validation start
  const { register, handleSubmit, reset, setValue, watch, formState } =
    useForm();

  const { errors } = formState;

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    register("country_id", { required: "Country field is required" });
    register("state_id", { required: "State field is required" });
  }, [register]);

  const OnSubmit = async (data) => {
    try {
      //   console.log("data", data);

      const formData = {
        ...data,
        user_id: cookiesUser.id,
        id: editDeliveryAddress.id,
      };

      const res = await axios.post("/v2/user/shipping/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data?.result === true) {
        setEditFormAddress(false);
        reset();
        setCountry("");
        setState("");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  //   fetch data form editDeliveryAddress start
  useEffect(() => {
    if (editDeliveryAddress) {
        console.log('editDeliveryAddress',editDeliveryAddress.phone);
        
      const addressParts = editDeliveryAddress.address?.split(",") || ["", ""];
      reset({
        name: editDeliveryAddress.name || "",
        lname: editDeliveryAddress.lname || "",
        building: addressParts[0],
        street: addressParts.slice(1, 2).join(","),
        landmark: addressParts.slice(2).join(","),
        postal_code: editDeliveryAddress.postal_code || "",
        city_id: editDeliveryAddress.city_id || "",
        phone: editDeliveryAddress.phone || "",
        set_default: editDeliveryAddress.set_default || 0,
        country_id: editDeliveryAddress.country_id?.toString() || "",
        state_id: editDeliveryAddress.state_id?.toString() || "",
      });
      setCountry(editDeliveryAddress.country_id?.toString() || "");
      setState(editDeliveryAddress.state_id?.toString() || "");
    }
  }, [editDeliveryAddress, reset]);
  //   fetch data form editDeliveryAddress end
  return (
    <>
      <Dialog
        open={editFormAddress}
        handler={handleEditOpen}
        size={"md"}
        className="top-1 md:top-0 absolute md:relative rounded-none h-[80%] md:h-auto md:overflow-visible overflow-y-scroll"
      >
        <DialogBody>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div className="px-3 max-w-[200px] md:max-w-[280px]">
                <p className="mt-2 font-headingfont font-semibold text-md text-theme-primary line-clamp-1">
                  Edit Shipping Address
                </p>
              </div>
            </div>

            <IconButton
              variant="text"
              color="blue-gray"
              onClick={handleEditOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          <hr className="my-2" />
          <div className="mt-2">
            <form action="" onSubmit={handleSubmit(OnSubmit)}>
              <div className="mt-4 px-2 pb-2 font-headingfont">
                <div className="justify-between md:gap-4 grid grid-cols-1 md:grid-cols-2">
                  <div className="mb-2 md:mb-5">
                    <div className="w-full">
                      <div className="relative">
                        <Input
                          label="First Name *"
                          {...register("name", {
                            required: {
                              value: true,
                              message: "Name field is required",
                            },
                          })}
                          className="border-t-0 focus:border-t-0"
                        />
                        <p className="mt-1 text-red-600 text-xs">
                          {errors.name?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 md:mb-5">
                    <div className="w-full">
                      <div className="relative">
                        <Input
                          label="Last Name *"
                          {...register("lname", {
                            required: {
                              value: true,
                              message: "last name field is required",
                            },
                          })}
                          className="border-t-0 focus:border-t-0"
                        />
                        <p className="mt-1 text-red-600 text-xs">
                          {errors.lname?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-2 md:mb-5">
                  <div className="w-full">
                    <div className="relative">
                      <Input
                        label="House No., Building Name*"
                        {...register("building", {
                          required: {
                            value: true,
                            message: "This field is required",
                          },
                          validate: (value) =>
                            !value.includes(",") || "Comma is not allowed",
                        })}
                        onKeyDown={(e) => {
                          if (e.key === ",") {
                            e.preventDefault();
                          }
                        }}
                        className="border-t-0 focus:border-t-0"
                      />
                      <p className="mt-1 text-red-600 text-xs">
                        {errors.building?.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-2 md:mb-5">
                  <div className="w-full">
                    <div className="relative">
                      <Input
                        label="Street Name,Area*"
                        {...register("street", {
                          required: {
                            value: true,
                            message: "This field is required",
                          },
                          validate: (value) =>
                            !value.includes(",") || "Comma is not allowed",
                        })}
                        onKeyDown={(e) => {
                          if (e.key === ",") {
                            e.preventDefault();
                          }
                        }}
                        className="border-t-0 focus:border-t-0"
                      />
                      <p className="mt-1 text-red-600 text-xs">
                        {errors.street?.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-2 md:mb-5">
                  <div className="w-full">
                    <div className="relative">
                      <Input
                        label="Landmark"
                        {...register("landmark", {
                          required: {
                            value: true,
                            message: "This field is required",
                          },
                          validate: (value) =>
                            !value.includes(",") || "Comma is not allowed",
                        })}
                        onKeyDown={(e) => {
                          if (e.key === ",") {
                            e.preventDefault();
                          }
                        }}
                        className="border-t-0 focus:border-t-0"
                      />
                      <p className="mt-1 text-red-600 text-xs">
                        {errors.landmark?.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="justify-between md:gap-4 grid grid-cols-1 md:grid-cols-2">
                  <div className="mb-2 md:mb-5">
                    <div className="w-full">
                      <div className="relative">
                        <Input
                          label="Postal Code*"
                          {...register("postal_code", {
                            required: {
                              value: true,
                              message: "This field is required",
                            },
                          })}
                          className="border-t-0 focus:border-t-0"
                        />
                        <p className="mt-1 text-red-600 text-xs">
                          {errors.postal_code?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 md:mb-5">
                    <div className="w-full">
                      <div className="relative">
                        <Input
                          label="City/District*"
                          {...register("city_id", {
                            required: {
                              value: true,
                              message: "This field is required",
                            },
                          })}
                          className="border-t-0 focus:border-t-0"
                        />
                        <p className="mt-1 text-red-600 text-xs">
                          {errors.city_id?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="justify-between md:gap-4 grid grid-cols-1 md:grid-cols-2">
                  <div className="mb-2 md:mb-5">
                    <div className="w-full">
                      <div className="relative">
                        <Select
                          label="Select Country"
                          value={country}
                          onChange={(value) => {
                            setCountry(value);
                            setValue("country_id", value);
                          }}
                          className="focus:border-t-0"
                        >
                          <Option value="101">India</Option>
                        </Select>
                        <p className="mt-1 text-red-600 text-xs">
                          {errors.country_id?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 md:mb-5">
                    <div className="w-full">
                      <div className="relative">
                        <Select
                          label="Select State"
                          value={state}
                          onChange={(value) => {
                            setState(value);
                            setValue("state_id", value);
                          }}
                          className="focus:border-t-0"
                        >
                          {stateList.map((item, index) => (
                            <Option key={index} value={item.id.toString()}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                        <p className="mt-1 text-red-600 text-xs">
                          {errors.state_id?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-0">
                  <div className="w-full">
                    <div className="relative">
                      <Input
                        maxLength={10} // Adjusted for "+91 XXXXXXXXXX" format
                        {...register("phone", {
                          required: {
                            value: true,
                            message: "This field is required",
                          },
                        })}
                        label="Phone Number*"
                        className="border-t-0 focus:border-t-0"
                      />
                      <p className="mt-1 text-red-600 text-xs">
                        {errors.phone?.message}
                      </p>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-2 font-headingfont text-blue-gray-700 text-sm cursor-pointer">
                  <Checkbox
                    className="bg-theme-secondary checked:bg-theme-primary checked:border-gold border-theme-primary/30 w-4 h-4 text-gold"
                    ripple={true}
                    onChange={(e) => {
                      const value = e.target.checked ? 1 : 0;
                      setValue("set_default", value);
                    }}
                    checked={watch("set_default") === 1}
                  />
                  Make this my default address
                </label>
              </div>
              <div className="gap-3 grid grid-cols-2 mx-2">
                <Button
                  className="bg-red-800 rounded-none w-full"
                  fullWidth
                  onClick={handleEditOpen}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-theme-primary rounded-none w-full"
                  fullWidth
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default EditShippingAddress;
