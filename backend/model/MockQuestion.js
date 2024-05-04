const mongoose = require("mongoose");
const { Schema } = mongoose;

const MockQuestionSchema = new Schema(
  {
    question: {},
    selection: {
      one: {
        isCorrect: {
          type: Boolean,
          default: false
        },
        option: {
          type: String,
          required: true
        }
      },
      two: {
        isCorrect: {
          type: Boolean,
          default: false
        },
        option: {
          type: String,
          required: true
        }
      },
      three: {
        isCorrect: {
          type: Boolean,
          default: false
        },
        option: {
          type: String,
          required: true
        }
      },
      four: {
        isCorrect: {
          type: Boolean,
          default: false
        },
        option: {
          type: String,
          required: true
        }
      }
    },
    mark: {
      type: Number,
      default: 2
    },
    questionSetId: {
      type: String,
      required: true
    },
    questionId: {
      type: String,
      required: true
    },
    studentData: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student"
        },
        one: {
          type: Boolean
        },
        two: {
          type: Boolean
        },
        three: {
          type: Boolean
        },
        four: {
          type: Boolean
        },
        isFinish: {
          type: Boolean,
          default: false
        },
        isSolved: {
          type: Boolean,
          default: false
        }
        // isCorrect: {
        //   type: Boolean,
        //   default: false
        // }
      }
    ],
    updateId: {
      type: String
      // unique: true
    },
    isSolved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const MockQuestion = mongoose.model("MockQuestion", MockQuestionSchema);
module.exports = MockQuestion;
