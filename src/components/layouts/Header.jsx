import React, { useState, useEffect } from "react";
import DesktopMenu from "./DesktopMenu";
import MobMenu from "./MobMenu";
import { Heart, ShoppingCart, Search } from "lucide-react";
// import { Menus } from "../../utils.js";
import "./Header.css";
import logo from "../../assets/lark.svg";
import CategoryHeader from "./CategoryHeader.jsx";
import { Button } from "@material-tailwind/react";
import axios from "../../axios.js";

import { useDispatch } from "react-redux";
import { clearUser } from "../../components/Auth/UserSlice.js";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import Count from "./Count.jsx";
import { useSelector } from "react-redux";
import ProfileDropdown from "./ProfileDropdown.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

const Header = () => {
  const cartCount = useSelector((state) => state.WishlistCount.cartCount);
  const wishCount = useSelector((state) => state.WishlistCount.wishCount);
  const userCookie = Cookies.get("user");
  const cookiesUser = userCookie ? JSON.parse(userCookie) : null;
  const cookiesToken = Cookies.get("token") || null;
  const navigate = useNavigate();
  // get user data
  const { user, token } = useSelector((state) => state.user);

  const [menus, setMenus] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  // api call

  useEffect(() => {
    fetchMenu();
  }, []);

  const [parentCategory, setParentCategory] = useState([]);
  const fetchMenu = async () => {
    try {
      const res = await axios.get("/v3/menu");
      const datas = res.data.menu;
      const getParent = res.data?.menu.map((item) => ({
        name: item.name,
        slug: item.id,
      }));
      // console.log("res.data.menures.data.menures.data.menu", getParent);
      setMenus(datas);
      setParentCategory(getParent);
      // console.log("data", datas);
    } catch (error) {
      console.log("errors", error);
    }
  };

  // logout
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(clearUser());
    Cookies.remove("user");
    Cookies.remove("token");
  };

  const [isOpen, setIsOpen] = useState(false);
  const [clicked, setClicked] = useState(null);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setClicked(null);
  };
  return (
    <>
      {/* when navigate scroll top */}
      <ScrollToTop />
      {/* when navigate scroll top */}
      <div onClick={closeModal}>
        <header
          onClick={stopPropagation}
          className="h-16 text-[15px] z-20 fixed inset-0 flex-center bg-theme-secondary text-theme-primary"
        >
          <nav className="px-3.5 sm:mx-20 flex-center-between w-full max-w-7xl mx-auto">
            <div className="flex-center gap-x-3 z-[999] relative">
              <Link to={"/"}>
                <img src={logo} alt="Logo" className="md:size-3/4 size-40" />
              </Link>
            </div>

            <ul className="gap-x-1 font-headingfont text-theme-primary lg:flex-center hidden">
              {menus.map((menus, index) => (
                <DesktopMenu Menu={menus} key={index} />
              ))}
            </ul>

            <div className="flex-center gap-x-5 lg:pl-5">
              {/* <button
                className="hidden md:block cursor-pointer text-theme-primary size-4.5"
                onClick={toggleModal}
                aria-label="Search"
              >
                <Search />
              </button> */}

              <div className="hidden md:block">
                <SearchBar />
              </div>
              <Link to="/wishlist">
                <div className="hidden md:block ">
                  <div className="relative inline-flex">
                    <div className="cursor-pointer text-theme-primary mt-[3px] size-4.5">
                      <Heart />
                    </div>
                    <span className="absolute top-0.5 right-0.5 grid min-h-[20px] min-w-[20px] translate-x-2/3 -translate-y-[10px] place-items-center rounded-full bg-red-600  text-xs text-white">
                      {wishCount}
                    </span>
                  </div>
                </div>
              </Link>

              <Link to="/cart">
                <div className="hidden md:block ">
                  <div className="relative inline-flex">
                    <div className="cursor-pointer text-theme-primary mt-[3px] size-4.5">
                      <ShoppingCart />
                    </div>
                    <span className="absolute top-0.5 right-0.5 grid min-h-[20px] min-w-[20px] translate-x-2/3 -translate-y-[10px] place-items-center rounded-full bg-red-600  text-xs text-white">
                      {cartCount}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="hidden md:block lg:border-l lg:border-theme-primary lg:pl-5">
                {user ? (
                  <ProfileDropdown user={user} />
                ) : (
                  <Button
                    onClick={() => {
                      navigate("/login");
                    }}
                    aria-label="Sign In"
                    className="font-headingfont bg-theme-primary z-[999] relative px-3 py-2 capitalize shadow flex-center hover:bg-theme-secondary hover:text-theme-primary hover:border-theme-primary border-2 duration-300 rounded-none"
                  >
                    Sign In
                  </Button>
                )}
              </div>

              <div className="lg:hidden font-primaryfont">
                {/* {menus.map((menus, index) => ( */}
                <MobMenu
                  menus={menus}
                  setIsOpen={setIsOpen}
                  isOpen={isOpen}
                  setClicked={setClicked}
                  clicked={clicked}
                  toggleDrawer={toggleDrawer}
                />
                {/* ))} */}
              </div>
            </div>
          </nav>
        </header>

        {isModalVisible && (
          <div className="fixed  bg-gray-400/50 min-h-screen w-screen z-10 flex justify-center items-center top-10px left-0">
            <div
              className="bg-theme-secondary p-4 rounded-md"
              onClick={stopPropagation}
              role="dialog"
              aria-labelledby="modal-title"
              aria-modal="true"
            >
              <form className="max-w-md mx-auto">
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-theme-secondary"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-theme-secondary dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search Mockups, Logos..."
                    required
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <CategoryHeader
        parentCategory={parentCategory}
        setIsOpen={setIsOpen}
      />
      <Count />
    </>
  );
};

export default Header;
