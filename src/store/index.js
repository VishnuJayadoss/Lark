import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../components/Auth/UserSlice";
import CountReduser from "../components/layouts/CountSlice";
const store = configureStore({
  reducer: {
    user: UserReducer,
    WishlistCount: CountReduser,
  },
});

export default store;
