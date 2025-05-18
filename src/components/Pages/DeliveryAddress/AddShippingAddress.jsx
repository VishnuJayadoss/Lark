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

const AddShippingAddress = ({ createAddress, setcreateAddress }) => {
  const handleAddOpen = () => {
    setcreateAddress((data) => !data);
  };

  //   fetch states
  const token = Cookies.get("token");
  const cookiesUser = JSON.parse(Cookies.get("user"));
  const [stateList, setStateList] = useState([]);

  useEffect(() => {
    AddAddressData();
  }, []);

  const AddAddressData = async () => {
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
      } else {
        setStateList([]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  //   form Validation
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
      // console.log("data", data);

      const formData = {
        ...data,
        user_id: cookiesUser.id,
      };

      const res = await axios.post("/v2/user/shipping/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data?.result === true) {
        setcreateAddress(false);
        reset();
        setCountry("");
        setState("");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Dialog
        open={createAddress}
        handler={handleAddOpen}
        size={"md"}
        className="md:relative absolute md:top-0 top-1 h-[80%] md:h-auto overflow-y-scroll md:overflow-visible rounded-none"
      >
        <DialogBody>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div className="px-3 md:max-w-[280px] max-w-[200px]">
                <p className="mt-2 text-theme-primary text-md font-semibold font-headingfont line-clamp-1">
                  Add New Address
                </p>
              </div>
            </div>

            <IconButton
              variant="text"
              color="blue-gray"
              onClick={handleAddOpen}
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
          <hr className="my-2" />
          <div className="mt-2">
            <form action="" onSubmit={handleSubmit(OnSubmit)}>
              <div className="font-headingfont px-2 pb-2 mt-4">
                <div className="grid md:grid-cols-2 grid-cols-1 justify-between md:gap-4">
                  <div className="md:mb-5 mb-2">
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
                        <p className="text-red-600 text-xs mt-1">
                          {errors.name?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="md:mb-5 mb-2">
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
                        <p className="text-red-600 text-xs mt-1">
                          {errors.lname?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:mb-5 mb-2">
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

                      <p className="text-red-600 text-xs mt-1">
                        {errors.building?.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:mb-5 mb-2">
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
                      <p className="text-red-600 text-xs mt-1">
                        {errors.street?.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:mb-5 mb-2">
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
                      <p className="text-red-600 text-xs mt-1">
                        {errors.landmark?.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 justify-between md:gap-4">
                  <div className="md:mb-5 mb-2">
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
                        <p className="text-red-600 text-xs mt-1">
                          {errors.postal_code?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="md:mb-5 mb-2">
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
                        <p className="text-red-600 text-xs mt-1">
                          {errors.city_id?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 grid-cols-1 justify-between md:gap-4">
                  <div className="md:mb-5 mb-2">
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
                        <p className="text-red-600 text-xs mt-1">
                          {errors.country_id?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="md:mb-5 mb-2">
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
                        <p className="text-red-600 text-xs mt-1">
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
                      <p className="text-red-600 text-xs mt-1">
                        {errors.phone?.message}
                      </p>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-2 text-blue-gray-700 cursor-pointer font-headingfont text-sm">
                  <Checkbox
                    className="bg-theme-secondary w-4 h-4 border-theme-primary/30 checked:bg-theme-primary checked:border-gold text-gold"
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
              <div className="grid grid-cols-2 gap-3 mx-2">
                <Button
                  className="w-full bg-red-800 rounded-none"
                  fullWidth
                  onClick={handleAddOpen}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-theme-primary rounded-none"
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

export default AddShippingAddress;
