import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartCount: 0,
  wishCount: 0,
};

const CountSlice = createSlice({
  name: "WishlistCount",
  initialState,
  reducers: {
    setCount: (state, action) => {
      // console.log("action.payload.cartCount", action.payload.cartCount);
      state.cartCount = action.payload.cartCount;
    },
    setWishCount: (state, action) => {
      // console.log("action.payload.wishcount", action.payload.wishCount);
      state.wishCount = action.payload.wishCount;
    },
  },
});

export const { setCount, setWishCount } = CountSlice.actions;
export default CountSlice.reducer;
