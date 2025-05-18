import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut, User, Settings, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../Auth/UserSlice.js";
import Cookies from "js-cookie";

export default function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    Cookies.remove("user");
    Cookies.remove("token");
    navigate("/");
  };

  const dropdownVariants = {
    open: {
      opacity: 1,
      y: 0,
      display: "block",
      transition: { duration: 0.2 },
    },
    closed: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
      transitionEnd: { display: "none" },
    },
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="font-headingfont bg-theme-primary z-[999] relative  px-2 py-1 text-theme-secondary capitalize shadow flex items-center gap-1 hover:bg-theme-secondary hover:text-theme-primary hover:border-theme-primary border-2 duration-300 rounded-none">
        {user.name}
        <ChevronDown
          className={`w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={dropdownVariants}
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-[999] border border-gray-200"
          >
            <div className="flex flex-col text-left text-sm text-gray-700 p-2">
              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-theme-primary/10 rounded-md"
              >
                <User size={16} /> Profile
              </button>
              <button
                onClick={() => {
                  navigate("/orderlist");
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-theme-primary/10 rounded-md"
              >
                <FileText size={16} /> Orders
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-100 rounded-md"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
