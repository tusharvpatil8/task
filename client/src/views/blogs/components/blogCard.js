import React from "react";
import parse from "html-react-parser";
import { FaClock } from "react-icons/fa";

const BlogCard = ({
  image,
  key,
  heading,
  details,
  authorImage,
  authorName,
  timeText,
  onClickCard,
}) => {
  return (
    <>
      <div
        key={key}
        className="w-full cursor-pointer p-4 rounded-xl shadow-xl bg-slate-50 md:max-w-lg flex flex-col justify-between"
        onClick={onClickCard}
      >
        <div>
          <img
            className="w-full h-[200px] object-cover rounded-xl"
            src={image}
            alt="Blog"
          />
          <div className="py-4">
            <div className="flex items-center mb-2">
              <FaClock className="w-4 h-6 mr-2 text-[#1C274C]" />
              <p className="text-[#003A7B] font-outfit font-medium text-sm">
                {timeText}
              </p>
            </div>
            <div className="text-[#003A7B] font-outfit font-medium text-lg mb-2 line-clamp-2">
              {heading}
            </div>
            <div className="">
              <p className="text-[#474747] font-outfit font-normal whitespace-wrap text-ellipsis  text-base line-clamp-4">
                {parse(details)}
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex py-2 align-bottom  items-center">
            <img
              className="w-12 h-12 rounded-full mr-4"
              src={authorImage}
              alt="Author"
            />
            <div>
              <p className="text-[#003A7B] font-outfit font-medium text-base">
                {authorName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogCard;
