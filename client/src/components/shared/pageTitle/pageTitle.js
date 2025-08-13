import React from "react";
import { FaHome } from "react-icons/fa";
import { SlArrowRight } from "react-icons/sl";
import { Link } from "react-router-dom";

const PageTitle = ({ title }) => {
  return (
    <>
      <div className="flex items-center text-sm text-gray-500 mt-14 sm:pl-0 pl-10">
        <Link to="/">
          <FaHome style={{ color: "#003A7B", fontSize: "20px" }} />
        </Link>
        <span className="mx-2">
          <SlArrowRight />
        </span>
        <span className="font-medium font-outfit text-xl capitalize text-[#003A7B] underline cursor-pointer">
          {title}
        </span>
      </div>
    </>
  );
};

export default PageTitle;
