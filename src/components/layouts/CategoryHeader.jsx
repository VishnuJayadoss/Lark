import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CategoryHeader = ({ parentCategory, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathmatch = location.pathname;

  // console.log("pathmatchpathmatch", pathmatch);

  const handleSuggestionClick = (slug) => {
    navigate(`/category/${slug}`);
    setIsOpen(false);
  };
  return (
    <>
      {/* mobile catagory */}
      <div className="md:hidden fixed top-14 z-[30] py-2 w-full bg-theme-primary">
        <div className="container w-full font-thin font-themefont">
          <div className="grid grid-cols-4">
            {parentCategory.map((category, index) => (
              <div
                key={index}
                className="flex justify-center border-x border-theme-secondary"
              >
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(category.slug)}
                  className={`px-4 font-black focus:bg-theme-secondary focus:text-theme-primary duration-300 ${
                    pathmatch === `/category/${category.slug}`
                      ? "bg-theme-secondary text-theme-primary"
                      : ""
                  }`}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryHeader;
