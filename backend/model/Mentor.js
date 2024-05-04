const mongoose = require("mongoose");
const { Schema } = mongoose;

const MentorSchema = new Schema(
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
    role: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      default: 0
    },
    deleted: {
      type: Boolean,
      default: 0
    },
    profileId: {
      type: Number
    }
  },
  { timestamps: true }
);

const Mentor = mongoose.model("Mentor", MentorSchema);
module.exports = Mentor;
