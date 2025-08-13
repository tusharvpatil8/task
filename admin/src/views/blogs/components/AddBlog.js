import { RichTextEditor } from "components/shared";
import {
  Button,
  Card,
  DatePicker,
  FormContainer,
  FormItem,
  Input,
  Notification,
  Select,
  Switcher,
  toast,
  Upload,
} from "components/ui";
import { PAGESIZE } from "constants/pagination.constant";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { FcImageFile } from "react-icons/fc";
import { HiArrowNarrowLeft, HiTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { addBlog } from "service/blogService";
import { uploadSingleImage } from "service/commonService";
import { getAllCategory } from "service/configService";
import useThemeClass from "utils/hooks/useThemeClass";
import { BlogSchema } from "validations/blog/blogValidationSchema";

const AddBlog = () => {
  const navigate = useNavigate();
  const { textTheme } = useThemeClass();
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [pagination, setPagination] = useState({
    total: "",
    currentPage: 1,
  });
  const [publishedBlog, setPublishedBlog] = useState(true);

  const getCategoryData = async () => {
    setLoading(true);
    try {
      const payload = {
        perPage: PAGESIZE,
        pageNo: pagination?.currentPage,
      };

      const resp = await getAllCategory(
        "status",
        payload?.pageNo,
        payload?.perPage
      );
      if (resp?.success) {
        setCategoryData(resp?.data);
        setPagination({
          ...pagination,
          currentPage: resp.pagination?.pageNo,
          total: resp.pagination?.count,
        });
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  // console.log('categoryData', categoryData);
  const onSave = async (values, setSubmitting) => {
    setSubmitting(true);
    try {
      const categoryStrings = values.categories.map(String);

      // 1. Upload Blog Image
      const formDataImage = new FormData();
      formDataImage.append("image", values.image);
      const uploadImageResp = await uploadSingleImage(formDataImage);

      // 2. Upload Thumbnail Image
      const formDataThumb = new FormData();
      formDataThumb.append("image", values.thumbnailImage);
      const uploadThumbResp = await uploadSingleImage(formDataThumb);

      let payload = {
        title: values?.title,
        category: categoryStrings,
        readTime: values?.readTime,
        publishedDate: values?.publishedDate,
        published: publishedBlog,
        slug_url: values?.slugUrl,
        content: values?.content,
        author: values?.author,
        image: uploadImageResp,
        thumbnailImage: uploadThumbResp,
      };
      console.log("payload", payload);

      const resp = await addBlog(payload);
      // console.log('addBlogResp', resp);
      if (resp?.success) {
        navigate(-1);
        toast.push(
          <Notification
            title={resp.message}
            type="success"
            duration={1500}
          ></Notification>,
          {
            placement: "top-center",
          }
        );
      }
    } catch (err) {
      console.log("err", err);
      toast.push(
        <Notification
          title={
            err?.response?.data?.error?.message ||
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err.message
          }
          type="danger"
          duration={1500}
        ></Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card bordered className="mb-4">
        <div
          className={`text-xl font-bold ${textTheme} flex justify-start items-center`}
        >
          <Button
            size="sm"
            icon={<HiArrowNarrowLeft size={25} />}
            onClick={() => {
              window.history.back();
            }}
          />
          <span className="mx-4">Add Blog Details</span>
        </div>
      </Card>

      <Formik
        initialValues={{
          title: "",
          categories: [],
          readTime: "",
          publishedDate: "",
          published: publishedBlog,
          slugUrl: "",
          content: "",
          author: "",
          image: "",
          thumbnailImage: "",
        }}
        validationSchema={BlogSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await onSave(values, setSubmitting);
        }}
      >
        {({
          values,
          touched,
          errors,
          isSubmitting,
          resetForm,
          setFieldValue,
        }) => {
          console.log("values", values);
          console.log("errors", errors);

          return (
            <Form>
              <FormContainer>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <Card bordered className="mb-4">
                      <h5 className={`text-xl mb-6 font-bold ${textTheme}`}>
                        Basic Details
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <FormItem
                            // className="mb-8"
                            label="Blog Title*"
                            invalid={errors.title && touched.title}
                            errorMessage={"Blog Title Required"}
                          >
                            <Field
                              type="text"
                              autoComplete="off"
                              name="title"
                              placeholder="Blog Title"
                              component={Input}
                              value={values.title}
                            />
                          </FormItem>
                        </div>

                        <FormItem
                          label="Blog Categories*"
                          invalid={errors.categories && touched.categories}
                          errorMessage={"Blog Category Required"}
                        >
                          <Field name="categories">
                            {({ field, form }) => (
                              <Select
                                name="categories"
                                placeholder="Please Select Categories"
                                options={categoryData.map((category) => ({
                                  value: category._id || category.id, // Ensure using _id if MongoDB
                                  label: category.categoryName,
                                }))}
                                isMulti
                                value={values.categories.map((id) => {
                                  const category = categoryData.find(
                                    (cat) => cat._id === id || cat.id === id
                                  );
                                  return category
                                    ? {
                                        value: category._id || category.id,
                                        label: category.categoryName,
                                      }
                                    : { value: id, label: "Unknown Category" };
                                })}
                                onChange={(val) => {
                                  // Set only valid IDs
                                  const ids = val
                                    .map((option) => option?.value)
                                    .filter(Boolean);
                                  setFieldValue("categories", ids);
                                }}
                              />
                            )}
                          </Field>
                        </FormItem>

                        <FormItem
                          // className="mb-8"
                          label="Read Time*"
                          invalid={errors.readTime && touched.readTime}
                          errorMessage={"Read Time Required"}
                        >
                          <Field
                            type="text"
                            autoComplete="off"
                            name="readTime"
                            placeholder="Read Time"
                            component={Input}
                            value={values.readTime}
                          />
                        </FormItem>

                        <FormItem
                          label="Publish Date*"
                          invalid={
                            errors.publishedDate && touched.publishedDate
                          }
                          errorMessage={"Publish Date Required"}
                        >
                          <Field
                            name="publishedDate"
                            placeholder="Publish Date"
                          >
                            {({ field, form }) => (
                              <DatePicker
                                name="publishedDate"
                                inputSuffix={null}
                                placeholder="Date"
                                field={field}
                                form={form}
                                value={field.value}
                                onChange={(date) => {
                                  form.setFieldValue(field.name, date);
                                }}
                              />
                            )}
                          </Field>
                        </FormItem>

                        <FormItem
                          // className="mb-8"
                          label="Slug URL*"
                          invalid={errors.slugUrl && touched.slugUrl}
                          errorMessage={"Slug URL Required"}
                        >
                          <Field
                            type="text"
                            autoComplete="off"
                            name="slugUrl"
                            placeholder="Slug URL"
                            component={Input}
                            value={values.slugUrl}
                          />
                        </FormItem>
                        <FormItem className="mb-8" label="Published *">
                          <Switcher
                            name="published"
                            defaultChecked={publishedBlog}
                            onChange={(checked) => setPublishedBlog(checked)}
                            value={values.published}
                          />
                        </FormItem>
                      </div>
                    </Card>
                    <Card bordered className="mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <h5 className={`text-xl mb-6 font-bold ${textTheme}`}>
                            Blog Content *
                          </h5>

                          <FormItem
                            className="mb-8"
                            // label="Blog Content*"
                            invalid={errors.content && touched.content}
                            errorMessage={"Blog Content Required"}
                          >
                            <RichTextEditor
                              name="text"
                              value={values.content ? values?.content : ""}
                              onChange={(val) => {
                                // console.log("🚀 ~ AboutUs ~ val:", val)
                                let newVal = val
                                  .replaceAll("<h1><br></h1>", ``)
                                  .replaceAll("<p><br></p>", ``)
                                  .replaceAll("<h2><br></h2>", ``)
                                  .replaceAll("<h3><br></h3>", ``)
                                  .replaceAll("<p></p>", ``);
                                // console.log("🚀 ~ AboutUs ~ newVal:", newVal)
                                setFieldValue("content", newVal);
                              }}
                            />
                          </FormItem>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card bordered className="mb-4">
                    <FormItem
                      label="Image *"
                      invalid={errors.image && touched.image}
                      errorMessage={"Image Required"}
                    >
                      <Field name="image" type="file">
                        {({ field, form }) => {
                          return values?.image ? (
                            <div className="relative w-full h-28 border flex justify-center items-center">
                              <img
                                className="w-auto h-full object-contain p-1"
                                src={
                                  values?.image instanceof File
                                    ? URL.createObjectURL(values?.image)
                                    : values?.image
                                }
                                alt="Blog Img"
                              />
                              <Button
                                className="absolute top-25 right-0 mt-40 "
                                type="button"
                                size="sm"
                                onClick={() =>
                                  form.setFieldValue(field.name, "")
                                }
                              >
                                <HiTrash size={20} />
                              </Button>
                            </div>
                          ) : (
                            <Upload
                              showList={false}
                              onChange={(files) => {
                                const file = files[files?.length - 1];
                                form.setFieldValue(field.name, file);
                              }}
                              draggable
                            >
                              <div className="my-16 p-2 text-center">
                                <div className="text-6xl mb-4 flex justify-center">
                                  <FcImageFile />
                                </div>
                                <p className="font-semibold">
                                  <span className="text-gray-800 dark:text-white">
                                    Drop your image here, or{" "}
                                  </span>
                                  <span className="text-blue-500">browse</span>
                                </p>
                                <p className="mt-1 opacity-60 dark:text-white">
                                  Support: jpeg, png,svg
                                </p>
                              </div>
                            </Upload>
                          );
                        }}
                      </Field>
                    </FormItem>

                    <FormItem
                      label="Author Profile Image *"
                      invalid={errors.thumbnailImage && touched.thumbnailImage}
                      errorMessage={"Author Profile Image Required"}
                    >
                      <Field name="thumbnailImage" type="file">
                        {({ field, form }) => {
                          return values?.thumbnailImage ? (
                            <div className="relative w-full h-28  border flex justify-center items-center">
                              <img
                                className="w-auto h-full object-contain p-1"
                                src={
                                  values?.thumbnailImage instanceof File
                                    ? URL.createObjectURL(
                                        values?.thumbnailImage
                                      )
                                    : values?.thumbnailImage
                                }
                                alt="Blog Thumbnail Img"
                              />
                              <Button
                                className="absolute top-25 right-0 mt-40 "
                                type="button"
                                size="sm"
                                onClick={() =>
                                  form.setFieldValue(field.name, "")
                                }
                              >
                                <HiTrash size={20} />
                              </Button>
                            </div>
                          ) : (
                            <Upload
                              showList={false}
                              onChange={(files) => {
                                const file = files[files?.length - 1];
                                form.setFieldValue(field.name, file);
                              }}
                              draggable
                            >
                              <div className="my-16 p-2 text-center">
                                <div className="text-6xl mb-4 flex justify-center">
                                  <FcImageFile />
                                </div>
                                <p className="font-semibold">
                                  <span className="text-gray-800 dark:text-white">
                                    Drop your image here, or{" "}
                                  </span>
                                  <span className="text-blue-500">browse</span>
                                </p>
                                <p className="mt-1 opacity-60 dark:text-white">
                                  Support: jpeg, png,svg
                                </p>
                              </div>
                            </Upload>
                          );
                        }}
                      </Field>
                    </FormItem>
                    <FormItem
                      className="mt-8"
                      label="Author *"
                      invalid={errors.author && touched.author}
                      errorMessage={"Author Required"}
                    >
                      <Field
                        type="text"
                        autoComplete="off"
                        name="author"
                        placeholder="Author"
                        component={Input}
                        value={values.author}
                      />
                    </FormItem>
                  </Card>
                </div>

                <Card bordered className="mb-4 sticky -bottom-1">
                  <div className="flex  items-center space-x-2">
                    <Button
                      size="sm"
                      className="ltr:mr-3 rtl:ml-3"
                      onClick={() => {
                        resetForm({
                          values: {
                            title: "",
                            categories: [],
                            readTime: "",
                            publishedDate: null,
                            published: null,
                            slugUrl: "",
                            content: "",
                            author: "",
                            image: null,
                            thumbnailImage: null,
                          },
                        });
                      }}
                      type="button"
                    >
                      Reset
                    </Button>

                    <Button
                      size="sm"
                      variant="solid"
                      icon={!loading && <AiOutlineSave color="#fff" />}
                      loading={isSubmitting}
                      type="submit"
                    >
                      Save
                    </Button>
                  </div>
                </Card>
              </FormContainer>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AddBlog;

