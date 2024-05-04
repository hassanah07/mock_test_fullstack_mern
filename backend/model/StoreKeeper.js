const mongoose = require("mongoose");
const { Schema } = mongoose;

const StoreKeeper = new Schema(
  {
    storeName: {
      type: String,
      required: true
    },
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
      required: true
    },
    password: {
      type: String,
      required: true
      // min: [6, "set a long password"]
    },
    image: {
      type: String,
      default:
        "https://greenacresportsmed.com.au/wp-content/uploads/2018/01/dummy-image.jpg"
    },
    role: {
      type: String,
      default: "admin"
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
    storeId: {
      type: Number,
      required: true
    },
    storeType: {
      type: String
    },
    status: {
      type: Boolean,
      required: true,
      default: false
    },
    isLocked: {
      type: Boolean,
      required: true,
      default: false
    },
    isPurched: {
      type: Boolean,
      required: true,
      default: false
    },
    trailDate: {
      type: Date
    },
    isTrail: {
      type: Boolean,
      required: true,
      default: false
    },
    trailStarted: {
      type: Boolean,
      required: true,
      default: false
    },
    trailDate: {
      type: Date
    },
    token: {
      type: String
    },
    isOperator: {
      type: Boolean,
      required: true,
      default: false
    },
    lastPrice: {
      type: String
    }
  },
  { timestamps: true }
);

const keeper = mongoose.model("keeper", StoreKeeper);
module.exports = keeper;
