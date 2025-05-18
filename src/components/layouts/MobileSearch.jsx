import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  IconButton,
  Typography,
  Input,
} from "@material-tailwind/react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../../axios.js";

const MobileSearch = ({ openRight, closeDrawerRight }) => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getSearchSuggestions = async () => {
      if (!searchValue.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(
          `/v2/get-search-suggestions?query_key=${searchValue}`
        );
        const allSuggestions = res.data?.products || [];

        // Filter based on full search value
        const filtered = allSuggestions.filter((item) =>
          item.query.toLowerCase().includes(searchValue.toLowerCase())
        );

        setSuggestions(filtered);
      } catch (error) {
        console.log("Error fetching suggestions", error);
      }
    };

    const debounce = setTimeout(() => {
      getSearchSuggestions();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchValue]);

  const handleSuggestionClick = (slug) => {
    navigate(`/product-details/${slug}`);
    closeDrawerRight();
    setSearchValue("");
  };

  const highlightText = (text) => {
    const regex = new RegExp(searchValue, "gi");
    return text.replace(
      regex,
      (match) => `<span class="bg-yellow-100">${match}</span>`
    );
  };

  return (
    <Drawer
      placement="right"
      open={openRight}
      size={isMobile ? 500 : 600}
      className="p-4 h-screen overflow-y-auto z-[999999999] bg-white"
    >
      {/* Header */}
      <div className="flex items-center font-themefont justify-between mb-4">
        <Typography variant="h5" color="blue-gray">
          Search Products
        </Typography>
        <IconButton
          variant="text"
          onClick={() => {
            closeDrawerRight();
            setSearchValue("");
          }}
        >
          <X className="w-5 h-5" />
        </IconButton>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <Input
          inputRef={inputRef}
          autoFocus
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search for products..."
          className="pl-10 pr-10 border border-gray-300 focus:border-blue-500 rounded-md py-2"
        />
        {searchValue && (
          <IconButton
            variant="text"
            className="!absolute right-2 top-0"
            onClick={() => setSearchValue("")}
          >
            <X className="w-4 h-4 text-gray-400" />
          </IconButton>
        )}
      </div>

      {/* Suggestions */}
      <div className="mt-4">
        {searchValue ? (
          suggestions.length > 0 ? (
            <ul className="rounded-md border border-gray-200 divide-y max-h-[60vh] overflow-y-auto">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-3 text-sm cursor-pointer text-theme-primary/80 hover:bg-gray-50"
                  onClick={() => handleSuggestionClick(item.slug)}
                  dangerouslySetInnerHTML={{
                    __html: highlightText(item.query),
                  }}
                />
              ))}
            </ul>
          ) : (
            <div className="text-center text-sm text-theme-primary/80 py-6">
              No products found.
            </div>
          )
        ) : (
          <div className="text-center text-sm text-gray-400 py-6">
            Start typing to see suggestions.
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default MobileSearch;
