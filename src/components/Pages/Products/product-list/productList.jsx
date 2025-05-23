import React, { useState, useEffect } from "react";
import { Select, Option } from "@material-tailwind/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NodataImg from "../../../../assets/nodata.png";
import { Filter, ArrowUpDown, ArrowLeft, ArrowRight } from "lucide-react";

import {
  Checkbox,
  Button,
  Radio,
  Card,
  Drawer,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import "./productList.css";
import Slider from "react-slick";
import axios from "../../../../axios.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Cookies from "js-cookie";
import WishlistButton from "../../wishlist/WishlistButton.jsx";
import { ToastContainer, toast } from "react-toastify";
const ProductList = () => {
  // api call
  const [allproductList, setAllproductList] = useState({});
  const [totalProducts, setTotalProducts] = useState(0);
  const [showProductsCount, setShowProductsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();
  const limit = 8;

  // banner image
  const [desktopBanner, setDesktopBanner] = useState([]);
  const [mobileBanner, setMobileBanner] = useState([]);

  // filter
  const [prodPrice, setProdPrice] = useState([]);
  const [prodSize, setprodSize] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [selectedSort, setSelectedSort] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [ParentCategoryName, setParentCategoryName] = useState("");
  const [productrange, setProductRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handlePriceChange = (value) => {
    setSelectedPrice((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((price) => price !== value)
        : [...prevSelected, value]
    );
  };
  const [totalPages, setTotalPages] = useState(1);
  let cookiesUser = "";
  if (Cookies.get("user")) {
    cookiesUser = JSON.parse(Cookies.get("user"));
  }

  const fetchData = async (pageNum = currentPage) => {
    try {
      const params = {
        user_id: cookiesUser.id,
        childcategory: slug,
        page: pageNum,
      };
      if (selectedSize) params.size = selectedSize;
      if (selectedPrice?.length) params.price = selectedPrice.join(",");
      if (selectedSort) params.sort = selectedSort;

      const res = await axios.get(`/v3/product-list`, { params });
      const AllProducts = res.data;
      console.log("AllProducts", AllProducts);

      const products = AllProducts?.products?.data || [];
      const filteredPages = AllProducts?.filtered_total_pages || 1;
      const categoryName = AllProducts?.Category?.data?.[0]?.name;
      const ParentCategoryName = AllProducts?.Category?.data?.[0]?.parent_name;

      // Redirect to page 1 if no products found on the current page but total > 0
      if (products.length === 0 && pageNum > 1) {
        setCurrentPage(1);
        setPage(1);
        fetchData(1); // recall for page 1
        return;
      }
      setDesktopBanner(AllProducts?.Category?.data[0]?.banner);
      setMobileBanner(AllProducts?.Category?.data[0]?.mobile_banner);
      setAllproductList(products);
      setTotalProducts(AllProducts?.total_products);
      setShowProductsCount(AllProducts?.shown_products);
      setTotalPages(filteredPages);
      setProdPrice(AllProducts?.Price);
      setprodSize(AllProducts?.Size);
      setProductRange(AllProducts?.shown_range);
      setCategoryList(AllProducts?.All_category);
      setCategoryName(categoryName);
      setParentCategoryName(ParentCategoryName);
      setCurrentPage(pageNum);
    } catch (error) {
      console.log("prodDetails", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, selectedSize, selectedPrice, selectedSort);
    window.scrollTo({ top: 0 });
  }, [
    page,
    selectedSize,
    selectedPrice,
    selectedSort,
    slug,
    productrange,
    totalPages,
  ]);
  console.log("totalProducts", totalProducts);
  // banner slider
  var Banner = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
  };

  // categoryList slider
  // const categoryList = [
  //   "T-Shirt",
  //   "Combo",
  //   "Hoodie",
  //   "Polo",
  //   "Jacket",
  //   "Jeans",
  // ];
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    draggable: true,
    touchMove: true,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 2000,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };
  // categoryList slider end
  // filter drawer
  const [openFilter, setFilter] = useState(false);
  const openFilterRight = () => setFilter(true);
  const closeFilterRight = () => setFilter(false);
  // console.log("openfilter", openFilter);
  // sort drawer
  const [openSort, setSort] = useState(false);
  const openSortRight = () => setSort(true);
  const closeSortRight = () => setSort(false);
  // mobile view based load design
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [handleData, setHandleData] = useState();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    // categorylist mobile responsive based show items
    setHandleData(isMobile ? 2 : 5);
    window.addEventListener("resize", handleResize);

    // clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // WishList
  // const [wishlist, setWishlist] = useState(false);
  // const addtoWishlist = () => {
  //   setWishlist((data) => !data);
  // };
  const renderProductSkeletons = () =>
    Array.from({ length: 12 }).map((_, index) => (
      <div key={index} className="col-span-6 md:col-span-3 mx-auto">
        <Card className="m-2 p-2 rounded-none mobskeleton">
          <div className="p-3">
            {/* card */}

            <Skeleton className="relative place-items-center grid bg-gray-300 h-36 md:h-56" />

            <div className="mt-2 px-3">
              <Skeleton count={4} />
            </div>
          </div>
        </Card>
      </div>
    ));

  // category click
  const categoryFetch = (slug) => {
    navigate(`/productlist/${slug}`);
  };
  useEffect(() => {
    setSort(false);
  }, [selectedSort]);

  return (
    <>
      <ToastContainer />
      <div className="product-list-page">
        {/* Banner image start */}
        <section className="mx-auto mt-24 md:mt-16">
          <div className="w-full">
            {(isMobile ? mobileBanner : desktopBanner)?.length > 0 && (
              <Slider {...Banner}>
                {(isMobile ? mobileBanner : desktopBanner).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`banner-${index}`}
                    className="w-full h-[350px] object-cover"
                  />
                ))}
              </Slider>
            )}
          </div>
        </section>

        {/* category start */}

        <div className="mx-auto mt-4 md:mt-8 px-4 lg:w-[1300px] container">
          <div className="">
            {categoryList.length > handleData ? (
              <Slider {...settings}>
                {categoryList.map((label, index) => (
                  <div key={index} className="px-1">
                    <Button
                      className="bg-theme-secondary hover:bg-theme-primary border-2 border-theme-primary/20 rounded-none w-full text-theme-primary hover:text-theme-secondary whitespace-nowrap duration-300"
                      onClick={() => categoryFetch(label.slug)}
                    >
                      <span className="block truncate">{label.name}</span>
                    </Button>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categoryList.map((label, index) => (
                  <div key={index} className="px-1">
                    <Button
                      className="bg-theme-secondary hover:bg-theme-primary border-2 border-theme-primary/20 rounded-none w-full text-theme-primary/70 hover:text-theme-secondary whitespace-nowrap duration-300"
                      onClick={() => categoryFetch(label.slug)}
                    >
                      <span className="block truncate">{label.name}</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* category end */}
        {/* Banner image End */}
        <section className="mx-auto mt-4 md:mt-8">
          <div className="w-full">
            <div className="grid grid-cols-12">
              {/* filter section start */}

              <div className="hidden md:block top-[10%] sticky md:col-span-3 bg-theme-secondary shadow-lg shadow-theme-primary/20 mx-3 mb-3 border-2 border-theme-primary/10 h-screen overflow-y-scroll thin-scrollbar scrollbar-thin">
                <div className="p-4 rounded-xl">
                  {/* <h3 className="mx-2 mb-2 font-themefont text-theme-primary text-xl">
                    Categories
                  </h3>
                  <hr />
                  <div className="flex flex-col mt-2">
                    <Checkbox
                      id="1"
                      label="Option 1"
                      className="bg-theme-secondary checked:bg-theme-primary checked:border-gold border-theme-primary/30 w-4 h-4 text-gold"
                      ripple={true}
                    />
                    <Checkbox
                      id="2"
                      label="Option 2"
                      className="bg-theme-secondary checked:bg-theme-primary checked:border-gold border-theme-primary/30 w-4 h-4 text-gold"
                      ripple={true}
                    />
                    <Checkbox
                      id="3"
                      label="Option 3"
                      className="bg-theme-secondary checked:bg-theme-primary checked:border-gold border-theme-primary/30 w-4 h-4 text-gold"
                      ripple={true}
                    />
                    <Checkbox
                      id="4"
                      label="Option 4"
                      className="bg-theme-secondary checked:bg-theme-primary checked:border-gold border-theme-primary/30 w-4 h-4 text-gold"
                      ripple={true}
                    />
                  </div> */}
                  {prodSize.length !== 0 ? (
                    <>
                      <h3 className="mx-2 mt-5 mb-2 font-themefont font-normal text-theme-primary text-xl">
                        Size
                      </h3>
                      <hr />

                      <div className="flex flex-row flex-wrap gap-2 mt-4 ml-2">
                        {prodSize.map((size, index) => (
                          <Button
                            key={index}
                            onClick={
                              () =>
                                setSelectedSize(
                                  selectedSize === size ? null : size
                                ) // Toggle selection
                            }
                            className={`border bg-transparent w-[50px] mt-1 px-1 py-2 border-theme-primary/20 text-custom-headingclr rounded-sm
                        ${
                          selectedSize === size
                            ? "bg-theme-primary text-theme-secondary"
                            : ""
                        }
                      `}
                          >
                            {size}
                          </Button>
                        ))}
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  {prodPrice.length !== 0 ? (
                    <>
                      <h3 className="mx-2 mt-8 mb-2 font-themefont font-normal text-theme-primary text-xl">
                        Price
                      </h3>
                      <hr />

                      <div className="flex flex-col mt-2">
                        {prodPrice.map((checkbox, index) => (
                          <label
                            key={index}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Checkbox
                              label={checkbox.label}
                              value={checkbox.values}
                              checked={selectedPrice.includes(checkbox.values)}
                              onChange={() =>
                                handlePriceChange(checkbox.values)
                              }
                              className="py-0.5 text-sm"
                              ripple={false}
                              containerProps={{
                                className: "p-1 m-0 flex items-center gap-2",
                              }}
                              iconProps={{
                                className: "w-4 h-4",
                              }}
                              labelProps={{
                                className: "text-sm",
                              }}
                            />
                            <span className="text-custom-headingclr text-sm">
                              {checkbox.values}
                            </span>
                          </label>
                        ))}
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* filter section end */}
              {/* product list section start */}
              <div className="col-span-12 md:col-span-9 mx-2">
                {/* breadcrumb start */}

                <div className="flex justify-between items-center md:mx-3">
                  <div className="hidden md:block px-1 md:px-0">
                    <nav aria-label="breadcrumb" className="w-max">
                      <ol className="flex flex-wrap items-center bg-slate-50 px-1 py-2 rounded-md w-full">
                        <li className="flex items-center font-thin text-custom-headingclr/50 hover:text-theme-primary text-sm transition-colors duration-300 cursor-pointer">
                          <a href="#" className="font-themefont">
                            {ParentCategoryName}
                          </a>
                          <span className="mx-2 text-slate-800 pointer-events-none">
                            /
                          </span>
                        </li>
                        <li className="flex items-center font-themefont font-thin text-theme-primary/60 hover:text-theme-primary text-sm transition-colors duration-300 cursor-pointer">
                          <a href="#" className="">
                            {" "}
                            {categoryName}
                          </a>
                        </li>
                      </ol>
                    </nav>
                  </div>

                  <div className="hidden md:block w-72">
                    <Select
                      label="Select Sorting Options"
                      className="font-themefont"
                      onChange={(value) => setSelectedSort(value)}
                      value={selectedSort}
                    >
                      <Option value="a_z" className="font-themefont">
                        A to Z
                      </Option>
                      <Option
                        value="price_high_to_low"
                        className="font-themefont"
                      >
                        Price-High to Low
                      </Option>
                      <Option
                        value="price_low_to_high"
                        className="font-themefont"
                      >
                        Price-Low to High
                      </Option>
                      <Option value="new_arrival" className="font-themefont">
                        Newest
                      </Option>
                      <Option value="popularity" className="font-themefont">
                        Popularity
                      </Option>
                    </Select>
                  </div>
                </div>

                {/* breadcrumb end */}

                {/* product card start  */}

                <div className="mt-4">
                  {showProductsCount === 0 && !loading ? (
                    <div className="flex flex-col justify-center items-center col-span-12 py-10 w-full">
                      <img
                        src={NodataImg}
                        alt="No data"
                        className="my-3 w-40 sm:w-60 md:w-1/3 max-w-xs"
                      />
                      <p className="text-gray-500 text-center">
                        No products found.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-12 mx-auto">
                      {loading
                        ? renderProductSkeletons()
                        : Object.values(allproductList).map(
                            (product, index) => (
                              <div
                                key={index}
                                className="relative col-span-6 md:col-span-3 mx-auto cursor-pointer"
                              >
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                  }}
                                  className="top-5 right-5 z-10 absolute bg-theme-secondary/40 md:hover:bg-theme-secondary p-1.5 rounded-full"
                                >
                                  <WishlistButton
                                    productId={product.id}
                                    wishlistStatus={product.is_in_wishlist}
                                    fetchData={fetchData}
                                  />
                                </div>

                                <Link to={`/product-details/${product.slug}`}>
                                  <div className="p-3">
                                    <div className="relative">
                                      <div className="relative">
                                        <img
                                          src={product.thumbnail_image}
                                          className="hover:scale-110 transition-transform duration-300 transform"
                                          alt="Imagem de perfil"
                                        />
                                        <img
                                          src={product.thumbnail_image_second}
                                          className="top-0 left-0 absolute opacity-0 hover:opacity-100 transition-opacity duration-300 transform"
                                          alt="Nova imagem"
                                        />
                                      </div>
                                      <div className="mt-2 px-3">
                                        <p className="font-headingfont font-semibold text-custom-headingclr text-sm">
                                          {product.name}
                                        </p>
                                        <hr className="my-1" />
                                        <p className="font-primaryfont font-medium text-custom-headingclr/50 text-sm">
                                          {product.tags}
                                        </p>

                                        <div className="mt-2">
                                          <p className="font-headingfont font-semibold text-custom-headingclr text-md">
                                            {product.main_price}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            )
                          )}
                    </div>
                  )}
                </div>
                {/* productcard End  */}

                {/* pagination start */}
                {showProductsCount !== 0 && (
                  <div className="flex justify-between items-center bg-white my-10 px-4 sm:px-3 py-3 border-gray-200 border-t">
                    {/* Mobile Pagination */}
                    <div className="sm:hidden flex flex-1 justify-between">
                      <Button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="flex justify-center items-center gap-1 px-6 py-3 rounded-none duration-300 focus:scroll-m-0"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                      </Button>
                      <Button
                        onClick={() =>
                          setPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={page >= totalPages}
                        className="flex justify-center items-center gap-1 px-10 py-3 rounded-none"
                      >
                        Next
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Desktop Pagination */}
                    <div className="hidden sm:flex sm:flex-1 sm:justify-between sm:items-center">
                      <div>
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium">{productrange}</span>{" "}
                          Total{" "}
                          <span className="font-medium">
                            {showProductsCount}
                          </span>
                        </p>
                      </div>
                      <div>
                        <nav className="pagination">
                          <Button
                            className="rounded-none text-theme-primary"
                            onClick={() =>
                              setPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={page === 1}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>

                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((pageNumber) => (
                            <Button
                              key={pageNumber}
                              onClick={() => setPage(pageNumber)}
                              className={`${
                                page === pageNumber ? "active" : ""
                              } rounded-none`}
                            >
                              {pageNumber}
                            </Button>
                          ))}

                          <Button
                            className="rounded-none text-theme-primary"
                            onClick={() =>
                              setPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={page === totalPages}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}

                {/* pagination End */}
              </div>
              {/* product list section end */}
            </div>
          </div>
        </section>
        <section className="md:hidden block bottom-14 z-[99999] fixed mx-auto container">
          <div className="grid grid-cols-12">
            {openFilter ? (
              <>
                <div
                  onClick={closeFilterRight}
                  className="col-span-6 bg-theme-primary p-3 border-r-2"
                >
                  <p className="flex justify-center items-center gap-1 text-md">
                    <span> close</span>
                  </p>
                </div>
                <div
                  onClick={closeFilterRight}
                  className="col-span-6 bg-theme-primary p-3"
                >
                  {" "}
                  <p className="flex justify-center items-center gap-1 text-md">
                    <span>Apply</span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div
                  onClick={openFilterRight}
                  className="col-span-6 bg-theme-primary p-3 border-r-2"
                >
                  <p className="flex justify-center items-center gap-1 text-md">
                    <Filter />
                    <span> filter</span>
                  </p>
                </div>

                <div
                  onClick={openSortRight}
                  className="col-span-6 bg-theme-primary p-3"
                >
                  {" "}
                  <p className="flex justify-center items-center gap-1 text-md">
                    <ArrowUpDown />
                    <span>Sort</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
        {/* mobile filter section */}
        <Drawer
          placement="left"
          open={openFilter}
          // onClose={closeFilterRight}
          className="bg-theme-primary p-4 h-screen overflow-y-scroll"
          size={isMobile ? 500 : 600}
        >
          <div className="flex justify-between items-center mb-4">
            <Typography
              variant="h5"
              color="blue-gray"
              className="font-primaryfont font-thin text-theme-secondary text-lg tracking-wider"
            >
              <p className="flex justify-center items-center gap-1 text-md">
                <Filter />
                <span> Filter</span>
              </p>
            </Typography>
            <Button
              className="bg-none text-theme-secondary"
              onClick={() => {
                setSelectedSize(null);
                setSelectedPrice([]);
                // Add reset for category if needed
              }}
            >
              Clear All
            </Button>
          </div>

          {/* <Typography color="gray" className="mb-8 pr-4 font-normal">
            size table
          </Typography> */}

          <div className="relative bg-theme-secondary mb-[100px]">
            {/* filter section start */}

            <div className="md:col-span-3 mx-3">
              <div className="bg-white shadow-md p-4 border rounded-xl">
                {/* Categories */}
                {/* <h3 className="mb-3 font-themefont text-theme-primary text-2xl">
                  Categories
                </h3>
                <div className="flex flex-col gap-3 mb-6">
                  {categoryList.map((label, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-3 text-gray-800 hover:text-theme-primary transition cursor-pointer"
                    >
                      <Checkbox
                        id={`cat-${index}`}
                        className="bg-theme-secondary checked:bg-theme-primary checked:border-gold border-theme-primary/30 w-4 h-4 text-gold"
                        ripple={true}
                        onChange={() => categoryFetch(label.slug)} // optional: if you want to trigger fetch on checkbox change
                      />
                      {label.name}
                    </label>
                  ))}
                </div> */}

                {/* Size */}
                <h3 className="mb-3 font-themefont text-theme-primary text-2xl">
                  Size
                </h3>
                <div className="flex flex-wrap gap-6 mx-auto mb-6">
                  {prodSize.map((size) => (
                    <Button
                      key={size}
                      onClick={() =>
                        setSelectedSize(selectedSize === size ? null : size)
                      }
                      className={`w-[50px] h-[40px] flex items-center justify-center text-center
              border border-custom-headingclr bg-white text-custom-headingclr
              rounded-md transition
              hover:bg-theme-primary hover:text-white
              focus:bg-theme-primary focus:text-white
              ${selectedSize === size ? "bg-theme-primary text-white" : ""}
            `}
                    >
                      {size}
                    </Button>
                  ))}
                </div>

                {/* Price */}
                <h3 className="mb-3 font-themefont text-theme-primary text-2xl">
                  Price
                </h3>
                <div className="flex flex-col gap-3">
                  {prodPrice.map((checkbox, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-3 text-gray-800 hover:text-theme-primary transition cursor-pointer"
                      htmlFor={`price-${index}`}
                    >
                      <Checkbox
                        id={`price-${index}`}
                        className="bg-theme-secondary checked:bg-theme-primary checked:border-gold border-theme-primary/30 w-4 h-4 text-gold"
                        ripple={true}
                        checked={selectedPrice.includes(checkbox.values)}
                        onChange={() => {
                          console.log(checkbox.label); // ✅ Logs the label when checkbox is clicked
                          handlePriceChange(checkbox.values);
                        }}
                      />

                      <span className="text-custom-headingclr text-sm">
                        {checkbox.values}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* filter section end */}
          </div>
        </Drawer>
        {/*End mobile filter section */}
        {/* mobile sort bottom  drawer */}
        <Drawer
          placement="bottom"
          open={openSort}
          onClose={closeSortRight}
          className="z-[999999] p-4 h-screen overflow-y-scroll"
          size={isMobile ? 500 : 600}
        >
          <div className="flex justify-between items-center mb-4">
            <Typography
              variant="h5"
              color="blue-gray"
              className="font-primaryfont font-thin text-theme-primary text-lg tracking-wider"
            >
              <p className="flex justify-center items-center gap-1 text-md">
                <ArrowUpDown />
                <span>Sort</span>
              </p>
            </Typography>
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={closeSortRight}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          <div className="relative">
            <div className="flex flex-col gap-1">
              <label className="flex justify-between items-center text-blue-gray-700 cursor-pointer">
                A to Z
                <Radio
                  name="type"
                  color="blue-gray"
                  ripple={true}
                  value="a_z"
                  checked={selectedSort === "a_z"}
                  onChange={() => setSelectedSort("a_z")}
                />
              </label>
              <hr />
              <label className="flex justify-between items-center text-blue-gray-700 cursor-pointer">
                Price High to Low
                <Radio
                  name="type"
                  color="blue-gray"
                  ripple={true}
                  value="price_high_to_low"
                  checked={selectedSort === "price_high_to_low"}
                  onChange={() => setSelectedSort("price_high_to_low")}
                />
              </label>
              <hr />
              <label className="flex justify-between items-center text-blue-gray-700 cursor-pointer">
                Price Low to High
                <Radio
                  name="type"
                  color="blue-gray"
                  ripple={true}
                  value="price_low_to_high"
                  checked={selectedSort === "price_low_to_high"}
                  onChange={() => setSelectedSort("price_low_to_high")}
                />
              </label>
              <hr />
              <label className="flex justify-between items-center text-blue-gray-700 cursor-pointer">
                Newest
                <Radio
                  name="type"
                  color="blue-gray"
                  ripple={true}
                  value="new_arrival"
                  checked={selectedSort === "new_arrival"}
                  onChange={() => setSelectedSort("new_arrival")}
                />
              </label>
              <hr />
              <label className="flex justify-between items-center text-blue-gray-700 cursor-pointer">
                Popularity
                <Radio
                  name="type"
                  color="blue-gray"
                  ripple={true}
                  value="popularity"
                  checked={selectedSort === "popularity"}
                  onChange={() => setSelectedSort("popularity")}
                />
              </label>
            </div>
          </div>
        </Drawer>
        {/*end mobile sort bottom  drawer */}
      </div>
    </>
  );
};
export default ProductList;
