import React, { useState } from "react";
import axios from "../../../axios.js";
import Cookies from "js-cookie";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import Count from "../../layouts/Count.jsx";
const WishlistButton = ({
  productId,
  wishlistStatus,
  setWishlistStatus,
  fetchData,
  isProductDetailsPage = false, // default to false
}) => {
  const token = Cookies.get("token");
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const [triggerCount, setTriggerCount] = useState(false);
  // add to wishlist
  const addToWishlist = async () => {
    if (!user) return console.log("User not logged in");

    try {
      const res = await axios.get(`/v2/wishlists-add-product/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          product_id: productId,
        },
      });
      // console.log("Wishlist add response:", res.data);

      await fetchData();
      const resMessage = res.data?.message;
      setTriggerCount((data) => !data);
      toast.success(resMessage);
    } catch (error) {
      console.log("Wishlist error:", error);
      toast.error(error);
    }
  };

  // remove to wishlist
  const removeWishlistItem = async () => {
    console.log("remove from wishlist");

    try {
      const res = await axios.get("/v2/wishlists-remove-product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          product_id: productId,
        },
      });
      await fetchData();
      const resMessage = res.data?.message;
      setTriggerCount((data) => !data);
      toast.success(resMessage);
    } catch (error) {
      console.log("error", error);
      toast.error(error);
    }
  };

  // console.log("wishlistStatus", wishlistStatus);

  const baseClass = `md:hover:fill-[#e50010] md:hover:text-[#e50010]`;
  const activeClass = wishlistStatus ? "fill-[#e50010] text-[#e50010]" : "";

  return (
    <>
      <Count triggerCount={triggerCount} />
      <Heart
        onClick={wishlistStatus ? removeWishlistItem : addToWishlist}
        className={
          isProductDetailsPage
            ? `w-full h-full mx-1 ${baseClass} ${
                wishlistStatus
                  ? "fill-[#e50010] text-[#e50010]"
                  : "text-theme-primary/50 fill-theme-secondary"
              }`
            : `w-4 h-4 ${baseClass} ${activeClass}`
        }
      />
    </>
  );
};

export default WishlistButton;
