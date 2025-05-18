import React, { useState, useEffect } from "react";

import {
  Stepper,
  Step,
  Button,
  Typography,
  Radio,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";

import {
  MapPin,
  ShoppingBag,
  IndianRupee,
  CirclePlus,
  Check,
} from "lucide-react";
import AddShippingAddress from "../DeliveryAddress/AddShippingAddress";
import axios from "../../../axios.js";
import Cookies from "js-cookie";
import EditShippingAddress from "../DeliveryAddress/EditShippingAddress.jsx";
import SideProfiles from "./SideProfiles.jsx";

const ProfileAddress = () => {
  const token = Cookies.get("token");
  const cookiesUser = JSON.parse(Cookies.get("user"));

  const [activeStep, setActiveStep] = useState(1);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(0);

  // Remove Modal popup Start
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleOpen = (id) => {
    setOpen((data) => {
      !data;
    });
    setSelectedId(id);
  };
  //Remove Modal popup end

  // add form Modal popup Start
  const [createAddress, setcreateAddress] = useState(false);
  const handleAddOpen = () => {
    setcreateAddress((data) => !data);
  };
  // add form Modal popup end
  // edit

  const [editFormAddress, setEditFormAddress] = useState(false);
  // const handleEditOpen = () => {
  //   setEditFormAddress((data) => !data);
  // };

  // edit address

  const [editDeliveryAddress, setEditDeliveryAddress] = useState([]);

  const editAddress = (id) => {
    // addresses
    if (id) {
      const addressToEdit = fetShippingAddress.find(
        (address) => address.id === id
      );
      setEditDeliveryAddress(addressToEdit);
      setEditFormAddress((data) => !data);
    }
  };

  // console.log("editDeliveryAddress", editDeliveryAddress);

  // api call start

  const [fetShippingAddress, setFetShippingAddress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddress();
  }, [editFormAddress, setcreateAddress, createAddress, setEditFormAddress]);

  const fetchAddress = async () => {
    try {
      const response = await axios.get(
        `/v2/user/shipping/getaddress/${cookiesUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const FetData = response.data;
      if (FetData.status === 200) {
        setFetShippingAddress(FetData.data);
      }
    } catch (error) {
      console.log("Fetch Address Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // console.log("fetShippingAddress", fetShippingAddress);

  // remove address

  const removeAddress = async (id) => {
    try {
      // console.log("removeAddress", id);

      const res = await axios.get(`/v2/user/shipping/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("Remove Address Response:", res.data);
      if (res.data.result === true) {
        fetchAddress();
      }
    } catch (error) {
      console.log("Remove Address Error:", error);
    }
  };

  // api call end

  // Skeleton loader
  const renderAddressSkeletons = () =>
    Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="text-theme-primary/60 shadow-md h-full font-themefont text-sm border-2 border-black/10 p-5 animate-pulse"
      >
        <div className="relative">
          <div className="w-full space-y-2">
            {/* Name skeleton */}
            <div className="h-4 w-1/3 bg-gray-300 rounded" />

            {/* Address lines skeleton */}
            <div className="space-y-1">
              <div className="h-3 w-5/6 bg-gray-300 rounded" />
              <div className="h-3 w-2/3 bg-gray-300 rounded" />
            </div>

            {/* City and postal code */}
            <div className="h-3 w-1/2 bg-gray-300 rounded" />

            {/* State name */}
            <div className="h-3 w-1/2 bg-gray-300 rounded" />

            {/* Country name */}
            <div className="h-3 w-1/2 bg-gray-300 rounded" />

            {/* Mobile number */}
            <div className="h-3 w-2/3 bg-gray-300 rounded" />
          </div>

          {/* Radio button placeholder */}
          <div className="absolute top-0 right-0">
            <div className="w-5 h-5 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-2 mt-4">
          <div className="h-8 w-20 bg-gray-300 rounded" />
          <div className="h-8 w-20 bg-gray-300 rounded" />
        </div>
      </div>
    ));

  // Skeleton loader end

  // setDefaultAddress start
  const setDefaultAddress = async (id) => {
    if (!id) return;

    const addressToEdit = fetShippingAddress?.find(
      (address) => address.id === id
    );
    if (!addressToEdit) {
      console.error("Address not found for the given ID:", id);
      return;
    }

    try {
      const addressString = addressToEdit.address || "";
      const addressParts = addressString.split(",").map((part) => part.trim());

      const formData = {
        ...addressToEdit,
        building: addressParts[0] || "",
        street: addressParts[1] || "",
        landmark: addressParts.slice(2).join(", ") || "",
        set_default: 1,
      };

      const res = await axios.post("/v2/user/shipping/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.result === true) {
        fetchAddress(); // Refresh the list of addresses
      } else {
        console.warn(
          "Failed to set default address:",
          res.data?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };
  // setDefaultAddress end
  return (
    <>
      {/* content start */}
      <div className="container mx-auto md:mt-20 mb-10 mt-28">
        <div className="grid grid-cols-12 gap-4 mt-8">
          {/* line start */}

          {/* line end  */}

          {/* Delivery address start */}
          <SideProfiles />

          <div className="lg:col-span-8 md:col-span-8 sm:col-span-12 col-span-12 mt-10 lg:mx-10 mx-4">
            <div>
              <h2 className="text-sm text-theme-primary/70 font-themefont mb-6">
                Delivery To
              </h2>
            </div>
            {/* add your address */}

            <div className="grid md:grid-cols-2 grid-cols-0 gap-4">
              {loading ? (
                renderAddressSkeletons()
              ) : (
                <>
                  {fetShippingAddress.map((address, index) => (
                    <label
                      key={address.id}
                      className={`text-theme-primary/60 shadow-md cursor-pointer h-full font-themefont text-sm border-2  border-black/10 p-5 ${
                        address.set_default === 1 ? "bg-theme-primary/10" : ""
                      }`}
                      onClick={() => setDefaultAddress(address.id)}
                    >
                      <div className="relative">
                        <div className="w-full">
                          <p className="font-black uppercase text-theme-primary text-md line-clamp-1">
                            {address.name} {address.lname}
                          </p>
                          <p className="mt-1 truncate">
                            {address.address
                              .split(",")
                              .map((part, index, arr) => (
                                <React.Fragment key={index}>
                                  {part.trim()},
                                  {index < arr.length - 1 && <br />}
                                </React.Fragment>
                              ))}
                          </p>

                          <p className="mt-1 line-clamp-1">
                            {address.city_id} - {address.postal_code},{" "}
                          </p>
                          <p className="mt-1 line-clamp-1">
                            {address.state_name},
                          </p>
                          <p className="mt-1 line-clamp-1">
                            {address.country_name},
                          </p>
                          <p className="mt-1 line-clamp-1">
                            Mobile:{" "}
                            <span className="font-semibold text-theme-primary">
                              {address.phone}
                            </span>
                          </p>
                        </div>

                        <div className="absolute top-0 right-0">
                          <Radio
                            name="address"
                            value={address.set_default}
                            icon={
                              <Check className="bg-theme-primary text-theme-secondary p-1 rounded-full" />
                            }
                            checked={address.set_default === 1}
                            onChange={() =>
                              setSelectedAddress(address.set_default)
                            }
                            className="border-gray-900/10 bg-gray-900/5 p-0 transition-all hover:before:opacity-0"
                            ripple={false}
                          />
                        </div>
                      </div>
                      {address.set_default === 1 && (
                        <>
                          <div className="flex gap-2 my-3">
                            <Button
                              className="py-2 px-3 bg-theme-secondary text-theme-primary border-2 border-theme-primary rounded-none"
                              onClick={() => editAddress(address.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              className="py-2 px-3 rounded-none"
                              onClick={() => handleOpen(address.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </>
                      )}
                    </label>
                  ))}

                  <div
                    className="text-theme-primary/60 flex justify-center cursor-pointer font-themefont text-sm border-2  border-black/10 p-20"
                    onClick={handleAddOpen}
                  >
                    <div className="flex flex-col justify-center items-center gap-1">
                      <CirclePlus className="size-10 text-theme-primary/60" />
                      <p className="text-theme-primary/60">Add New Address</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Address popup start */}

      <AddShippingAddress
        createAddress={createAddress}
        setcreateAddress={setcreateAddress}
        // fetchAddress={fetchAddress}
      />

      <EditShippingAddress
        editFormAddress={editFormAddress}
        setEditFormAddress={setEditFormAddress}
        editDeliveryAddress={editDeliveryAddress}
        // setEditState={setEditState}
      />

      {/* Add Address popup end */}

      {/* remove popup start */}

      <Dialog
        open={!!selectedId}
        handler={() => handleOpen(null)}
        size={"sm"}
        className="rounded-none"
      >
        <DialogBody>
          <div className="flex justify-center">
            <div className="flex gap-2">
              <div className="px-3">
                <p className="mt-2 text-custom-headingclr text-sm font-semibold font-headingfont">
                  Are you sure you want to remove this address ?
                </p>
              </div>
            </div>
          </div>
          <hr className="my-2" />
          <div className="mt-3 flex justify-center gap-5">
            <Button
              className="px-6 py-2 rounded-none"
              onClick={() => handleOpen(null)}
            >
              No
            </Button>
            <Button
              className="px-6 py-2 bg-red-600 rounded-none"
              onClick={() => {
                if (selectedId) {
                  removeAddress(selectedId);
                  handleOpen(null);
                }
              }}
            >
              Yes
            </Button>
          </div>
        </DialogBody>
      </Dialog>
      {/* remove popup end */}
      {/* Model Popup end */}

      {/* content end */}
    </>
  );
};

export default ProfileAddress;
