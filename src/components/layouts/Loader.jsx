import React, { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import logo from "../../assets/lark.svg";
const Loader = () => {
  useEffect(() => {
    const letters = document.querySelectorAll(".letter");
    const container = document.querySelector(".loader-container");

    // Create a GSAP timeline
    const timeline = gsap.timeline();

    // Writing animation
    timeline.fromTo(
      letters,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,

        duration: 1,
        delay: 0.5,
        ease: "power3.out",
        stagger: 0.1, // Delay between each letter
      }
    );

    // gsap.to(".logo", {
    //   opacity: 0,
    //   duration: 0.5,
    //   delay: 1.4,
    //   ease: "power3.out",
    // });
    // timeline.to(letters, {
    //   opacity: 0,
    //   duration: 1.5,
    //   y: -10,
    // });

    // Move-up animation for the entire container
    timeline.to(
      container,
      {
        y: "-100%",
        duration: 0.8,
        ease: "power3.inOut",
        overflow: "hidden",
        delay: 0,
      },
      "+=1" // Add a slight delay after the last letter animates
    );
  }, []);

  return (
    <>
      <div className="z-50 fixed inset-0 flex justify-center items-center bg-theme-secondary loader-container">
        <div className="flex flex-col justify-center items-center mx-[30px] px-[20px] md:px-[450px] py-[250px] md:py-[250px] border-4 border-theme-primary">
          <img src={logo} alt="" className="w-[70%] md:w-[100%] logo" />

          <p className= "pl-10 font-themefont text-[13px] text-theme-primary md:text-[20px] text-center">
            {/* {Array.from(`" Wear rathan, feed hope "`).map((char, index) => (
            <span key={index} className="inline-block letter">
              {char}
            </span>
          ))} */}
            <span className="inline-block opacity-0 letter">
              "Wear rathan, feed hope."
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Loader;
