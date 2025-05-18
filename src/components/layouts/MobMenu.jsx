import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function MobMenu({
  menus,
  setIsOpen,
  isOpen,
  setClicked,
  clicked,
  toggleDrawer,
}) {
  // const [isOpen, setIsOpen] = useState(false);
  // const [clicked, setClicked] = useState(null);
  const navigate = useNavigate();

  // const toggleDrawer = () => {
  //   setIsOpen(!isOpen);
  //   setClicked(null);
  // };

  const subMenuDrawer = {
    enter: { height: "auto", overflow: "hidden" },
    exit: { height: 0, overflow: "hidden" },
  };

  const handleSuggestionClick = (slug) => {
    navigate(`/productlist/${slug}`);
    setIsOpen(!isOpen);
    setClicked(null);
  };

  return (
    <div>
      <button className="lg:hidden z-[999] relative" onClick={toggleDrawer}>
        {isOpen ? <X /> : <Menu />}
      </button>

      <motion.div
        className="fixed left-0 right-0 top-20 overflow-y-auto h-full bg-[#18181A] backdrop-blur text-theme-secondary p-6 pb-20 z-[999999999999999]"
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
      >
        <ul>
          {menus.map((menuItem, i) => {
            const isClicked = clicked === i;
            const hasSubcategories = menuItem.subcategories?.length > 0;

            return (
              <li key={menuItem.id} className="">
                <span
                  className="flex-center-between p-4 hover:bg-theme-secondary/5 rounded-md cursor-pointer relative"
                  onClick={() => setClicked(isClicked ? null : i)}
                >
                  {menuItem.name}
                  {hasSubcategories && (
                    <ChevronDown
                      className={`ml-auto ${isClicked && "rotate-180"}`}
                    />
                  )}
                </span>

                {hasSubcategories && (
                  <motion.ul
                    initial="exit"
                    animate={isClicked ? "enter" : "exit"}
                    variants={subMenuDrawer}
                    className="ml-5"
                  >
                    {menuItem.subcategories.map((sub) => (
                      <li
                        key={sub.id}
                        onClick={() => handleSuggestionClick(sub.slug)}
                        className="p-2 flex-center hover:bg-theme-secondary/5 rounded-md gap-x-2 cursor-pointer"
                      >
                        {/* You can use an icon if you have one */}
                        {/* <Icon size={17} /> */}
                        {sub.name}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}
