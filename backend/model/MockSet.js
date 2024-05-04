const mongoose = require("mongoose");
const { Schema } = mongoose;

const MockSetSchema = new Schema(
  {
    heading: {
      type: String,
      require: true
    },
    subject: {
      type: String,
      required: true
    },
    mockSetId: {
      type: Number,
      required: true
    },
    mentor: {
      type: String,
      required: true
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor"
    },
    studentData: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student"
        },
        isStarted: {
          type: Boolean,
          default: 0
        },
        isFinish: {
          type: Boolean,
          default: 0
        },
        isPurschase: {
          type: Boolean,
          default: 0
        },
        score: {
          type: Number,
          default: 0
        }
      }
    ],
    mockId: {
      type: Number,
      required: true
    },
    updateId: {
      type: Number
    },
    price: {
      type: Number,
      default: 0
    },
    status: {
      type: Boolean,
      default: 0
    },
    adminApproval: {
      type: Boolean,
      default: 1
    },
    embedLink: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const MockSet = mongoose.model("MockSet", MockSetSchema);
module.exports = MockSet;
