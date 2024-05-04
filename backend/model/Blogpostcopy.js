const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogpostSchema = new Schema(
  {
    chat: {},
    studentData: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        // required: true,
      },
      name: {
        type: "String",
        required: true
      },
      profileId: {
        type: "String",
        required: true
      }
    },
    chatId: {
      type: "String",
      required: true
      // unique: true
    },
    updateId: {
      type: "String"
      // unique: true
    }
  },
  { timestamps: true }
);

const Blogpost = mongoose.model("Blogpost", BlogpostSchema);
module.exports = Blogpost;
