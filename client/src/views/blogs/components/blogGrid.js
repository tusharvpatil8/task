import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "./blogCard";
import { formatDateToDDMMMYYYY } from "../../../utils/functions/dateFormat";

const BlogGrid = ({ ...props }) => {
  const { title, titleClass, cards = [], btnDivClass } = props;
  console.log("cards",cards)
  const navigate = useNavigate();

  return (
    <div className="">
      {cards?.length > 0 && (
        <>
         
          <div className="pt-6 lg:pt-10">
            <div className="grid  gap-4  sm:grid-cols-2  xl:grid-cols-4 ">
              {cards?.map((card, index) => {
                return (
                  <BlogCard
                    key={index}
                    image={
                      card.image
                        ? card.image
                        : "https://internalmedicine.usc.edu/wp-content/uploads/2021/11/Medical-doctors-and-nurse-practitioners-discuss-paperwork-in-a-hallway.jpg"
                    }
                    timeText={
                      card?.publishedDate
                        ? formatDateToDDMMMYYYY(card?.publishedDate)
                        : "1 Month ago"
                    }
                    heading={
                      card?.title
                        ? card?.title
                        : "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
                    }
                    details={
                      card?.content
                        ? card?.content
                        : "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
                    }
                    authorImage={
                      card?.thumbnailImage
                        ? card?.thumbnailImage
                        : "https://image.shutterstock.com/image-photo/cheerful-medical-doctor-woman-hospital-260nw-113063566.jpg"
                    }
                    authorName={
                      card?.author ? card?.author : "Lily Allen"
                    }
                    onClickCard={() =>
                      navigate(`/blogs/blog-details/${card?.slug_url}`)
                    }
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogGrid;
