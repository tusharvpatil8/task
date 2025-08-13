const mongoose = require(`mongoose`);
const { USER_ROLE } = require("../../server/constants/role.constants");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    user_id: {
      type: String,
      unique: true,
      required: [true, `user Id is required`],
      trim: true,
    },
    user_name: {
      type: String,
      // required: [true, `Name is required`],
      trim: true,
    },
    email: {
      type: String,
      required: [true, `Email is required`],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: USER_ROLE,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: `https://api.dicebear.com/7.x/adventurer/svg?seed=user`,
      trim: true,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(this.password, salt);
    this.password = securePassword;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model(`users`, userSchema);
