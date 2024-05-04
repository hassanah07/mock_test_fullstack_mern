const mongoose = require("mongoose");
const reqURI = process.env.MONGO_URI;

const connectToMongoose = async () => {
  try {
    const connect = await mongoose.connect(reqURI);
    if (!connect) {
      console.log("problem connecting to Mongoose");
    } else {
      console.log("Database Connection Successful");
      errorStatus = false;
    }
  } catch (error) {
    if (error) {
      console.log("retrying in 2 Second");
      setTimeout(connectToMongoose, 2000);
    }
  }
};

module.exports = connectToMongoose;
