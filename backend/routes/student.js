const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student = require("../model/Student");
const fetchStudent = require("../middleware/fetchStudent");
const MockQuestion = require("../model/MockQuestion");
const MockSet = require("../model/MockSet");
const MockSolution = require("../model/MockSolution");

// ______________________student registration__________________________________________
router.post("/register", async (req, res) => {
  try {
    let student = await Student.findOne({ email: req.body.email });
    if (!student) {
      student = await Student.findOne({ email: req.body.mobile });
      if (!student) {
        const salt = await bcrypt.genSalt(10);
        const randPassword = `STU${Math.floor(Math.random() * 10000000)}`;
        const hashedPassword = await bcrypt.hash(randPassword, salt);
        const profileId = Math.floor(Math.random() * 20000000);
        student = await Student.create({
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          password: hashedPassword,
          profileId: profileId
        });
        // email shotting process start
        try {
          const nodemailer = require("nodemailer");
          const transporter = nodemailer.createTransport({
            host: "smtp.forwardemail.net",
            port: 465,
            secure: true,
            service: "gmail",
            auth: {
              // user: userName,
              // pass: password,
              user: process.env.MAILER_USERID,
              pass: process.env.MAILER_PASSWORD
            }
          });
          async function main() {
            const info = await transporter.sendMail({
              from: '"Server Mail"anowarulah07@gmail.com',
              to: req.body.email,
              subject: "Your Password Generated",
              html: `
        <h2><b>Congratulation! You are Enrolled as a Student at Guidewale Study Center (GSC)</b></h2>
        <b>Name :</b>${req.body.name}<br />
        <b>email :</b>${req.body.email}<br />
        <b>phone :</b>${req.body.mobile}<br />
        <b>password :</b>${randPassword}<br />
        <b>Profile ID :</b>${profileId}<br />
        <small>Login with your system generated Password</small><br />
        <small>If failed to login! Please Try to reset your password!</small>
        `
            });
            res
              .status(200)
              .json({ status: true, msg: "Account Created! Check Your Email" });
          }
          main().catch(() => {
            res.status(500).json({ status: false, mag: "Email Sending Error" });
          });
        } catch (error) {
          res
            .status(500)
            .json({ msg: "Internal Server Error for Email Service" });
        }
        // email shotting process end
      } else {
        return res.status(400).json({
          status: false,
          msg: "Your are registered already With your Number!"
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        msg: "Your are registered already With your Email!"
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: false, msg: "Main Internal Server Error! Try Again" });
  }
});

// ______________________student login ________________________________________________
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(500).json({
        status: false,
        msg: "Please Enter Cradentials"
      });
    } else {
      let student = await Student.findOne({ email: req.body.email });
      if (!student) {
        res.status(404).json({
          status: false,
          msg: "Please Enter A Valid Email"
        });
      } else {
        const passCompare = await bcrypt.compare(
          req.body.password,
          student.password
        );
        if (!passCompare)
          return res
            .status(404)
            .json({ status: false, msg: "Invalid Password" });
        if (passCompare) {
          const payload = {
            student: {
              id: student._id,
              name: student.name,
              email: student.email,
              profileId: student.profileId
            }
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 86400
            // expiresIn: 2592000
          });
          student = await Student.findOneAndUpdate(
            { profileId: student.profileId },
            { studentToken: token }
          )
            .catch((err) => {
              res.status(500).json({ status: false, msg: "failed" });
            })
            .then(
              res.status(200).json({
                status: true,
                msg: "login successful",
                learnerToken: student.studentToken
              })
            );
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Main Internal Server Error! Try Again"
    });
  }
});

