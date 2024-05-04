const mongoose = require("mongoose");
const { Schema } = mongoose;

const MockSolutionSchema = new Schema(
  {
    solution: {},
    questionSetId: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true
    },
    questionId: {
      type: String,
      required: true
    },
    solutionId: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const MockSolution = mongoose.model("MockSolution", MockSolutionSchema);
module.exports = MockSolution;
