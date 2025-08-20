import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify"; // removed ToastContainer here
import { uploadSingleImage } from "../../../services/commonService";
import { addTask } from "../../../services/taskService";
import FormField from "../../../components/ui/formField";
import FileUploadField from "../../../components/ui/fileUploadField";
import { useNavigate } from "react-router-dom";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  author: Yup.string().required("Author is required"),
  publishedDate: Yup.date().required("Publish Date is required"),
  image: Yup.mixed().required("Image is required"),
  thumbnailImage: Yup.mixed().required("Author Image is required"),
});

// ✅ Initial Values
const initialValues = {
  title: "",
  content: "",
  author: "",
  publishedDate: "",
  image: null,
  thumbnailImage: null,
};

// ✅ Helpers moved outside component
const createFormData = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return formData;
};

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

const AddTask = ({ onClose }) => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);

  const onSave = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const [imageResp, thumbResp] = await Promise.all([
        uploadSingleImage(createFormData(values.image)),
        uploadSingleImage(createFormData(values.thumbnailImage)),
      ]);

      const payload = {
        title: values.title,
        publishedDate: values.publishedDate,
        content: values.content,
        author: values.author,
        image: imageResp?.data,
        thumbnailImage: thumbResp?.data,
      };

      const resp = await addTask(payload);

      if (resp?.success) {
        toast.success(resp.message || "Task created successfully!");
        resetForm();
        setImagePreview(null);
        setThumbPreview(null);
        onClose ? onClose() : navigate(-1);
      } else {
        toast.error(resp.message || "Failed to add task");
      }
    } catch (err) {
      console.error("Error while saving task:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container p-4 mx-auto">

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSave}
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
                  placeholder="Write task content..."
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

              {/* Task Image */}
              <div>
                <FileUploadField
                  label="Task Image"
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
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white transition"
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
