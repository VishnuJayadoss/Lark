import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Drawer,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import "../product-deatils/Drawer.css";
// size chart image

import Size1 from "../../../../assets/productdetails/size1.webp";
import Size2 from "../../../../assets/productdetails/size2.webp";

const Sizechart = ({ openRight, setOpenRight, isMobile }) => {
  const closeDrawerRight = () => {
    setOpenRight(false);
  };

  const data = [
    {
      label: "Size Chart",
      value: "sizechart",
      sizeinInches: [
        {
          size: "XS",
          chestSize: "36",
          Shoulder: "21.5",
          Length: "26.5",
        },
        {
          size: "s",
          chestSize: "36",
          Shoulder: "21.5",
          Length: "26.5",
        },
        {
          size: "M",
          chestSize: "36",
          Shoulder: "21.5",
          Length: "26.5",
        },
        {
          size: "L",
          chestSize: "36",
          Shoulder: "21.5",
          Length: "26.5",
        },
        {
          size: "XL",
          chestSize: "36",
          Shoulder: "21.5",
          Length: "26.5",
        },
        {
          size: "XXL",
          chestSize: "36",
          Shoulder: "21.5",
          Length: "26.5",
        },
        {
          size: "XXXL",
          chestSize: "36",
          Shoulder: "21.5",
          Length: "26.5",
        },
      ],
      sizeinCm: [
        {
          size: "XS",
          chestSize: "91",
          Shoulder: "55",
          Length: "66",
        },
        {
          size: "s",
          chestSize: "36",
          Shoulder: "21.5",
          Length: "26.5",
        },
        {
          size: "M",
          chestSize: "36",
          Shoulder: "21.5",
          Length: "26.5",
        },
        {
          size: "L",
          chestSize: "36",
          Shoulder: "21.5",
          Length: "26.5",
        },
        {
          size: "XL",
          chestSize: "36",
          Shoulder: "21.5",
          Length: "26.5",
        },
        {
          size: "XXL",
          chestSize: "36",
          Shoulder: "21.5",
          Length: "26.5",
        },
        {
          size: "XXXL",
          chestSize: "36",
          Shoulder: "21.5",
          Length: "26.5",
        },
      ],
    },
    {
      label: "Fit Guide",
      value: "fitguide",
      Image: Size1,
    },
    {
      label: "How To Measure",
      value: "measure",
      Image: Size2,
    },
  ];
  return (
    <>
      <Drawer
        placement="right"
        open={openRight}
        onClose={closeDrawerRight}
        className="p-4 h-screen overflow-y-scroll"
        size={isMobile ? 500 : 600}
        overlayProps={{ className: "fixed-backdrop" }}
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Size Guide
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={closeDrawerRight}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        {/* <Typography color="gray" className="mb-8 pr-4 font-normal">
            size table
          </Typography> */}

        <div className="relative">
          <Tabs value="sizechart">
            <TabsHeader>
              {data.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  className="md:text-[14px] text-xs text-theme-primary"
                >
                  {label}
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody>
              {data.map(
                ({ value, sizeinInches = [], sizeinCm = [], Image }) => (
                  <TabPanel key={value} value={value}>
                    {/* Size in Inches Table */}
                    {sizeinInches.length > 0 && (
                      <div className="">
                        <h3 className="font-bold mt-4">Size in Inches</h3>
                        <table className="w-full mx-auto border-collapse border border-gray-300 mt-2">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 border">Size</th>
                              <th className="px-4 py-2 border">Chest</th>
                              <th className="px-4 py-2 border">Shoulder</th>
                              <th className="px-4 py-2 border">Length</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {sizeinInches.map(
                              (
                                { size, chestSize, Shoulder, Length },
                                index
                              ) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 border">{size}</td>
                                  <td className="px-4 py-2 border">
                                    {chestSize}
                                  </td>
                                  <td className="px-4 py-2 border">
                                    {Shoulder}
                                  </td>
                                  <td className="px-4 py-2 border">{Length}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Size in CM Table */}
                    {sizeinCm.length > 0 && (
                      <>
                        <h3 className="font-bold mt-8">Size in CM</h3>
                        <table className="w-full border-collapse border border-gray-300 mt-2">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 border">Size</th>
                              <th className="px-4 py-2 border">Chest</th>
                              <th className="px-4 py-2 border">Shoulder</th>
                              <th className="px-4 py-2 border">Length</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {sizeinCm.map(
                              (
                                { size, chestSize, Shoulder, Length },
                                index
                              ) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 border">{size}</td>
                                  <td className="px-4 py-2 border">
                                    {chestSize}
                                  </td>
                                  <td className="px-4 py-2 border">
                                    {Shoulder}
                                  </td>
                                  <td className="px-4 py-2 border">{Length}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </>
                    )}

                    <img
                      src={Image}
                      className="w-full h-full overflow-auto"
                      alt=""
                    />
                  </TabPanel>
                )
              )}
            </TabsBody>
          </Tabs>
        </div>
      </Drawer>
    </>
  );
};

export default Sizechart;
