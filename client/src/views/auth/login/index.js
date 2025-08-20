import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuth from "../../../utils/hooks/useAuth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import appConfig from "../../../configs/app.config";
import { useNavigate } from "react-router-dom";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = ({ onSwitchToSignup, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { userSignIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const loginData = { email, password };
      const result = await userSignIn(loginData);

      if (result?.success) {
        toast.success(result?.message);
        resetForm();
        onClose?.();
        navigate(appConfig.taskEntryPath);

      } else {
        toast.error(result.message);
      }

    } catch (error) {
      console.error("Login error:", error.message || error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back 👋</h1>
      <p className="text-gray-500 mb-6">
        Please log in to access your account.
      </p>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-2">
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
                placeholder="test@yopmail.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm font-semibold mt-1"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block font-medium text-gray-700 mb-1"
              >
                Password
              </label>
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
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm font-semibold mt-1"
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-black font-bold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading || isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>

      <p className="mt-4 text-center text-gray-600 text-sm">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-black font-bold hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
