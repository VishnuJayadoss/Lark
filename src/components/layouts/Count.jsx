import React, { useState, useEffect } from "react";
import axios from "../../axios.js";
import { useDispatch } from "react-redux";
import { setCount, setWishCount } from "./CountSlice.js";
import Cookies from "js-cookie";
import debounce from "lodash/debounce";

const Count = ({ triggerCount }) => {
  const userCookie = Cookies.get("user");
  const cookiesUser = userCookie ? JSON.parse(userCookie) : null;
  const cookiesToken = Cookies.get("token") || null;

  const dispatch = useDispatch();
  const [countNum, setCountNum] = useState(0);
  const [wishListNum, setWishListNum] = useState(0);

  const fetchCounts = async () => {
    if (!cookiesUser) return;

    try {
      const [cartRes, wishRes] = await Promise.all([
        axios.get(`/v2/cart-count/${cookiesUser.id}`, {
          headers: { Authorization: `Bearer ${cookiesToken}` },
        }),
        axios.get(`/v2/wishlist-count/${cookiesUser.id}`, {
          headers: { Authorization: `Bearer ${cookiesToken}` },
        }),
      ]);

      // Cart
      if (cartRes.data?.status === true) {
        setCountNum(cartRes.data?.count);
        dispatch(setCount({ cartCount: cartRes.data?.count }));
      } else {
        setCountNum(0);
      }

      // Wishlist
      if (wishRes.data?.status === true) {
        setWishListNum(wishRes.data?.count);
        dispatch(setWishCount({ wishCount: wishRes.data?.count }));
      } else {
        setWishListNum(0);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const debouncedFetchCounts = debounce(fetchCounts, 1000); // 1 sec debounce

  useEffect(() => {
    debouncedFetchCounts();

    return () => {
      debouncedFetchCounts.cancel();
    };
  }, [triggerCount]);

  return <></>;
};

export default Count;
