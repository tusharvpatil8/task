import { useSelector, useDispatch } from "react-redux";
import { setUser, initialState } from "store/auth/userSlice";
import {
  onSignInSuccess,
  // onSignInSuccess,
  onSignOutSuccess,
  setPermissions,
} from "store/auth/sessionSlice";
import appConfig from "configs/app.config";
import { useNavigate } from "react-router-dom";
import { login } from "service/authService";
import { REDIRECT_URL_KEY } from "constants/app.constant";
import useQuery from "./useQuery";
// import { login } from "service/authService";

function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery();

  const { token, signedIn, expired } = useSelector(
    (state) => state.auth.session
  );
  const signIn = async (data) => {
    try {
      const resp = await login(data);
      if (resp?.success) {
        console.log("resp");
        const token = resp?.token;
        console.log("token", token);
        dispatch(onSignInSuccess(token));
        dispatch(
          setUser({
            id: resp?.data.id ? resp?.data.id : "",
            name: resp?.data.name ? resp?.data.name : "user",
            email: resp?.data.email ? resp?.data.email : "",
            role: resp?.data?.role?.role ? resp?.data?.role : "",
            code: resp?.data?.userCode ? resp?.data?.userCode : "",
            authority: resp?.data?.role?.role
              ? resp?.data.role.role.split(" ")
              : [""],
            token: resp?.data?.token ? resp?.data?.token : "",
          })
        );
        const redirectUrl = query.get(REDIRECT_URL_KEY);

        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);

        return {
          status: "success",
          message: "login done",
        };
      } else {
        return {
          status: "failed",
          message:
            resp?.message || "Failed to log in, Please Check Your Credentials",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: "failed",
        message:
          err?.response?.data?.error?.message ||
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err.toString(),
      };
    }
  };

  const handleSignOut = () => {
    dispatch(setPermissions());
    dispatch(onSignOutSuccess());
    dispatch(setUser(initialState));
    navigate(appConfig.unAuthenticatedEntryPath);
  };

  const signOut = async () => {
    handleSignOut();
  };

  return {
    authenticated: token && signedIn === true,
    // authenticated: true,
    signIn,
    signOut,
  };
}

export default useAuth;
