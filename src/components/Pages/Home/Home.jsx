import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Loader from "../../layouts/Loader";
import mobilebanner1 from "../../../assets/home/mobile1.webp";
import mobilebanner2 from "../../../assets/home/mobile2.webp";
import { useNavigate } from "react-router-dom";
// axios
import axios from "../../../axios.js";
// GSAP animations
import { useGSAP } from "@gsap/react";
// Sliders
import { Carousel } from "@material-tailwind/react";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const navigate = useNavigate();
  // response based image load

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // animation effects

  const wrapperRef = useRef(null);

  useGSAP(() => {
    const wrapper = wrapperRef.current;
    const items = wrapper.querySelectorAll(".item");

    //  initial state
    items.forEach((item, index) => {
      if (index !== 0) {
        gsap.set(item, { yPercent: 100 });
      }
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        pin: true,
        start: "top top",
        end: () => `+=${items.length * 100}%`,
        scrub: 1,
      },
      defaults: { ease: "none" },
    });

    items.forEach((item, index) => {
      timeline.to(item, { scale: 0.7, borderRadius: "50px" });
      if (index < items.length - 1) {
        timeline.to(items[index + 1], { yPercent: 0 }, "<");
      }
    });
  }, []);

  const [mensBanner, setMensBanner] = useState([]);
  const [womensBanner, setWomensBanner] = useState([]);
  const [kidsBanner, setKidsBanner] = useState([]);
  const [comboBanner, setComboBanner] = useState([]);
  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const res = await axios.get("/V4/homepage");
      const getData = res.data?.HomepageBanner?.data ?? [];
      console.log("res.data", res.data);

      setMensBanner(getData.Men);
      setWomensBanner(getData.Women);
      // console.log("homepage data", getData.Men);
    } catch (error) {
      console.log("error", error);
    }
  };

  const NavigateCategory = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <>
      <Loader />

      <div ref={wrapperRef} className="relative h-screen overflow-hidden">
        <div className="item absolute inset-0 flex items-center justify-center">
          <Carousel
            transition={{ duration: 0 }}
            autoplay
            loop
            className="rounded-xl"
          >
            {mensBanner.map((banner, index) => (
              <img
                key={index}
                src={isMobile ? mobilebanner1 : banner.banner}
                alt={banner.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => NavigateCategory(banner.category_id)}
              />
            ))}
          </Carousel>
        </div>

        <div className="item absolute inset-0 flex items-center justify-center">
          <Carousel
            transition={{ duration: 0 }}
            autoplay
            loop
            className="rounded-xl"
          >
            {womensBanner.map((banner, index) => (
              <img
                key={index}
                src={isMobile ? mobilebanner2 : banner.banner}
                alt={banner.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => NavigateCategory(banner.category_id)}
              />
            ))}
          </Carousel>
        </div>

        {/* <div className="item absolute inset-0 flex items-center justify-center">
          <Carousel
            transition={{ duration: 0 }}
            autoplay
            loop
            className="rounded-xl"
          >
            {kidsBanner.map((banner, index) => (
              <img
                key={index}
                src={banner.banner}
                alt={banner.name}
                className="w-full h-full object-cover"
              />
            ))}
          </Carousel>
        </div> */}

        {/* <div className="item absolute inset-0 flex items-center justify-center">
          <Carousel
            transition={{ duration: 0 }}
            autoplay
            loop
            className="rounded-xl"
          >
            {comboBanner.map((banner, index) => (
              <img
                key={index}
                src={banner.banner}
                alt={banner.name}
                className="w-full h-full object-cover"
              />
            ))}
          </Carousel>
        </div> */}
      </div>
    </>
  );
};

export default Home;
