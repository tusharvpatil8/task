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
import { useNavigate, useParams } from "react-router-dom";
import { uploadSingleImage } from "service/commonService";
import { editBlog, getSingleBlogDetail } from "service/blogService";
import useThemeClass from "utils/hooks/useThemeClass";
import { getAllCategory } from "service/configService";
import { BlogSchema } from "validations/blog/blogValidationSchema";
import { formatDateToDDMMMYYYY } from "utils/hoc/helper/dateFormat";

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blogData, setBlogData] = useState({
    title: "",
    categories: [],
    content: "",
    readTime: "",
    publishedDate: "",
    publishedBlog: "",
    author: "",
    slugUrl: "",
    image: "",
    thumbnailImage: "",
  });
  const [isBlogDataLoaded, setIsBlogDataLoaded] = useState(false);
  const { textTheme } = useThemeClass();
  const [categoryData, setCategoryData] = useState([]);
  const [pagination, setPagination] = useState({
    total: "",
    currentPage: 1,
  });
  const [loading, setLoading] = useState(false);
  const [publishedBlog, setPublishedBlog] = useState(false);

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

  const getBlogDetailById = async () => {
    try {
      const resp = await getSingleBlogDetail(id);

      console.log("getSingleBlogDetail", resp);
      if (resp?.success) {
        setBlogData({
          title: resp?.data?.title || "",
          author: resp?.data?.author || "",
          slugUrl: resp?.data?.slug_url || "",
          categories: resp?.data?.blog_categories.map((cat) => cat.value) || [],
          content: resp?.data?.content || "",
          readTime: resp?.data?.readTime || "",
          publishedDate: resp?.data?.publishedDate || "",
          published: publishedBlog,
          image: resp?.data?.image || "",
          thumbnailImage: resp?.data?.thumbnailImage || "",
        });
        setPublishedBlog("true");
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsBlogDataLoaded(true);
    }
  };

  useEffect(() => {
    if (id) {
      getBlogDetailById();
    }
  }, [id]);
  const onSave = async (values, setSubmitting) => {
    console.log("🚀 onSave called with values:", values);
    setSubmitting(true);
    try {
      // Conditionally upload blog image
      let uploadImageResp = values.image;
      if (values.image instanceof File) {
        const formDataImage = new FormData();
        formDataImage.append("image", values.image);
        uploadImageResp = await uploadSingleImage(formDataImage);
      }

      // Conditionally upload thumbnail image
      let uploadThumbResp = values.thumbnailImage;
      if (values.thumbnailImage instanceof File) {
        const formDataThumb = new FormData();
        formDataThumb.append("image", values.thumbnailImage);
        uploadThumbResp = await uploadSingleImage(formDataThumb);
      }

      let payload = {
        title: values?.title,
        author: values?.author,
        category: values?.category,
        readTime: values?.readTime,
        publishedDate: values?.publishedDate,
        published: publishedBlog,
        content: values?.content,
        slug_url: values?.slugUrl,
        image: uploadImageResp,
        thumbnailImage: uploadThumbResp,
      };

      const resp = await editBlog(id, payload);

      if (resp?.success) {
        navigate(-1);
        toast.push(
          <Notification title={resp.message} type="success" duration={1500} />,
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
        />,
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
            icon={<HiArrowNarrowLeft size={20} />}
            onClick={() => {
              window.history.back();
            }}
          />
          <span className="mx-4">Edit Blog Details</span>
        </div>
      </Card>

      {isBlogDataLoaded && (
        <Formik
          enableReinitialize
          initialValues={blogData}
          validationSchema={BlogSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await onSave(values, setSubmitting);
          }}
        >
          {({
            values,
            touched,
            errors,
            resetForm,
            isSubmitting,
            setFieldValue,
          }) => {
            console.log("values", values);
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
                                    value: category._id || category.id,
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
                                      : {
                                          value: id,
                                          label: "Unknown Category",
                                        };
                                  })}
                                  onChange={(val) => {
                                    const ids = val
                                      .map((option) => option?.value)
                                      .filter(Boolean);
                                    form.setFieldValue("categories", ids);
                                  }}
                                  onBlur={() =>
                                    form.setFieldTouched("categories", true)
                                  }
                                />
                              )}
                            </Field>
                          </FormItem>

                          <FormItem
                            // className="mb-8"
                            label="Read Time*"
                            invalid={errors.readTime && touched.readTime}
                            errorMessage={"Required"}
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
                            className=""
                            label="Publish Date*"
                            invalid={
                              errors.publishedDate && touched.publishedDate
                            }
                            errorMessage={"Publish Date Required"}
                          >
                            <Field name="publishedDate" placeholder="Date">
                              {({ field, form }) => (
                                <DatePicker
                                  placeholder="Publish Date"
                                  field={field}
                                  form={form}
                                  value={
                                    values.publishedDate === null
                                      ? null
                                      : new Date(values.publishedDate)
                                  }
                                  onChange={(date) => {
                                    form.setFieldValue("publishedDate", date);
                                  }}
                                />
                              )}
                            </Field>
                          </FormItem>

                          <FormItem
                            label="Slug URL*"
                            invalid={errors.slugUrl && touched.slugUrl}
                            errorMessage={"Slug URL is required"}
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
                              defaultChecked={publishedBlog}
                              onChange={(checked) => setPublishedBlog(checked)}
                              value={values.title}
                            />
                          </FormItem>
                        </div>
                      </Card>

                      <Card bordered className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="col-span-2">
                            {/* <h5
                              className={`text-xl mb-6 font-bold ${textTheme}`}
                            >
                              Blog Content*
                            </h5> */}

                            <FormItem
                              className="mb-8"
                              label="Blog Content*"
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
                        label="Image*"
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
                                    <span className="text-blue-500">
                                      browse
                                    </span>
                                  </p>
                                </div>
                              </Upload>
                            );
                          }}
                        </Field>
                      </FormItem>

                      <FormItem
                        label="Author Profile Image *"
                        invalid={
                          errors.thumbnailImage && touched.thumbnailImage
                        }
                        errorMessage={"Author Profile Image Required"}
                      >
                        <Field name="thumbnailImage" type="file">
                          {({ field, form }) => {
                            return values?.thumbnailImage ? (
                              <div className="relative w-full h-28 border flex justify-center items-center">
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
                                    <span className="text-blue-500">
                                      browse
                                    </span>
                                  </p>
                                </div>
                              </Upload>
                            );
                          }}
                        </Field>
                      </FormItem>

                      <FormItem
                        className="mt-8"
                        label="Author*"
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
      )}
    </>
  );
};

export default EditBlog;
