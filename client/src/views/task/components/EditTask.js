import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { getSingleTaskDetail, editTask } from "../../../services/taskService";
import { uploadSingleImage } from "../../../services/commonService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormField from "../../../components/ui/formField";
import FileUploadField from "../../../components/ui/fileUploadField";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  publishedDate: Yup.date().required("Publish Date is required"),
  author: Yup.string().required("Author is required"),
  image: Yup.string().required("Image is required"),
  thumbnailImage: Yup.string().required("Author Image is required"),
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

  const [imagePreview, setImagePreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);

  const getTaskDetailById = async () => {
    try {
      const resp = await getSingleTaskDetail(taskId);
      if (resp?.success) {
        setInitialValues({
          title: resp.data.title || "",
          content: resp.data.content || "",
          publishedDate: resp.data.publishedDate || "",
          author: resp.data.author || "",
          image: resp.data.image || null,
          thumbnailImage: resp.data.thumbnailImage || null,
        });

        // Set previews for existing images
        if (resp.data.image) setImagePreview(resp.data.image);
        if (resp.data.thumbnailImage) setThumbPreview(resp.data.thumbnailImage);
      }
    } catch (err) {
      console.error("Error fetching task:", err);
      toast.error("Failed to load task details");
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailById();
    }
  }, [taskId]);

  const handleFileChange = (e, setFieldValue, setPreview, fieldName) => {
    const file = e.target.files[0];
    setFieldValue(fieldName, file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveImage = (setFieldValue, setPreview, fieldName) => {
    setFieldValue(fieldName, null);
    setPreview(null);
  };

  const createFormData = (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return formData;
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    try {
      const [imageResp, thumbResp] = await Promise.all([
        values.image instanceof File
          ? uploadSingleImage(createFormData(values.image))
          : Promise.resolve({ data: values.image }),
        values.thumbnailImage instanceof File
          ? uploadSingleImage(createFormData(values.thumbnailImage))
          : Promise.resolve({ data: values.thumbnailImage }),
      ]);

      const payload = {
        title: values.title,
        content: values.content,
        publishedDate: values.publishedDate,
        author: values.author,
        image: imageResp.data,
        thumbnailImage: thumbResp.data,
      };

      const resp = await editTask(taskId, payload);
      if (resp?.success) {
        toast.success(resp.message || "Task updated successfully!");
        if (onClose) onClose();
        else navigate(-1);
      } else {
        toast.error(resp.message || "Failed to update task");
      }
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container p-4  mx-auto">
      {/* <ToastContainer /> */}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, isSubmitting, values, resetForm }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <FormField
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Enter title"
                  disabled={isSubmitting}
                />
              </div>

              {/* Content */}
              <div className="md:col-span-2">
                <FormField
                  as="textarea"
                  label="Content"
                  name="content"
                  placeholder="Write blog content..."
                  rows="4"
                  disabled={isSubmitting}
                />
              </div>

              {/* Author */}
              <div>
                <FormField
                  label="Author"
                  name="author"
                  type="text"
                  placeholder="Author name"
                  disabled={isSubmitting}
                />
              </div>

              {/* Published Date */}
              <div>
                <FormField
                  label="Publish Date"
                  name="publishedDate"
                  type="date"
                  disabled={isSubmitting}
                />
              </div>

              {/* Blog Image */}
              <div>
                <FileUploadField
                  label="Blog Image"
                  name="image"
                  preview={imagePreview}
                  currentFile={values.image}
                  onChange={(e) =>
                    handleFileChange(e, setFieldValue, setImagePreview, "image")
                  }
                  onRemove={() =>
                    handleRemoveImage(setFieldValue, setImagePreview, "image")
                  }
                  disabled={isSubmitting}
                />
              </div>

              {/* Thumbnail Image */}
              <div>
                <FileUploadField
                  label="Thumbnail Image"
                  name="thumbnailImage"
                  preview={thumbPreview}
                  currentFile={values.thumbnailImage}
                  onChange={(e) =>
                    handleFileChange(
                      e,
                      setFieldValue,
                      setThumbPreview,
                      "thumbnailImage"
                    )
                  }
                  onRemove={() =>
                    handleRemoveImage(
                      setFieldValue,
                      setThumbPreview,
                      "thumbnailImage"
                    )
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setImagePreview(null);
                  setThumbPreview(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white  transition"
                disabled={isSubmitting}
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-md transition ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Updating..." : "Update Task"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};



export default EditTask;
