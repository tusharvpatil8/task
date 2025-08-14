import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { getSingleTaskDetail, editTask } from "../../../services/taskService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Assuming you have your validation schema somewhere, otherwise define here
const BlogSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  // categories: Yup.array().min(1, "Select at least one category"),
  content: Yup.string().required("Content is required"),
  // readTime: Yup.string().required("Read time is required"),
  publishedDate: Yup.date().nullable().required("Publish date is required"),
  // slugUrl: Yup.string().required("Slug URL is required"),
  author: Yup.string().required("Author is required"),
  // image: Yup.mixed().required("Image is required"),
  // thumbnailImage: Yup.mixed().required("Thumbnail image is required"),
});

const EditTask = ({ taskId, onClose }) => {
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    title: "",
    content: "",
    publishedDate: "",
    author: "",
    image: null,
    thumbnailImage: null,
  });

  const [, setImagePreview] = useState(null);
  const [, setThumbnailPreview] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const toInputDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date)) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getBlogDetailById = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const resp = await getSingleTaskDetail(taskId);

      console.log("getSingleBlogDetail", resp);
      if (resp?.success) {
        setInitialValues({
          title: resp?.data?.title || "",
          author: resp?.data?.author || "",
          content: resp?.data?.content || "",
          // readTime: resp?.data?.readTime || "",
          publishedDate: toInputDate(resp?.data?.publishedDate) || "",
          // image: resp?.data?.image || "",
          // thumbnailImage: resp?.data?.thumbnailImage || "",
        });
      } else {
        setFetchError("Unable to load task details.");
        toast.error("Unable to load task details.");
      }
    } catch (err) {
      console.log("err", err);
      setFetchError(err?.message || "Failed to load task details.");
      toast.error(err?.message || "Failed to load task details.");
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    if (taskId) {
      getBlogDetailById();
    }
  }, [getBlogDetailById]);

  // const handleImageChange = (e, setFieldValue, setPreview) => {
  //   const file = e.currentTarget.files[0];
  //   setFieldValue(e.currentTarget.name, file);
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setPreview(null);
  //   }
  // };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    try {
      // let uploadedImage = values.image;
      // if (values.image instanceof File) {
      //   const formData = new FormData();
      //   formData.append("image", values.image);
      //   uploadedImage = await uploadSingleImage(formData);
      // }

      // let uploadedThumbnail = values.thumbnailImage;
      // if (values.thumbnailImage instanceof File) {
      //   const formData = new FormData();
      //   formData.append("image", values.thumbnailImage);
      //   uploadedThumbnail = await uploadSingleImage(formData);
      // }

      const payload = {
        ...values,
        title: values.title?.trim() || "",
        content: values.content?.trim() || "",
        author: values.author?.trim() || "",
        publishedDate: values.publishedDate
          ? new Date(values.publishedDate).toISOString()
          : null,
        // image: uploadedImage,
        // thumbnailImage: uploadedThumbnail,
      };

      const resp = await editTask(taskId, payload);
      if (resp?.success) {
        toast.success(resp?.message || "Task edited successfully!");
        resetForm();
        if (onClose) {
          onClose();
        } else {
          navigate(-1);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Error updating blog: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container  p-4 ">
      <h1 className="text-3xl font-bold mb-6">Edit Task</h1>
      {isLoading && !fetchError && (
        <div className="mb-4 text-gray-600 text-sm">Loading task...</div>
      )}
      {fetchError && (
        <div className="mb-4 text-red-600 text-sm">{fetchError}</div>
      )}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={BlogSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, isSubmitting, resetForm }) => (
          <Form className="space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block font-semibold mb-1">
                Title*
              </label>
              <Field
                id="title"
                name="title"
                placeholder="Enter blog title"
                className="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-400"
                disabled={isSubmitting || isLoading}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block font-semibold mb-1">
                Content*
              </label>
              <Field
                as="textarea"
                id="content"
                name="content"
                rows="6"
                placeholder="Write blog content"
                className="w-full border rounded p-2 resize-y"
                disabled={isSubmitting || isLoading}
              />
              <ErrorMessage
                name="content"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            {/* Published Date */}
            <div>
              <label
                htmlFor="publishedDate"
                className="block font-semibold mb-1"
              >
                Publish Date*
              </label>
              <Field
                id="publishedDate"
                name="publishedDate"
                type="date"
                className="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-400"
                disabled={isSubmitting || isLoading}
              />
              <ErrorMessage
                name="publishedDate"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            {/* Blog Image */}
            {/* <div>
              <label htmlFor="image" className="block font-semibold mb-1">
                Blog Image*
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(e, setFieldValue, setImagePreview)
                }
                className="w-full border rounded p-2"
              />
              <ErrorMessage
                name="image"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Blog Preview"
                  className="mt-2 max-h-48 rounded object-contain"
                />
              )}
            </div> */}

            {/* Thumbnail Image */}
            {/* <div>
              <label htmlFor="thumbnailImage" className="block font-semibold mb-1">
                Author Profile Image*
              </label>
              <input
                id="thumbnailImage"
                name="thumbnailImage"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(e, setFieldValue, setThumbnailPreview)
                }
                className="w-full border rounded p-2"
              />
              <ErrorMessage
                name="thumbnailImage"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="mt-2 max-h-48 rounded object-contain"
                />
              )}
            </div> */}

            {/* Author */}
            <div>
              <label htmlFor="author" className="block font-semibold mb-1">
                Author*
              </label>
              <Field
                id="author"
                name="author"
                placeholder="Enter author name"
                className="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-400"
                disabled={isSubmitting || isLoading}
              />
              <ErrorMessage
                name="author"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  // Reset form to initialValues after fetch
                  resetForm();
                  setImagePreview(null);
                  setThumbnailPreview(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={isSubmitting || isLoading}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => (onClose ? onClose() : navigate(-1))}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={isSubmitting || isLoading}
              >
                Cancel
              </button>
              <div className="flex ">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className={`bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition ${
                    isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Editing..." : "Edit Task"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditTask;
