import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { signIn } from "@/services/authService";
import {
  onSignInSuccess,
  onSignOutSuccess,
} from "@/store/slices/auth/sessionSlice";
import { setUser, initialState } from "@/store/slices/auth/userSlice";
import { toast } from "react-toastify";

function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { token, signedIn, expired } = useSelector(
    (state) => state.auth.session
  );

  // Sign In
  const userSignIn = async (data) => {
    try {
      const loginData = {
        email: data.email,
        password: data.password,
      };

      const loginResp = await signIn(loginData);

      if (loginResp?.success) {
        const userData = loginResp?.data;

        dispatch(setUser(userData));
        dispatch(onSignInSuccess(loginResp.token));

        return {
          success: true,
          message: loginResp?.message,
          user: userData,
          token: loginResp.token,
        };
      } else {
        toast.error(loginResp?.message);
        return {
          status: false,
          message: loginResp?.message,
        };
      }
    } catch (err) {
      console.error(err);
      return {
        status: false,
        message:
          err?.response?.data?.error?.message ||
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err.toString(),
      };
    }
  };

  // Sign Out
  const handleSignOut = () => {
    dispatch(onSignOutSuccess());
    dispatch(setUser(initialState));
    router.push("/");
  };

  const userSignOut = async () => {
    handleSignOut();
  };

  return {
    authenticated: token && signedIn && expired > new Date().getTime(),
    userSignIn,
    userSignOut,
  };
}

export default useAuth;
