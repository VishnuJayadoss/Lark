import React, { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

import Iconblack from "../../../assets/iconblack.svg";
import MobileBanner from "../../../assets/productlist/mobilebanner.webp";
function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

const Faq = () => {
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
      {/* content start */}
      <div className="container mx-auto md:mt-24 mb-10 mt-28 ">
        <div className="flex items-center justify-center mb-4 ">
          <h3 className="text-3xl text-theme-primary font-themefont">FAQ</h3>
        </div>
        <hr className="lg:mb-8" />
        <div className="grid grid-cols-12">
          <div className="md:col-span-4 col-span-12 px-3 flex items-center justify-center">
            <img
              src={Iconblack}
              alt="Iconblack"
              className="md:w-full md:h-auto size-1/2"
            />
          </div>
          <div className="md:col-span-8 col-span-12 px-4">
            <div className="border border-gray-300 shadow-xl shadow-gray p-8">
              <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
                <AccordionHeader
                  className="md:text-[17px] text-[14px] text-theme-primary font-themefont hover:text-gray-500"
                  onClick={() => handleOpen(1)}
                >
                  What is Material Tailwind?
                </AccordionHeader>
                <AccordionBody className="md:text-[13px] text-[12px] text-theme-primary/60 tracking-wider font-themefont text-justify">
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams.
                </AccordionBody>
              </Accordion>
              <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
                <AccordionHeader
                  className="md:text-[17px] text-[14px] text-theme-primary font-themefont hover:text-gray-500"
                  onClick={() => handleOpen(2)}
                >
                  How to use Material Tailwind?
                </AccordionHeader>
                <AccordionBody className="md:text-[13px] text-[12px] text-theme-primary/60 tracking-wider font-themefont text-justify">
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams.
                </AccordionBody>
              </Accordion>
              <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
                <AccordionHeader
                  className="md:text-[17px] text-[14px] text-theme-primary font-themefont hover:text-gray-500"
                  onClick={() => handleOpen(3)}
                >
                  What can I do with Material Tailwind?
                </AccordionHeader>
                <AccordionBody className="md:text-[13px] text-[12px] text-theme-primary/60 tracking-wider font-themefont text-justify">
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams.
                </AccordionBody>
              </Accordion>
              <Accordion open={open === 4} icon={<Icon id={4} open={open} />}>
                <AccordionHeader
                  className="md:text-[17px] text-[14px] text-theme-primary font-themefont hover:text-gray-500"
                  onClick={() => handleOpen(4)}
                >
                  What can I do with Material Tailwind?
                </AccordionHeader>
                <AccordionBody className="md:text-[13px] text-[12px] text-theme-primary/60 tracking-wider font-themefont text-justify">
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams.
                </AccordionBody>
              </Accordion>

              <Accordion open={open === 5} icon={<Icon id={5} open={open} />}>
                <AccordionHeader
                  className="md:text-[17px] text-[14px] text-theme-primary font-themefont hover:text-gray-500"
                  onClick={() => handleOpen(5)}
                >
                  What can I do with Material Tailwind?
                </AccordionHeader>
                <AccordionBody className="md:text-[13px] text-[12px] text-theme-primary/60 tracking-wider font-themefont text-justify">
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams.
                </AccordionBody>
              </Accordion>

              <Accordion open={open === 6} icon={<Icon id={6} open={open} />}>
                <AccordionHeader
                  className="md:text-[17px] text-[14px] text-theme-primary font-themefont hover:text-gray-500"
                  onClick={() => handleOpen(6)}
                >
                  What can I do with Material Tailwind?
                </AccordionHeader>
                <AccordionBody className="md:text-[13px] text-[12px] text-theme-primary/60 tracking-wider font-themefont text-justify">
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams.
                </AccordionBody>
              </Accordion>

              <Accordion open={open === 7} icon={<Icon id={7} open={open} />}>
                <AccordionHeader
                  className="md:text-[17px] text-[14px] text-theme-primary font-themefont hover:text-gray-500"
                  onClick={() => handleOpen(7)}
                >
                  What can I do with Material Tailwind?
                </AccordionHeader>
                <AccordionBody className="md:text-[13px] text-[12px] text-theme-primary/60 tracking-wider font-themefont text-justify">
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams. We&apos;re not always in the
                  position that we want to be at. We&apos;re constantly growing.
                  We&apos;re constantly making mistakes. We&apos;re constantly
                  trying to express ourselves and actualize our dreams.
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams. We&apos;re not always in the
                  position that we want to be at. We&apos;re constantly growing.
                  We&apos;re constantly making mistakes. We&apos;re constantly
                  trying to express ourselves and actualize our dreams.
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams. We&apos;re not always in the
                  position that we want to be at. We&apos;re constantly growing.
                  We&apos;re constantly making mistakes. We&apos;re constantly
                  trying to express ourselves and actualize our dreams.
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams. We&apos;re not always in the
                  position that we want to be at. We&apos;re constantly growing.
                  We&apos;re constantly making mistakes. We&apos;re constantly
                  trying to express ourselves and actualize our dreams.
                </AccordionBody>
              </Accordion>

              <Accordion open={open === 8} icon={<Icon id={8} open={open} />}>
                <AccordionHeader
                  className="md:text-[17px] text-[14px] text-theme-primary font-themefont hover:text-gray-500"
                  onClick={() => handleOpen(8)}
                >
                  What can I do with Material Tailwind?
                </AccordionHeader>
                <AccordionBody className="md:text-[13px] text-[12px] text-theme-primary/60 tracking-wider font-themefont text-justify ">
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams. We&apos;re not always in the
                  position that we want to be at. We&apos;re constantly growing.
                  We&apos;re constantly making mistakes. We&apos;re constantly
                  trying to express ourselves and actualize our dreams.
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams. We&apos;re not always in the
                  position that we want to be at. We&apos;re constantly growing.
                  We&apos;re constantly making mistakes. We&apos;re constantly
                  trying to express ourselves and actualize our dreams.
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams. We&apos;re not always in the
                  position that we want to be at. We&apos;re constantly growing.
                  We&apos;re constantly making mistakes. We&apos;re constantly
                  trying to express ourselves and actualize our dreams.
                  We&apos;re not always in the position that we want to be at.
                  We&apos;re constantly growing. We&apos;re constantly making
                  mistakes. We&apos;re constantly trying to express ourselves
                  and actualize our dreams. We&apos;re not always in the
                  position that we want to be at. We&apos;re constantly growing.
                  We&apos;re constantly making mistakes. We&apos;re constantly
                  trying to express ourselves and actualize our dreams.
                </AccordionBody>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
      {/* content end */}
    </>
  );
};

export default Faq;
