import DataNoFound from "assets/svg/dataNoFound";
import { Button, Card, Spinner } from "components/ui";
import React, { useEffect, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleBlogDetail } from "service/blogService";
import { formatDateToDDMMMYYYY } from "utils/hoc/helper/dateFormat";
import useThemeClass from "utils/hooks/useThemeClass";

const DetailsInfoField = ({ title, value }) => {
  return (
    <div className="my-2">
      <span>{title}</span>
      <p className="text-gray-700 dark:text-gray-200 font-semibold whitespace-pre-wrap break-words">
        {value}
      </p>
    </div>
  );
};

const DetailsBlog = () => {
  const { textTheme } = useThemeClass();
  const { id } = useParams();
  const [blogData, setBlogData] = useState();
  console.log("blogData", blogData);
  const [isBlogDataLoaded, setIsBlogDataLoaded] = useState(false);
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const getBlogDetailById = async () => {
      setIsBlogDataLoaded(true);

    try {
      const resp = await getSingleBlogDetail(id);

      console.log("getSingleBlogDetail details", resp);
      if (resp?.success) {
        setBlogData({
          title: resp?.data?.title || "",
          author: resp?.data?.author || "",
          slugUrl: resp?.data?.slug_url || "",
          categories: resp?.data?.blog_categories.map((cat) => cat.label) || [],
          content: resp?.data?.content || "",
          readTime: resp?.data?.readTime || "",
          publishedDate: resp?.data?.publishedDate || "",
          image: resp?.data?.image || "",
          thumbnailImage: resp?.data?.thumbnailImage || "",
        });
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsBlogDataLoaded(false);
    }
  };

  useEffect(() => {
    if (id) {
      getBlogDetailById();
    }
  }, [id]);
  return (
    <>
      <Card bordered className="mb-4">
        <div
          className={`text-xl font-bold ${textTheme} flex justify-start items-center`}
        >
          <Button
            size="sm"
            icon={<HiArrowNarrowLeft size={20} />}
            onClick={() => {
              window.history.back();
            }}
          />
          <span className="mx-4">Blog Information</span>
        </div>
      </Card>
      {isBlogDataLoaded ? (
        <div className="flex justify-center items-center py-8">
          <Spinner size="40px" />
        </div>
      ) : blogData ? (
        <Card
          bordered
          className="w-full col-span-1 p-4 rounded-md flex flex-col xl:justify-between h-full  mx-auto"
        >
          <h6 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Blog Details
          </h6>
          <div
            style={{
              borderBottom: "1px solid #ccc",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          ></div>

          <div className="md:grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            <DetailsInfoField title="Title" value={`${blogData?.title}`} />
            <DetailsInfoField title="Author" value={blogData?.author} />
            <DetailsInfoField title="Slug Url" value={blogData?.slugUrl} />
            <DetailsInfoField title="Categories" value={blogData?.categories} />
            <DetailsInfoField title="Content" value={blogData?.content} />
            <DetailsInfoField
              title="Read Time"
              value={`${blogData?.readTime}`}
            />
            <DetailsInfoField
              title="Published Date"
              value={formatDateToDDMMMYYYY(blogData?.publishedDate)}
            />
          </div>
        </Card>
      ) : (
        <DataNoFound />
      )}
    </>
  );
};

export default DetailsBlog;
