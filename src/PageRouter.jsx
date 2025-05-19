import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

// Pages
import Home from "./components/Pages/Home/Home";
import About from "./components/Pages/About/About";
import Contact from "./components/Pages/Contact/Contact";
import Category from "./components/Pages/category/Category";
import ProductList from "./components/Pages/Products/product-list/productList";
import ProductDetails from "./components/Pages/Products/product-deatils/ProductDetails";
import Wishlist from "./components/Pages/wishlist/Wishlist";
import Cart from "./components/Pages/Cart/Cart";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Faq from "./components/Pages/Policies/Faq";
import TermsandConditions from "./components/Pages/Policies/TermsandConditions";
import PrivacyPolicy from "./components/Pages/Policies/PrivacyPolicy";
import ReturnandRefundPolicy from "./components/Pages/Policies/ReturnandRefundPolicy";
import DeliveryAddress from "./components/Pages/DeliveryAddress/DeliveryAddress";
import Profile from "./components/Pages/Profile/Profile";
import OrderList from "./components/Pages/Profile/OrderList";
import OrderDetails from "./components/Pages/Profile/OrderDetails";
import NotFound from "./components/Pages/NotFound/NotFound";
import Checkout from "./components/Pages/Checkout/Checkout";
import ForgotPassword from "./components/Auth/ForgotPassword";
import OtpValidations from "./components/Auth/OtpValidations";
// import InfiniteScrollExample from "./components/Pages/Category/InfiniteScrollExample";
import ProfileAddress from "./components/Pages/Profile/ProfileAddress";
import Thankyou from "./components/Pages/Thankyou/Thankyou";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.user);
  const cookieToken = Cookies.get("token");

  if (!token && !cookieToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// PublicRoute component
const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.user);
  const cookieToken = Cookies.get("token");

  if (token || cookieToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main Router
const PageRouter = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/contact-us" element={<Contact />} />
      <Route path="/category/:slug" element={<Category />} />
      <Route path="/productlist/:slug" element={<ProductList />} />
      <Route path="/product-details/:slug" element={<ProductDetails />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/terms-and-conditions" element={<TermsandConditions />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route
        path="/returnandrefundpolicy"
        element={<ReturnandRefundPolicy />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Pages */}
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orderlist"
        element={
          <ProtectedRoute>
            <OrderList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-details"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/deliveryaddress"
        element={
          <ProtectedRoute>
            <DeliveryAddress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile-address"
        element={
          <ProtectedRoute>
            <ProfileAddress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/thank-you"
        element={
          <ProtectedRoute>
            <Thankyou />
          </ProtectedRoute>
        }
      />

      {/* Auth Pages */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/otpvalidations"
        element={
          <PublicRoute>
            <OtpValidations />
          </PublicRoute>
        }
      />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PageRouter;