// ______________________student Password Reset _______________________________________
router.post("/resetpassword", async (req, res) => {
  try {
    let student = await Student.findOne({ email: req.body.email });
    if (!student) return res.status(404).json("Please Enter A Valid Email");
    if (student) {
      if (student.profileId == req.body.profileId)
        return res
          .status(200)
          .json("Password Already Updated! Please Check Email");
      const studentId = student._id;
      const salt = await bcrypt.genSalt(10);
      const randPassword = `PMX${Math.floor(Math.random() * 10000000)}`;
      const hashedPassword = await bcrypt.hash(randPassword, salt);
      student = await Student.findByIdAndUpdate(
        { _id: studentId },
        {
          password: hashedPassword,
          profileId: req.body.profileId
        }
      );
      // email shotting process start
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.forwardemail.net",
          port: 465,
          secure: true,
          service: "gmail",
          auth: {
            user: process.env.MAILER_USERID,
            pass: process.env.MAILER_PASSWORD
          }
        });
        async function main() {
          const info = await transporter.sendMail({
            from: '"Server Mail"anowarulah07@gmail.com',
            to: req.body.email,
            subject: `Your New Password is Here ${Date.now()}`,
            html: `
        <h2><b>Hey Dear! Your Login Password is here :-</b></h2>
        <b>New Login Password :</b><b><u>${randPassword}</u></b><br />
        <small>This is an auto generated email for Extra security</small>
        `
          });
          res.status(200).json("New Password Has Been Send to Your Email");
        }
        main().catch((error) => {
          res.status(500).json("Unable To Send Email");
        });
      } catch (error) {
        res.status(500).json("E-Mail Server Error");
      }
      // email shotting process end
    }
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
});

// ______________________student Profile View__________________________________________
router.post("/profile", fetchStudent, async (req, res) => {
  const studentId = req.student.id;
  try {
    let student = await Student.findById({ _id: studentId });
    if (!student)
      return res.status(404).json({ status: false, msg: "Profile Not Found" });
    if (student) return res.status(200).json({ status: true, student });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Main Internal Server Error! Try Again"
    });
  }
});

