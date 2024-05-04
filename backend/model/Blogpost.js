const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogpostSchema = new Schema(
  {
    heading: {
      type: "String",
      require: true
    },
    content: {},
    contentTwo: {},
    contentThree: {},
    author: {
      type: "String",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
      // required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
      // required: true,
    },

    blogId: {
      type: "String",
      required: true
      // unique: true
    },
    updateId: {
      type: "String"
      // unique: true
    },
    status: {
      type: Boolean,
      default: 0
    },
    deleted: {
      type: Boolean,
      default: 0
    },
    withdrawn: {
      type: Boolean,
      default: 0
    },
    slug: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
      // default: "career",
    },
    desc: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    step: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Blogpost = mongoose.model("Blogpost", BlogpostSchema);
module.exports = Blogpost;
