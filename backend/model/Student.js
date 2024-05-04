const mongoose = require("mongoose");
const { Schema } = mongoose;

const StudentSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    mobile: {
      type: Number,
      required: true,
      unique: true
      // max: [10, "set a 10 digit mobile number"],
    },
    password: {
      type: String,
      required: true,
      min: [6, "set a long password"]
    },
    image: {
      type: String,
      default:
        "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
    },
    desc: {
      type: String
    },
    role: {
      type: String,
      default: "Student"
    },
    deleted: {
      type: Boolean,
      default: 0
    },
    studentToken: {
      type: String
    },
    loginStatus: {
      type: Boolean
    },
    profileId: {
      type: Number
    }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
