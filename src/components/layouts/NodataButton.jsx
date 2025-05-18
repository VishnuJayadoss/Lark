import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";

const NodataButton = () => {
  const navigate = useNavigate();
  const cookiesUser = JSON.parse(Cookies.get("user"));
  const NodataImage = () => {
    const userGender = cookiesUser?.gender;

    if (userGender == "Female") {
      navigate("/category/3");
      console.log("userGender female", userGender);
    } else if (userGender == "Male") {
      navigate("/category/2");
      console.log("userGender male", userGender);
    } else {
      navigate("/category/2");
      console.log("userGender unknow", userGender);
    }
  };
  return (
    <>
      <Button className="my-5 rounded-none" onClick={NodataImage}>
        Continue Shopping
      </Button>
    </>
  );
};

export default NodataButton;
