const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const Student = require("../model/Student");
const MockQuestion = require("../model/MockQuestion");
const MockSet = require("../model/MockSet");
const Mentor = require("../model/Mentor");
const fetchMentor = require("../middleware/fetchMentor");
const MockSolution = require("../model/MockSolution");

// ______________________mentor registration__________________________________________
router.post("/register", async (req, res) => {
  try {
    let mentor = await Mentor.findOne({ email: req.body.email });
    if (!mentor) {
      mentor = await Mentor.findOne({ email: req.body.mobile });
      if (!mentor) {
        const salt = await bcrypt.genSalt(10);
        const randPassword = `MEN${Math.floor(Math.random() * 10000000)}`;
        const hashedPassword = await bcrypt.hash(randPassword, salt);
        const profileId = Math.floor(Math.random() * 20000000);
        mentor = await Mentor.create({
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          password: hashedPassword,
          profileId: profileId,
          role: req.body.role
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
              subject: `Mentor Profile Created ${profileId}`,
              html: `
        <h2><b>Congratulation! You are Enrolled as a mentor at Guidewale Study Center (GSC)</b></h2>
        <b>Name :</b>${req.body.name}<br />
        <b>email :</b>${req.body.email}<br />
        <b>phone :</b>${req.body.mobile}<br />
        <b>password :</b>${randPassword}<br />
        <b>Profile ID :</b>${profileId}<br />
        <b>Registered As :</b><u>${req.body.role}</u> Mentor<br />
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
    res.status(500).json({ status: false, msg: error });
  }
});

// ______________________ mentor Login _______________________________________________
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(500).json({
        status: false,
        msg: "Please Enter Cradentials"
      });
    } else {
      let mentor = await Mentor.findOne({ email: req.body.email });
      if (!mentor) {
        res.status(404).json({
          status: false,
          msg: "Please Enter A Valid Email"
        });
      } else {
        const passCompare = await bcrypt.compare(
          req.body.password,
          mentor.password
        );
        if (!passCompare)
          return res
            .status(404)
            .json({ status: false, msg: "Invalid Password" });
        if (passCompare) {
          const payload = {
            mentor: {
              id: mentor._id,
              name: mentor.name,
              email: mentor.email,
              profileId: mentor.profileId
            }
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 86400
          });
          res.status(200).json({ status: true, mentorToken: token });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: error });
  }
});

// ______________________ mentor profile _____________________________________________
router.post("/profile", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      return res
        .status(200)
        .json({ status: true, msg: "Access Granted", profile: mentor });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: error });
  }
});

// ______________________ Create Mock ________________________________________________
router.post("/craetemock", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      let newMock = await MockSet.findOne({ mockSetId: req.body.mockSetId });
      if (!newMock) {
        newMock = await MockSet.create({
          heading: req.body.heading,
          subject: req.body.subject,
          mockSetId: req.body.mockSetId,
          mentor: req.body.mentor,
          mentorId: mentorId,
          mockId: req.body.mockId,
          price: req.body.price
        });
        res
          .status(200)
          .json({ status: true, msg: "Mock Set Created", data: newMock });
      } else {
        res.status(201).json({ status: false, msg: "Mock Already Created" });
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Get Pending Mock ___________________________________________
router.post("/getpendingmock", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      // const mockSetId = Math.round(Math.random() * 123000000);
      let pendingMock = await MockSet.find({
        mentorId: mentorId,
        status: false
      }).sort({ createdAt: -1 });
      if (!pendingMock) {
        res.status(404).json({
          status: false,
          msg: "No Pending Mock Found"
        });
      } else {
        res
          .status(200)
          .json({ status: true, msg: "Pending Mock Found", data: pendingMock });
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Get Pending Mock ___________________________________________
router.post("/getapprovedmock", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      // const mockSetId = Math.round(Math.random() * 123000000);
      let pendingMock = await MockSet.find({
        mentorId: mentorId,
        status: true
      }).sort({ createdAt: -1 });
      if (!pendingMock) {
        res.status(404).json({
          status: false,
          msg: "No Pending Mock Found"
        });
      } else {
        res
          .status(200)
          .json({ status: true, msg: "Pending Mock Found", data: pendingMock });
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Get Mock With ID ___________________________________________
router.post("/getsinglemock", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      let pendingMock = await MockSet.findOne({
        _id: req.body.mockSetId,
        status: false
      });
      if (!pendingMock) {
        res.status(404).json({
          status: false,
          msg: "Select A Valid Mock"
        });
      } else {
        res
          .status(200)
          .json({ status: true, msg: "Pending Mock Found", data: pendingMock });
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Mock Question Add ______________________________________________
router.post("/addquestion", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      let pendingMock = await MockSet.findOne({ _id: req.body.questionSetId });
      if (!pendingMock) {
        res.status(404).json({
          status: false,
          msg: "Select A Valid Mock"
        });
      } else {
        let newQuestion = await MockQuestion.findOne({
          questionId: req.body.questionId
        });
        if (!newQuestion) {
          newQuestion = await MockQuestion.create({
            question: req.body.question,
            selection: {
              one: {
                isCorrect: req.body.one,
                option: req.body.optiona
              },
              two: {
                isCorrect: req.body.two,
                option: req.body.optionb
              },
              three: {
                isCorrect: req.body.three,
                option: req.body.optionc
              },
              four: {
                isCorrect: req.body.four,
                option: req.body.optiond
              }
            },
            questionSetId: req.body.questionSetId,
            questionId: req.body.questionId
          });
          res
            .status(200)
            .json({ status: true, msg: "Question Added", data: newQuestion });
        } else {
          res.status(200).json({ status: false, msg: "Added Already" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Mock Question Count for Mock Set ___________________________
router.post("/questioncount", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      let pendingMock = await MockSet.findOne({ _id: req.body.questionSetId });
      if (!pendingMock) {
        res.status(404).json({
          status: false,
          msg: "Select A Valid Mock"
        });
      } else {
        // playgound
        const data = await MockQuestion.find({
          questionSetId: req.body.questionSetId
        });
        res
          .status(200)
          .json({ status: true, msg: "Access Granted", data: data });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: false, msg: "Internal Server Error", error: error });
  }
});

// ______________________ Mock Question Find With ID __________________________________
router.post("/findquestion", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      // playground
      const question = await MockQuestion.findById({ _id: req.body.id });
      if (!question) {
        res.status(404).json({ status: false, msg: "Question Not Found" });
      } else {
        res.status(200).json({ status: true, question });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: false, msg: "Internal Server Error", error: error });
  }
});

// ______________________ Mock Question Delete With ID __________________________________
router.post("/delete", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      // playground
      const question = await MockQuestion.findByIdAndDelete({
        _id: req.body.id
      });
      res.status(200).json({ status: true, msg: "Question Deleted", question });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: false, msg: "Internal Server Error", error: error });
  }
});

// ______________________ Mock Question Update With ID __________________________________
router.post("/update", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      // playground
      const question = await MockQuestion.findByIdAndUpdate(
        {
          _id: req.body.id
        },
        {
          question: req.body.question,
          selection: {
            one: {
              isCorrect: req.body.one,
              option: req.body.optiona
            },
            two: {
              isCorrect: req.body.two,
              option: req.body.optionb
            },
            three: {
              isCorrect: req.body.three,
              option: req.body.optionc
            },
            four: {
              isCorrect: req.body.four,
              option: req.body.optiond
            }
          }
        }
      );
      res.status(200).json({ status: true, msg: "Question Updated", question });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: false, msg: "Internal Server Error", error: error });
  }
});

// ______________________ Mock Solution Update With ID __________________________________
router.post("/solutionadd", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      // playground
      const solutionId = Math.round(Math.random() * 15922222221123);
      let solution = await MockSolution.findOne({
        questionId: req.body.questionId
      });
      if (!solution) {
        solution = await MockSolution.create({
          solution: req.body.solution,
          questionSetId: req.body.questionSetId,
          questionId: req.body.questionId,
          userId: mentorId,
          solutionId: solutionId
        });
        solution = await MockQuestion.findByIdAndUpdate(
          {
            _id: req.body.questionId
          },
          {
            isSolved: true
          }
        );
        res.status(200).json({ status: true, msg: "Solution Added" });
      } else if (solution) {
        res.status(200).json({ status: false, msg: "Solution Already Added" });
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Mock Solution Find __________________________________
router.post("/solutionfind", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      // playground
      let solution = await MockSolution.findOne({
        questionId: req.body.questionId
      });
      if (solution) {
        res.status(200).json({ status: true, msg: "Solution Found", solution });
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Mock Solution Find __________________________________
router.post("/solutionfind", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      // playground
      let solution = await MockSolution.findOne({
        questionId: req.body.questionId
      });
      if (solution) {
        res.status(200).json({ status: true, msg: "Solution Found", solution });
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Mock Solution Find __________________________________
router.post("/solutionfindwithid", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      // playground
      let solution = await MockSolution.findById({
        _id: req.body.id
      });
      if (solution) {
        res.status(200).json({ status: true, msg: "Solution Found", solution });
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Mock Solution Edit __________________________________
router.post("/solutionupdate", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      // playground
      let solution = await MockSolution.findByIdAndUpdate(
        {
          _id: req.body.id
        },
        {
          solution: req.body.content
        }
      );
      res.status(200).json({ status: true, msg: "Solution Updated" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

// ______________________ Mock Final __________________________________
router.post("/final", fetchMentor, async (req, res) => {
  const mentorId = req.mentor.id;
  try {
    let mentor = await Mentor.findById({ _id: mentorId });
    if (!mentor)
      return res
        .status(404)
        .json({ status: false, msg: "Access Denied", profile: null });
    if (mentor) {
      // playground
      let solution = await MockSet.findByIdAndUpdate(
        {
          _id: req.body.id
        },
        {
          status: true
        }
      );
      res.status(200).json({ status: true, msg: "Solution Updated" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

module.exports = router;
