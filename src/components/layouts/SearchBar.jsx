import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "../../axios.js";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch suggestions
  useEffect(() => {
    getSearchSuggestions();
  }, [searchValue]);

  const getSearchSuggestions = async () => {
    try {
      const res = await axios.get(
        `/v2/get-search-suggestions?query_key=${searchValue}`
      );
      const queries = res.data?.products || [];
      setSuggestions(queries);
    } catch (error) {
      console.log("Error fetching suggestions", error);
    }
  };

  const filteredSuggestions = suggestions.filter((item) =>
    item.query.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
        setSearchValue("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (slug) => {
    navigate(`/product-details/${slug}`);
    setIsExpanded(false);
    setSearchValue("");
  };

  return (
    <div className="relative flex items-center" ref={containerRef}>
      <button
        id="search-icon"
        onClick={() => {
          setIsExpanded((prev) => !prev);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="cursor-pointer text-theme-primary -mt-1 size-4.5"
      >
        <Search />
      </button>

      {/* Input Wrapper */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "w-64 ml-2" : "w-0"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none"
          placeholder="Search for products..."
        />
      </div>

      {/* Suggestions Dropdown */}
      {isExpanded && searchValue && (
        <ul className="absolute top-full mt-2 left-10 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(item.slug)}
                className="px-4 py-2 text-xs cursor-pointer hover:bg-gray-100"
              >
                {item.query}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-xs text-gray-500 cursor-default">
              No products found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
