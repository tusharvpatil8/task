import { ConfirmDialog } from "components/shared";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Notification,
  Pagination,
  Spinner,
  Switcher,
  Table,
  toast,
} from "components/ui";
import TBody from "components/ui/Table/TBody";
import Td from "components/ui/Table/Td";
import Th from "components/ui/Table/Th";
import THead from "components/ui/Table/THead";
import Tr from "components/ui/Table/Tr";
import React, { useEffect, useState } from "react";
import {
  HiEye,
  HiOutlinePencil,
  HiOutlineSearch,
  HiOutlineTrash,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import {
  deleteBlog,
  getAllBlogs,
  updateBlogPublishedStatus,
} from "service/blogService";
import { formatDateToDDMMMYYYY } from "utils/hoc/helper/dateFormat";
import removeSpecials from "common/serachText";
import { Input } from "components/ui";
import { PAGESIZE } from "constants/pagination.constant";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import {
  BLOG_DETAILS_PREFIX_PATH,
  BLOG_EDIT_PREFIX_PATH,
  BLOGS_PREFIX_PATH,
} from "constants/route.constant";
import DataNoFound from "assets/svg/dataNoFound";

const BlogList = () => {
  const navigateTo = useNavigate();
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultTitle, setResultTitle] = useState("");
  const [searchText, setSearchText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [isPublishedOpen, setIsPublishedOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    perPage: PAGESIZE,
  });
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const getAllBlogData = async () => {
    setLoading(true);
    try {
      const payload = {
        search: removeSpecials(debouncedText),
        perPage: pagination.perPage,
        pageNo: pagination.currentPage,
      };

      const resp = await getAllBlogs(payload);
      if (resp?.success) {
        setBlogData(resp.data || []);
        setPagination((prev) => ({
          ...prev,
          total: resp.pagination.count || 0,
        }));
      }
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to load blogs!
        </Notification>
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const onSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(searchText);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [debouncedText]);

  useEffect(() => {
    getAllBlogData();
  }, [debouncedText, pagination.currentPage]);

  useEffect(() => {
    if (!pagination?.total) {
      setResultTitle("Result 0 - 0 of 0");
      return;
    }

    const start = (pagination.currentPage - 1) * pagination.perPage + 1;
    const end = start + blogData.length - 1;
    const total = pagination.total;

    setResultTitle(
      `Result ${pagination.currentPage} - ${blogData.length} of ${total}`
    );
  }, [pagination, blogData]);

  const handleUpdateBlogPublishedStatus = async () => {
    try {
      const resp = await updateBlogPublishedStatus(selectedData?._id);
      if (resp?.success) {
        const updatedBlogList = blogData.map((blog) => {
          if (blog?._id === selectedData?._id) {
            return { ...blog, published: !blog.published };
          }
          return blog;
        });
        setBlogData(updatedBlogList);

        toast.push(
          <Notification
            title={`Blog Published Status Updated Successfully`}
            type="success"
            duration={1500}
          ></Notification>,
          {
            placement: "top-center",
          }
        );
      }
    } catch (err) {
      toast.push(
        <Notification
          title={
            err?.response?.data?.error?.message ||
            err?.response?.data?.error ||
            err?.response?.data?.message
          }
          type="danger"
          duration={1500}
        ></Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setIsPublishedOpen(false);
      getAllBlogData();
    }
  };

  const onDelete = async () => {
    try {
      const resp = await deleteBlog(selectedData?._id);
      if (resp?.success) {
        toast.push(
          <Notification
            title={resp.message}
            type="success"
            duration={1500}
          ></Notification>,
          { placement: "top-center" }
        );
      }
    } catch (err) {
      console.log("err", err);
      toast.push(
        <Notification
          title={
            err?.response?.data?.error?.message ||
            err?.response?.data?.error ||
            err?.response?.data?.message
          }
          type="danger"
          duration={1500}
        ></Notification>,
        { placement: "top-center" }
      );
    } finally {
      setIsDeleteOpen(false);
      getAllBlogData();
    }
  };

  return (
    <>
      <div className="grid grid-cols-6 gap-4 mb-4">
        <div className="flex col-start-1 col-end-3 gap-2 ">
          <div
            className={`w-auto  text-center rounded-lg font-bold bg-${themeColor}-50 text-${themeColor}-${primaryColorLevel} text-base
                          dark:bg-gray-700 px-4 border border-${themeColor}-${primaryColorLevel} py-2 px-2`}
          >
            {resultTitle}
          </div>
        </div>
        <Input
          placeholder="Search By Title"
          className="col-end-7 col-span-2"
          value={searchText}
          prefix={
            <HiOutlineSearch
              className={`text-xl text-${themeColor}-${primaryColorLevel}`}
            />
          }
          onChange={onSearch}
          suffix={
            searchText && (
              <AiOutlineClose
                className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                onClick={() => {
                  setSearchText("");
                }}
              />
            )
          }
        />
      </div>

      <>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner size="40px" />
          </div>
        ) : blogData?.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <Tr>
                    <Th>Blog Image</Th>
                    <Th>Title</Th>
                    <Th>Category</Th>
                    <Th>Publish Date</Th>
                    <Th>Published</Th>
                    <Th className="text-end">Actions</Th>
                  </Tr>
                </THead>

                <TBody>
                  {blogData.map((blog, index) => {
                    return (
                      <Tr
                        key={blog?._id}
                        className={index % 2 !== 0 ? "bg-blue-50" : "bg-white"}
                      >
                        <Td>
                          <Avatar
                            shape="circle"
                            src={blog.image}
                            alt={blog.title}
                            size="lg"
                          />
                        </Td>
                        <Td>{blog.title}</Td>
                        <Td>
                          {blog?.blog_categories?.length > 0 ? (
                            blog.blog_categories.map((item) => (
                              <div
                                key={item.value}
                                className="flex items-center gap-2"
                              >
                                <Badge className="bg-gray-400" />
                                {item.label}
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500">
                              No categories available
                            </span>
                          )}
                        </Td>

                        <Td>{formatDateToDDMMMYYYY(blog.publishedDate)}</Td>
                        <Td>
                          <div className="flex justify-start text-lg">
                            <Switcher
                              checked={blog?.published}
                              onClick={() => {
                                setSelectedData(blog);
                                setIsPublishedOpen(true);
                              }}
                            />
                          </div>
                        </Td>
                        <Td>
                          <div className="flex space-x-2 text-lg">
                            <Button
                              className={`cursor-pointer p- hover:text-blue-500`}
                              shape="circle"
                              variant="solid"
                              icon={<HiEye />}
                              size="sm"
                              onClick={() =>
                                navigateTo(
                                  `${BLOGS_PREFIX_PATH}${BLOG_DETAILS_PREFIX_PATH}/${blog?._id}`
                                )
                              }
                            ></Button>
                            <Button
                              className={`cursor-pointer p-2 hover:text-blue-500`}
                              shape="circle"
                              variant="solid"
                              icon={<HiOutlinePencil />}
                              size="sm"
                              onClick={() =>
                                navigateTo(
                                  `${BLOGS_PREFIX_PATH}${BLOG_EDIT_PREFIX_PATH}/${blog?._id}`
                                )
                              }
                            ></Button>

                            {!blog.published && (
                              <Button
                                className={`cursor-pointer p-2 hover:text-blue-500`}
                                shape="circle"
                                variant="solid"
                                icon={<HiOutlineTrash />}
                                size="sm"
                                onClick={() => {
                                  setSelectedData(blog);
                                  setIsDeleteOpen(true);
                                }}
                              ></Button>
                            )}
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                </TBody>
              </Table>
            </div>

            <div className="flex items-center justify-center mt-8">
              <Pagination
                pageSize={pagination.perPage}
                currentPage={pagination.currentPage}
                total={pagination.total}
                onChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <DataNoFound />
        )}
      </>

      {/* Published Dialogue */}
      <ConfirmDialog
        isOpen={isPublishedOpen}
        onClose={() => setIsPublishedOpen(false)}
        onRequestClose={() => setIsPublishedOpen(false)}
        type="danger"
        title={`Published ${selectedData?.title} Permanently?`}
        onCancel={() => setIsPublishedOpen(false)}
        onConfirm={handleUpdateBlogPublishedStatus}
        confirmButtonColor="red-600"
      >
        <p>
          Are you sure you want to Published this blog? This action cannot be
          undone.
        </p>
      </ConfirmDialog>

      {/* Delete Dialogue */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onRequestClose={() => setIsDeleteOpen(false)}
        type="danger"
        title={`Delete ${selectedData?.title} Permanently?`}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={onDelete}
        confirmButtonColor="red-600"
      >
        <p>
          Are you sure you want to delete this blog? This action cannot be
          undone.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default BlogList;
