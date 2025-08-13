const createError = require("http-errors");
const adminServices = require("../../services/admin.services");
const randomstring = require(`randomstring`);
const bcrypt = require("bcrypt");
const { signAccessToken } = require("../../middleware/auth.token");

module.exports = {
  findAdmin: async (req, res, next) => {
    try {
      console.log("adminData:");

      const adminData = await adminServices.findAdminbyRole();
      console.log("adminData:", adminData);
      if (!adminData) {
        return res.status(200).json({
          success: false,
          message: "Admin Is Not Exists",
        });
      }
      res.status(200).json({
        success: true,
        message: "Successfully Fetched Admin Data",
        data: adminData,
      });
    } catch (err) {
      next(err);
    }
  },
  createAdmin: async (req, res, next) => {
    console.log("request_body");

    try {
      const request_body = req?.body;
      const checkEmail = await adminServices.checkEmail(request_body.email);
      if (checkEmail)
        return res.json({
          status: false,
          message:
            "A user with this email already exists. Please try using a different email to sign up or log in using the existing account.",
        });
      request_body.admin_id = randomstring.generate(17);

      const salt = await bcrypt.genSalt(10);
      request_body.password = await bcrypt.hash(
        request_body?.password?.toString(),
        salt
      );

      const result = await adminServices.addAdminData(
        request_body.admin_id,
        request_body.email,
        request_body
      );
      console.log("result", result);
      res.status(200).json({
        status: true,
        message: "Admin Is Created Successfully",
        data: result,
      });
    } catch (error) {
      console.log(`addNewAdmin error: `, error);

      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const adminData = await adminServices.findAdminByEmail(req.body.email);
      console.log(`adminData-------: `, adminData);

      if (!adminData) {
        throw createError.NotFound("Invalid Credentials");
      }
      const isValid = await adminServices.isValidPasswordByAdmin(
        adminData,
        req.body.password
      );
      console.log(`isValid-------: `, isValid);

      if (!isValid) {
        throw createError.NotFound("Invalid Credentials");
      }

      let payload = {
        email: adminData.email,
        role: adminData.role,
        admin_id: adminData.admin_id,
        recordId: adminData._id,
      };

      let time = "1d";
      const token = await signAccessToken(payload, time);
      console.log(`token-------: `, token);

      if (adminData.active === false) {
        const activatedAdmin = await adminServices.findAdminByIdAndActivate(
          adminData._id
        );
        if (!activatedAdmin) {
          throw createError.BadGateway(
            "Something went wrong. Failed to login."
          );
        }
        return res.status(200).json({
          success: true,
          message: "Successfully Logged In To Your Account",
          data: activatedAdmin,
          token: token,
        });
      }

      res.status(200).json({
        success: true,
        message: "Successfully Logged In To Your Account",
        data: adminData,
        token: token,
      });
    } catch (err) {
      next(err);
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      const reqData = req.body;
      console.log("reqData", reqData);
      const user = await adminServices.handleForgotPassword(reqData);
      return res.status(200).send({
        success: true,
        message: "Mail for Password Reset is Sent to your Email.",
      });
    } catch (err) {
      next(err);
    }
  },
  resetForgottenPassword: async (req, res, next) => {
    try {
      const token = req.params.token;
      const HOST = process.env.ADMIN_HOST;
      let serviceRes = await adminServices.handleResetPassword(token);

      if (!serviceRes) {
        return res.status(401).send({
          success: false,
          message: "Your Token has expired. Please try again.",
        });
      }
      console.log(`${HOST}/reset-password/${token}`);
      return res.redirect(`${HOST}/reset-password/${token}`);
    } catch (err) {
      next(err);
    }
  },
};
