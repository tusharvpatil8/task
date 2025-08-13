const { generateUniqueID } = require("../helpers/generater");
const { ADMIN_ROLE } = require("../constants/role.constants");
const Admin = require("../model/admin.model");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const createError = require("http-errors");

module.exports = {
  // ---------------- Find One Data --------------------------------------
  findAdminbyRole: async () => {
    try {
      return await Admin.findOne({ role: ADMIN_ROLE });
    } catch (err) {
      throw err;
    }
  },
  findAdminByEmail: async (email) => {
    try {
      return await Admin.findOne({ email });
    } catch (err) {
      throw err;
    }
  },
  findAdminByEmailAndRole: async (email) => {
    try {
      return await Admin.findOne({ email, role: ADMIN_ROLE });
    } catch (err) {
      throw err;
    }
  },
  // ------------------ Create One Data --------------------------------------
  createAdmin: async (reqBody) => {
    try {
      const uniqueId = generateUniqueID();
      return await Admin.create({ ...reqBody, admin_id });
    } catch (err) {
      throw err;
    }
  },
  // ------------------ Validate One Data -----------------------------------------
  isValidPasswordByAdmin: async (data, password) => {
    try {
      return await Admin(data).isValidPassword(password);
    } catch (err) {
      throw err;
    }
  },
  // ------------------ Update One Data -----------------------------------------
  findAdminByIdAndActivate: async (id) => {
    try {
      return await Admin.findByIdAndUpdate(id, { active: true }, { new: true });
    } catch (err) {
      throw err;
    }
  },
  //-------------------------- Forgot password ---------------------------------
  // handleForgotPassword: async (data) => {
  //   try {
  //     const admin = await Admin.findOne({
  //       email: data.email,
  //     });

  //     if (!admin) throw createError.BadRequest("Invalid Email.");

  //     const token = uuidv4();
  //     admin.token = token;
  //     await admin.save();

  //     const email = admin.email;
  //     const subject = "Your Password Reset Link";
  //     const host = process.env.SERVER_HOST;
  //     const html = `<!DOCTYPE html>
  //     <html lang="en">
  //     <head>
  //       <meta charset="UTF-8">
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //       <title>Password Reset</title>
  //       <style>
  //         body {
  //           font-family: Arial, sans-serif;
  //           margin: 0;
  //           padding: 0;
  //         }
  //         .container {
  //           max-width: 600px;
  //           margin: 0 auto;
  //           padding: 20px;
  //         }
  //         .header {
  //           background-color: #4CAF50;
  //           color: white;
  //           padding: 20px;
  //           text-align: center;
  //         }
  //         .content {
  //           padding: 20px;
  //         }
  //         .button {
  //           background-color: #4CAF50;
  //           color: white;
  //           text-decoration: none;
  //           padding: 10px 20px;
  //           border-radius: 5px;
  //           display: inline-block;
  //         }
  //         .button:hover {
  //           background-color: #45a049;
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="container">
  //         <div class="header">
  //           <h1>Password Reset</h1>
  //         </div>
  //         <div class="content">
  //           <p>Hello,</p>
  //           <p>You requested a password reset for your account. To reset your password, click the button below:</p>
  //           <a href="${host}/admin/reset-password/${token}" class="button">Reset Password</a>
  //           <p>If you didn't request a password reset, you can ignore this email.</p>
  //           <p>Thanks,</p>
  //           <p>Your Website Team</p>
  //         </div>
  //       </div>
  //     </body>
  //     </html>
  //     `;

  //     const { status } = await sendEmail(email, subject, html);

  //     if (!status) return false;
  //     return true;
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  //-------------------------- Reset password ---------------------------------

  handleResetPassword: async (token) => {
    try {
      const admin = await Admin.findOne({ where: { token } });
      if (!admin) return false;
      return true;
    } catch (err) {
      throw err;
    }
  },

  findAdminByEmailAndUpdate: async (email, password) => {
    try {
      const securePassword = await bcrypt.hash(password, 10);
      return await Admin.findOneAndUpdate(
        { email: email },
        { $set: { password: securePassword } },
        { new: true }
      );
    } catch (err) {
      throw err;
    }
  },

  addAdminData: async (admin_id, email, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        await Admin.updateOne(
          { admin_id, email },
          { ...data },
          { upsert: true }
        );
        return resolve(
          await Admin.find(
            { admin_id },
            { createdAt: 0, updatedAt: 0, __v: 0, _id: 0 }
          )
        );
      } catch (error) {
        console.log("addAdminData service error  : ", error);
        return reject(false);
      }
    });
  },

  checkEmail: async (email, active = true) => {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(await Admin.countDocuments({ email, active }));
      } catch (error) {
        console.log("checkEmail service error  : ", error);
        return reject(false);
      }
    });
  },
};
