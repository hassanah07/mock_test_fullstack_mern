const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
      // max: [10, "set a 10 digit mobile number"],
    },
    password: {
      type: String,
      required: true,
      min: [6, "set a long password"],
    },
    otp: {
      type: Number,
      // required: true,
      // unique: true,
    },
    image: {
      type: String,
      default:
        "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg",
    },
    role: {
      type: String,
      default: "Admin",
    },
    status: {
      type: Boolean,
      default: 0,
    },
    login: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
