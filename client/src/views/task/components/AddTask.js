import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadSingleImage } from "../../../services/commonService";
import { addTask } from "../../../services/taskService";

// Validation schema matching your data
const blogSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  author: Yup.string().required("Author is required"),
  publishedDate: Yup.date().required("Publish Date is required"),
  // image: Yup.mixed().required("Blog image is required"),
  // thumbnailImage: Yup.mixed().required("Thumbnail image is required"),
});

const AddTask = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);

  const onSave = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      // Upload main blog image
      //       const formDataImage = new FormData();
      //       formDataImage.append("image", values.image);
      //       const uploadImageResp = await uploadSingleImage(formDataImage);
      // console.log("uploadImageResp", uploadImageResp)
      // 2. Upload Thumbnail Image
      // const formDataThumb = new FormData();
      // formDataThumb.append("image", values.thumbnailImage);
      // const uploadThumbResp = await uploadSingleImage(formDataThumb);

      // Prepare payload with all fields
      let payload = {
        title: values.title,
        publishedDate: values.publishedDate,
        content: values.content,
        author: values.author,
        // image: uploadImageResp,
        // thumbnailImage: uploadThumbResp,
      };
      console.log("payload", payload);
      const resp = await addTask(payload);

      if (resp?.success) {
        toast.success(resp.message || "Task created successfully!");
        resetForm();
        setImagePreview(null);
        setThumbPreview(null);
      } else {
        toast.error(resp.message || "Failed to add task. Please try again.");
      }
    } catch (err) {
      console.error("Error while saving task:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Task</h1>

      <Formik
        initialValues={{
          title: "",
          content: "",
          author: "",
          publishedDate: "",
          // image: null,
          // thumbnailImage: null,
        }}
        validationSchema={blogSchema}
        onSubmit={onSave}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Field
                name="title"
                type="text"
                placeholder="Enter title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                disabled={isSubmitting}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <Field
                as="textarea"
                name="content"
                placeholder="Write blog content..."
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition resize-none"
                disabled={isSubmitting}
              />
              <ErrorMessage
                name="content"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <Field
                name="author"
                type="text"
                placeholder="Author name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                disabled={isSubmitting}
              />
              <ErrorMessage
                name="author"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Published Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publish Date
              </label>
              <Field
                name="publishedDate"
                type="date"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                disabled={isSubmitting}
              />
              <ErrorMessage
                name="publishedDate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Blog Image */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blog Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFieldValue("image", file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setImagePreview(reader.result);
                    reader.readAsDataURL(file);
                  } else {
                    setImagePreview(null);
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                disabled={isSubmitting}
              />
              <ErrorMessage
                name="image"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Blog preview"
                    className="w-full max-h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </div> */}

            {/* Thumbnail Image */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFieldValue("thumbnailImage", file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setThumbPreview(reader.result);
                    reader.readAsDataURL(file);
                  } else {
                    setThumbPreview(null);
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                disabled={isSubmitting}
              />
              <ErrorMessage
                name="thumbnailImage"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
              {thumbPreview && (
                <div className="mt-4">
                  <img
                    src={thumbPreview}
                    alt="Thumbnail preview"
                    className="w-full max-h-40 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </div> */}

            {/* Submit Button */}
            <div className="flex ">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Saving..." : "Add Task"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTask;
