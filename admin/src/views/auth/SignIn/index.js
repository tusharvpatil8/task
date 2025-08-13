import React, { useEffect, useState } from "react";
import SignInForm from "./SignInForm";
import { isAdminExists } from "service/authService";
import { Spinner } from "components/ui";
import SignUpForm from "../SignUp/SignUpForm";

const SignIn = () => {
  const [checkAdminExists, setCheckAdminExists] = useState();
  const [loading, setLoading] = useState(false);
  const checkIsAdminExist = async () => {
    try {
      setLoading(true);

      const resp = await isAdminExists();

      if (resp?.success) setCheckAdminExists(true);
      else setCheckAdminExists(false);
    } catch (err) {
      console.error("Failed to fetch admin count:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkIsAdminExist();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Spinner size={30} />
        </div>
      ) : (
        <>
          {checkAdminExists ? (
            <SignInForm disableSubmit={false} />
          ) : (
            <SignUpForm
              disableSubmit={false}
              checkIsAdminExist={checkIsAdminExist}
            />
          )}
        </>
      )}
    </>
  );
};

export default SignIn;
