import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  token: null,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // console.log("action.payload", action.payload);

      state.user = action.payload.user;
      state.token = action.payload.access_token;
      // console.log("state.user", state.user);
      // console.log("state.token", state.token);
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
    },
    getPhone: (state, action) => {
      state.email = action.payload.email;
    },
  },
});

export const { setUser, clearUser, getPhone } = UserSlice.actions;
export default UserSlice.reducer;
