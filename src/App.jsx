import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import PageRouter from "./PageRouter";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "./components/Auth/UserSlice";
const App = () => {
  //check cookies
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");
    // console.log("token", token);

    const user = Cookies.get("user");

    if (token && user) {
      dispatch(setUser({ token: token, user: JSON.parse(user) }));
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Header />
        <PageRouter />
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
