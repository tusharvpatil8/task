import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signUp } from "@/services/authService"; 
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

const signupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Signup = ({ onSwitchToLogin, onClose }) => { // Added onClose prop for consistency
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const signUpData = {
        user_name: values.name,
        email: values.email,
        role: values.role || "user",
        password: values.password,
      };

      const result = await signUp(signUpData);

      if (result?.status) {
        toast.success(result?.message || "Account created successfully!");
        resetForm();
        if (onSwitchToLogin) onSwitchToLogin();
        if (onClose) onClose(); // Added optional onClose call
      } else {
        toast.error(result?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Create Account ✨
      </h1>
      <p className="text-gray-500 mb-6">Join us and get started today.</p>

      {/* Form */}
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={signupSchema}
        onSubmit={handleSignup}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm font-semibold mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm font-semibold mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="* * * * * * * *"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm font-semibold mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Field
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="* * * * * * * *"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm font-semibold mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading || isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>

      <p className="mt-4 text-center text-gray-600 text-sm">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-black font-bold hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;