const jwt = require("jsonwebtoken");
const { findAdminByEmailAndRole } = require("../services/admin.services");
const { JWT_SECRET_KEY } = require("../constants/env.constant");

module.exports = {
  signAccessToken: async (payload, time) => {
    return new Promise((resolve, reject) => {
      const options = {
        issuer: "NodeBackendBoiler",
        audience: [payload.admin_id],
      };
      if (time) {
        options["expiresIn"] = time;
      }
      jwt.sign(payload, JWT_SECRET_KEY, options, async (err, token) => {
        if (err) {
          return reject(err);
        }
        return resolve(token);
      });
    });
  },
  isAdminAuthenticated: async (req, res, next) => {
    try {
      const authToken = req.headers["authorization"];
      console.log("authToken", authToken);
      if (!authToken) {
        return res.status(401).json({
          success: false,
          isAuth: false,
          message: "Invalid Token Or Expired!",
        });
      }
      const [bearer, token] = authToken.split(" ");

      if (!token) {
        return res.status(401).json({
          success: false,
          isAuth: false,
          message: "Invalid Token Or Expired!",
        });
      }

      jwt.verify(token, JWT_SECRET_KEY, async (error, payload) => {
        if (error) {
          return res.status(401).json({
            success: false,
            isAuth: false,
            message: "Invalid Token Or Expired!",
          });
        }
        let { email, role, userId, recordId } = payload;

        if (!email || !role || !userId || !recordId) {
          return res.status(401).json({
            success: false,
            isAuth: false,
            message: "Invalid Token Or Expired!",
          });
        }
        const adminData = await findAdminByEmailAndRole(email);

        if (
          !adminData ||
          adminData.active === false ||
          adminData?.uniqueId !== userId
        ) {
          return res.status(401).json({
            success: false,
            isAuth: false,
            message: "Invalid Token Or Expired!",
          });
        }
        req.payload = payload;
        next();
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        isAuth: false,
        message: "Invalid Token Or Expired!",
      });
    }
  },
  isUserAuthenticated: async (req, res, next) => {
    try {
      const authToken = req.headers["authorization"];
      if (!authToken) {
        return res.status(401).json({
          success: false,
          isAuth: false,
          message: "Invalid Token Or Expired!",
        });
      }
      const [bearer, token] = authToken.split(" ");

      if (!token) {
        return res.status(401).json({
          success: false,
          isAuth: false,
          message: "Invalid Token Or Expired!",
        });
      }

      jwt.verify(token, JWT_SECRET_KEY, async (error, payload) => {
        if (error) {
          return res.status(401).json({
            success: false,
            isAuth: false,
            message: "Invalid Token Or Expired!",
          });
        }
        let { email, role, userId, recordId } = payload;

        if (!email || !role || !userId || !recordId) {
          return res.status(401).json({
            success: false,
            isAuth: false,
            message: "Invalid Token Or Expired!",
          });
        }

        const userData = await findUserByEmailAndRole(email, role);

        if (!userData || userData?.uniqueId !== userId) {
          return res.status(401).json({
            success: false,
            isAuth: false,
            message: "Invalid Token Or Expired!",
          });
        }

        req.payload = payload;
        next();
      });
    } catch (err) {
      res.status(401).json({
        success: false,
        isAuth: false,
        message: "Invalid Token Or Expired!",
      });
    }
  },
};
