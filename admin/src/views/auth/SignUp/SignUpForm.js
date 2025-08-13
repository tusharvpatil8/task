import React from "react";
import {
  Input,
  Button,
  FormItem,
  FormContainer,
  Alert,
  toast,
  Notification,
} from "components/ui";
import { PasswordInput, ActionLink } from "components/shared";
import useTimeOutMessage from "utils/hooks/useTimeOutMessage";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { onSignInSuccess } from "store/auth/sessionSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "store/auth/userSlice";
import appConfig from "configs/app.config";
import { signUp } from "service/authService";

const validationSchema = Yup.object().shape({
  admin_name: Yup.string().required("Please enter your user name"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Your passwords do not match"
  ),
});

const SignUpForm = (props) => {
  const {
    disableSubmit = false,
    checkIsAdminExist,
    className,
    signInUrl = "/sign-in",
  } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useTimeOutMessage();

  const onSignUp = async (values, setSubmitting) => {
    const { email, password } = values;
    setSubmitting(true);
    try {
      console.log("0");

      const resp = await signUp({ email, password });
      console.log("0", resp);
      if (resp?.status) {
        setSubmitting(false);
        const { token } = resp.data;
        dispatch(onSignInSuccess(token));
        if (resp.user) {
          dispatch(
            setUser(
              resp.user || {
                avatar: "",
                admin_name: "Anonymous",
                authority: ["USER"],
                email: "",
              }
            )
          );
        }
        navigate(appConfig.tourPath);
        toast.push(
          <Notification
            title={"Admin account created successfully"}
            type="success"
            duration={2000}
          ></Notification>
        );
        checkIsAdminExist();
      } else {
        setSubmitting(false);
        setMessage(resp.data.message);
      }
    } catch (errors) {
      setMessage(errors?.response?.data?.message || errors.toString());
      setSubmitting(false);
    }
  };

  return (
    <div className={className}>
      {message && (
        <Alert className="mb-4" type="danger" showIcon>
          {message}
        </Alert>
      )}
      <Formik
        initialValues={{
          admin_name: "admin",
          password: "Admin@123",
          confirmPassword: "Admin@123",
          email: "admin@yopmail.com",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSignUp(values, setSubmitting);
          } else {
            setSubmitting(false);
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Name"
                invalid={errors.admin_name && touched.admin_name}
                errorMessage={errors.admin_name}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="admin_name"
                  placeholder="User Name"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Email"
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
              >
                <Field
                  type="email"
                  autoComplete="off"
                  name="email"
                  placeholder="Email"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Password"
                invalid={errors.password && touched.password}
                errorMessage={errors.password}
              >
                <Field
                  autoComplete="off"
                  name="password"
                  placeholder="Password"
                  component={PasswordInput}
                />
              </FormItem>
              <FormItem
                label="Confirm Password"
                invalid={errors.confirmPassword && touched.confirmPassword}
                errorMessage={errors.confirmPassword}
              >
                <Field
                  autoComplete="off"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  component={PasswordInput}
                />
              </FormItem>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
              <div className="mt-4 text-center">
                <span>Already have an account? </span>
                <ActionLink to={signInUrl}>Sign in</ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUpForm;
