const User = require("../../model/user.model");
const userServices = require("../../services/user.services");
const randomstring = require(`randomstring`);
const bcrypt = require("bcrypt");
const { signAccessToken } = require("../../middleware/auth.token");

module.exports = {
  registerUser: async (req, res, next) => {

    try {
      const request_body = req?.body;
      console.log("request_body", request_body);

      const checkEmail = await userServices.checkEmail(request_body.email);
      if (checkEmail)
        return res.json({
          status: false,
          message:
            "A user with this email already exists. Please try using a different email to sign up or log in using the existing account.",
        });
      request_body.user_id = randomstring.generate(17);

      const salt = await bcrypt.genSalt(10);
      request_body.password = await bcrypt.hash(
        request_body?.password?.toString(),
        salt
      );

      const result = await userServices.addUserData(
        request_body.user_id,
        request_body.email,
        request_body
      );
      console.log("result", result);
      res.status(200).json({
        status: true,
        message: "User Created Successfully",
        data: result,
      });
    } catch (error) {
      console.log(`addNewUserr: `, error);

      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const userData = await userServices.findUserByEmail(email);
      if (!userData) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const isValid = await userServices.isValidPasswordByUser(
        userData,
        password
      );
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid Credentials. Please check your email and password.",
        });
      }

      const payload = {
        email: userData.email,
        role: userData.role,
        user_id: userData.user_id,
        recordId: userData._id,
      };
      const token = await signAccessToken(payload, "1d");

      let finalUserData = userData;
      if (!userData.active) {
        finalUserData = await userServices.findUserByIdAndActivate(
          userData._id
        );
        if (!finalUserData) {
          return res.status(500).json({
            success: false,
            message: "Something went wrong. Failed to login.",
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: "User logged in successfully.",
        data: finalUserData,
        token,
      });
    } catch (err) {
      next(err);
    }
  },
};