// ______________________student Password Change __________________________________________
router.post("/changepassword", fetchStudent, async (req, res) => {
  const studentId = req.student.id;
  try {
    let student = await Student.findById({ _id: studentId });
    if (!student)
      return res.status(404).json({ status: false, msg: "Profile Not Found" });
    if (student) {
      let user = await Student.findById({ _id: studentId });
      if (!user) {
        res.status(200).json({ status: true, msg: "User Not Found" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const randPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(randPassword, salt);
        student = await Student.findByIdAndUpdate(
          { _id: studentId },
          {
            password: hashedPassword,
            profileId: req.body.profileId
          }
        );
        res.status(200).json({ status: true, msg: "Password Updated" });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: "Main Internal Server Error! Try Again"
    });
  }
});

// ______________________student Get Mock Set__________________________________________
router.post("/getmock", fetchStudent, async (req, res) => {
  const studentId = req.student.id;
  try {
    const userid = await Student.findById({ _id: studentId });
    if (!userid)
      return res.status(404).json({ status: false, msg: "Please Login Again" });
    const mockFinder = await MockSet.find({ status: true }).sort({
      updatedAt: -1
    });
    if (!mockFinder) {
      res.status(404).json({ status: false, msg: "No Mock Found" });
    } else {
      res
        .status(200)
        .json({ status: true, msg: "mock found", mock: mockFinder });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________student Chat Reply____________________________________________
router.post("/chatreply", fetchStudent, async (req, res) => {
  const studentId = req.student.id;
  res.status(200).json({ status: true, msg: "Message Sent" });
});

// ______________________student Mock Attempt__________________________________________
router.post("/mockattempt", fetchStudent, async (req, res) => {
  const studentId = req.student.id;

  try {
    const userid = await Student.findById({ _id: studentId });
    if (!userid)
      return res.status(404).json({ status: false, msg: "Please Login Again" });
    if (userid) {
      let QuestionSet = await MockSet.findOne({
        questionSetId: req.body.questionSetId
      });
      if (!QuestionSet) {
        res.status(404).json({ status: false, msg: "Mock Set Not Found" });
      } else {
        QuestionSet = await MockSet.findOneAndUpdate(
          { QuestionSetId: req.body.questionSetId },
          {
            $push: {
              studentData: {
                studentId: req.body.studentId,
                isStarted: true,
                isFinish: false,
                isPurschase: req.body.purchase
              }
            }
          }
        );
        const question = await MockQuestion.findOne({
          QuestionId: req.body.QuestionId
        });
        if (!question)
          return res
            .status(404)
            .json({ status: false, msg: "Question Not Found" });
        if (question) {
          const mock = await MockQuestion.findOneAndUpdate(
            { QuestionId: req.body.QuestionId },
            {
              $push: {
                studentData: [
                  {
                    studentId: req.body.studentId,
                    attemptedAt: req.body.option,
                    isFinish: req.body.finish
                  }
                ]
              }
              // { $addToSet: { friends: friend } } //when I need to use unique data to update
            }
          );
          res.status(200).json({ status: true, msg: "Answared" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________student Mock Attempt completed/finished_______________________
router.post("/mockattempted", fetchStudent, async (req, res) => {
  const studentId = req.student.id;
  if (!studentId)
    return res.status(404).json({ status: false, msg: "User not found" });
  try {
    QuestionSet = await MockSet.findOneAndUpdate(
      { QuestionSetId: req.body.questionSetId },
      {
        $addToSet: {
          studentData: {
            studentId: req.body.studentId,
            isStarted: true,
            isFinish: true
          }
        }
      }
    );
    res.status(200).json({ status: true, msg: "Mock Submitted!" });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________student Mock Set View ________________________________________
router.post("/getmockset", fetchStudent, async (req, res) => {
  const studentId = req.student.id;
  if (!studentId)
    return res.status(404).json({ status: false, msg: "User not found" });
  try {
    const questionSet = await MockSet.findById({ _id: req.body.id });
    res
      .status(200)
      .json({ status: true, msg: "Access Granted!", currentset: questionSet });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________student Get Mock Questions ________________________________________
router.post("/getmockquestion", fetchStudent, async (req, res) => {
  const page = parseInt(req.query.currentpage) || 1;
  const limit = parseInt(req.query.datalimit) || 1;
  const totalItems = await MockQuestion.countDocuments({
    questionSetId: req.body.setId
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  const studentId = req.student.id;
  if (!studentId)
    return res.status(404).json({ status: false, msg: "User not found" });
  try {
    const questionFinder = await MockQuestion.find({
      questionSetId: req.body.setId
    })
      .skip(skipItems)
      .limit(limit);
    res.status(200).json({
      page,
      limit,
      totalItems,
      totalPages,
      questionFinder
    });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________student Get Mock Questions ________________________________________
router.post("/getmockquestionchart", fetchStudent, async (req, res) => {
  const studentId = req.student.id;
  if (!studentId)
    return res.status(404).json({ status: false, msg: "User not found" });
  try {
    const questionFinder = await MockQuestion.find({
      questionSetId: req.body.setId
    });
    res.status(200).json(questionFinder);
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Mock Questions status ________________________________________
router.post("/getmockquestionstatus", fetchStudent, async (req, res) => {
  const studentId = req.student.id;
  if (!studentId)
    return res.status(404).json({ status: false, msg: "User not found" });
  try {
    const filter = {
      questionSetId: req.body.setId,
      "studentData.studentId": studentId,
      "studentData.isFinish": true,
      "studentData.isSolved": true
    };
    let dataFinder = await MockQuestion.find(filter);
    res.status(200).json({ status: true, dataFinder });
    // if (dataFinder) {
    //   const update = {
    //     $set: {
    //       "studentData.$[elem].one": req.body.one,
    //       "studentData.$[elem].two": req.body.two,
    //       "studentData.$[elem].three": req.body.three,
    //       "studentData.$[elem].four": req.body.four,
    //       "studentData.$[elem].isSolved": true,
    //       "studentData.$[elem].isFinish": true
    //     }
    //   };

    //   const options = {
    //     arrayFilters: [{ "elem.studentId": studentId }],
    //     new: true
    //   };

    //   await MockQuestion.findOneAndUpdate(filter, update, options);
    //   // res.status(200).json({ status: 200, msg: "Response Changed" });
    // }
  } catch (error) {
    console.log(error);
    // res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Mock Set Start ________________________________________
router.post("/startmock", fetchStudent, async (req, res) => {
  const studentId = req.student.id;
  if (!studentId)
    return res.status(404).json({ status: false, msg: "User not found" });
  try {
    const filter = { _id: req.body.setId, "studentData.studentId": studentId };
    let dataFinder = await MockSet.findOne(filter);
    if (dataFinder) {
      const update = {
        $set: {
          // "studentData.$[elem].attemptedAt": attemptedAt,
          // "studentData.$[elem].isFinish": isFinish,
          // "studentData.$[elem].isSolved": isSolved,
          // "studentData.$[elem].isCorrect": isCorrect
          "studentData.$[elem].isStarted": true
        }
      };

      const options = {
        arrayFilters: [{ "elem.studentId": studentId }],
        new: true
      };

      await MockSet.findOneAndUpdate(filter, update, options);

      // res.status(200).json({ status: 200, msg: "Mock Started Again!" });
    } else {
      const addToSetUpdate = {
        $addToSet: {
          studentData: {
            studentId,
            isStarted: true
          }
        }
      };

      await MockSet.findOneAndUpdate({ _id: req.body.setId }, addToSetUpdate);
      // res.status(200).json({ status: 200, msg: "Mock Started" });
    }
    res.status(200).json({
      status: true,
      msg: "Mock Test Started"
    });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Question Start ________________________________________
router.post("/startquestion", fetchStudent, async (req, res) => {
  const studentId = req.student.id;
  if (!studentId)
    return res.status(404).json({ status: false, msg: "User not found" });
  try {
    const filter = {
      _id: req.body.questionId,
      "studentData.studentId": studentId
    };
    let dataFinder = await MockQuestion.findOne(filter);
    if (dataFinder) {
      const update = {
        $set: {
          "studentData.$[elem].one": req.body.one,
          "studentData.$[elem].two": req.body.two,
          "studentData.$[elem].three": req.body.three,
          "studentData.$[elem].four": req.body.four,
          "studentData.$[elem].isSolved": true,
          "studentData.$[elem].isFinish": true
        }
      };

      const options = {
        arrayFilters: [{ "elem.studentId": studentId }],
        new: true
      };

      await MockQuestion.findOneAndUpdate(filter, update, options);
      // res.status(200).json({ status: 200, msg: "Response Changed" });
    } else {
      const addToSetUpdate = {
        $addToSet: {
          studentData: {
            studentId,
            one: req.body.one,
            two: req.body.two,
            three: req.body.three,
            four: req.body.four,
            isSolved: true,
            isFinish: true
          }
        }
      };

      await MockQuestion.findOneAndUpdate(
        { _id: req.body.questionId },
        addToSetUpdate
      );
      // res.status(200).json({ status: 200, msg: "Response Added" });
    }
    res.status(200).json({
      status: true,
      msg: "Mock Test Started"
    });
  } catch (error) {
    console.log(error);
    // res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Submit Exam ________________________________________
router.post("/submitexam", fetchStudent, async (req, res) => {
  const studentId = req.student.id;
  if (!studentId)
    return res.status(404).json({ status: false, msg: "User not found" });
  try {
    const filter = { _id: req.body.setId, "studentData.studentId": studentId };
    let dataFinder = await MockSet.findOne(filter);
    if (dataFinder) {
      const update = {
        $set: {
          // "studentData.$[elem].attemptedAt": attemptedAt,
          "studentData.$[elem].isFinish": true
          // "studentData.$[elem].isSolved": isSolved,
          // "studentData.$[elem].isCorrect": isCorrect
          // "studentData.$[elem].isStarted": true
        }
      };

      const options = {
        arrayFilters: [{ "elem.studentId": studentId }],
        new: true
      };

      await MockSet.findOneAndUpdate(filter, update, options);
      res.status(200).json({
        status: true,
        msg: "Mock Test Finished"
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Submit Exam ________________________________________
router.post("/getcompletedmock", fetchStudent, async (req, res) => {
  const studentId = req.student.id;
  if (!studentId)
    return res.status(404).json({ status: false, msg: "User not found" });
  try {
    const filter = { "studentData.studentId": studentId };
    let dataFinder = await MockSet.find(filter).sort({ updatedAt: -1 });
    if (dataFinder) {
      res.status(200).json({ status: true, dataFinder });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Find Solution ________________________________________
router.post("/findsolution", fetchStudent, async (req, res) => {
  const studentId = req.student.id;
  if (!studentId)
    return res.status(404).json({ status: false, msg: "User not found" });
  try {
    let data = await MockSolution.findOne({ questionId: req.body.id });
    if (!data) {
      res.status(200).json({ status: false, msg: "Solution not Given" });
    } else {
      res.status(200).json({ status: true, data });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

module.exports = router;
