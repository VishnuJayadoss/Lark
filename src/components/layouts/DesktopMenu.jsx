import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function DesktopMenu({ Menu }) {
  const [isHovering, setIsHovering] = useState(false);

  const hasSubMenu = Menu?.subcategories?.length > 0;
  const isMegaMenu = Menu?.subcategories?.length > 10;
  const navigate = useNavigate();
  const subMenuAnimate = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: { duration: 0.3 },
      display: "block",
    },
    exit: {
      opacity: 0,
      rotateX: -10,
      transition: { duration: 0.3 },
      transitionEnd: { display: "none" },
    },
  };

  const handleSuggestionClick = (slug) => {
    navigate(`/productlist/${slug}`);
  };

  const handleParencatagoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <motion.li
      className="group/link relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span
        className="flex-center font-menu gap-1 hover:bg-theme-secondary/5 cursor-pointer px-3 py-1 rounded-xl"
        onClick={() => handleParencatagoryClick(Menu.id)}
      >
        {Menu.name}
        {hasSubMenu && (
          <ChevronDown className="mt-[0.6px] w-4 h-10 group-hover/link:rotate-180 duration-200" />
        )}
      </span>

      {hasSubMenu && (
        <motion.div
          className={`absolute top-full left-0 mt-2 z-50 bg-white p-4 rounded-md shadow-lg ${
            isMegaMenu ? "w-[600px]" : "w-[200px]"
          }`}
          initial="exit"
          animate={isHovering ? "enter" : "exit"}
          variants={subMenuAnimate}
        >
          <div
            className={`grid gap-4 ${
              isMegaMenu ? "grid-cols-3" : "grid-cols-1"
            }`}
          >
            {Menu.subcategories.map((submenu) => (
              <div
                key={submenu.id}
                onClick={() => handleSuggestionClick(submenu.slug)}
                className="cursor-pointer hover:bg-theme-primary/10 hover:rounded-lg p-2 text-theme-primary/70 hover:text-theme-primary text-sm font-medium"
              >
                {submenu.name}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.li>
  );
}
