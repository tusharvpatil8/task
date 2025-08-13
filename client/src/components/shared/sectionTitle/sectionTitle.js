import React from "react";
import underline from "../../../assets/images/title-underline.png";

const SectionTitle = ({ title, titleClass }) => {
  return (
    <>
      <div className={`${titleClass}`}>
        <div className={`font-syne font-bold  text-2xl text-[#003A7B] text-center lg:text-[48px] `}>
          <h2>{title}</h2>
        </div>
        <div className="flex justify-center pt-2">
          <img className="md:w-[256px] w-[129px]" src={underline} alt="" />
        </div>
      </div>
    </>
  );
};

export default SectionTitle;