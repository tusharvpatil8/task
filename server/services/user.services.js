const User = require("../model/user.model");

module.exports = {
  addUserData: async (user_id, email, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        await User.updateOne({ user_id, email }, { ...data }, { upsert: true });
        return resolve(
          await User.find(
            { user_id },
            { createdAt: 0, updatedAt: 0, __v: 0, _id: 0 }
          )
        );
      } catch (error) {
        console.log("addUserData service error  : ", error);
        return reject(false);
      }
    });
  },

  checkEmail: async (email, active = true) => {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(await User.countDocuments({ email, active }));
      } catch (error) {
        console.log("checkEmail service error  : ", error);
        return reject(false);
      }
    });
  },

  findUserByEmail: async (email) => {
    try {
      return await User.findOne({ email });
    } catch (err) {
      throw err;
    }
  },

  isValidPasswordByUser: async (data, password) => {
    try {
      return await User(data).isValidPassword(password);
    } catch (err) {
      throw err;
    }
  },

  findUserByIdAndActivate: async (id) => {
    try {
      return await User.findByIdAndUpdate(id, { active: true }, { new: true });
    } catch (err) {
      throw err;
    }
  },
};
