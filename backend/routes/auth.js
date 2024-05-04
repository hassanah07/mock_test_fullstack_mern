const User = require("../model/Auth");
const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fetchUser = require("../middleware/fetchuser");
const nodemailer = require("nodemailer");

// new user registration endpoint
route.post("/register", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).json({ msg: "Oppssss! Email already exists" });
    user = await User.findOne({ mobile: req.body.mobile });
    if (user) {
      res.status(400).json({ msg: "Oppssss! Mobile already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const randPassword = `PMX${Math.floor(Math.random() * 10000000)}`;
      const hashedPassword = await bcrypt.hash(randPassword, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: hashedPassword,
        desc: req.body.desc
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
        <h2><b>Congratulation! Your Profile Has been Created with these details</b></h2>
        <b>Name :</b>${req.body.name}<br />
        <b>email :</b>${req.body.email}<br />
        <b>phone :</b>${req.body.mobile}<br />
        <b>password :</b>${randPassword}<br />
        <b>desc :</b>${req.body.desc}<br />
        <small>Login with your system generated Password</small><br />
        <small>If failed to login! Try Creating New Account Again with same details</small>
        `
          });
          res.status(200).json({ msg: "Account Created! Check Your Email" });
        }
        main().catch(() => {
          res.status(500).json({ msg: false });
        });
      } catch (error) {
        res.status(500).json({ msg: "Internal Server Error3" });
      }
      // email shotting process end
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error2" });
  }
});
// user login endpoints
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(500).json({ msg: "Invalid Attempt" });
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(500).json({ msg: "Invalid Attempt" });
    const passCompare = await bcrypt.compare(req.body.password, user.password);
    if (!passCompare) return res.status(500).json({ msg: "Invalid Attempt" });
    if (passCompare) {
      const payload = {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 36000
      });
      return res.status(200).json({ token: token });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});
// get user profile from server
route.post("/getuserdata", fetchUser, async (req, res) => {
  const userId = req.user.id;
  try {
    const authUser = await User.findById(userId).select("-password");
    if (!authUser) {
      res.status(200).json({ msg: false });
    } else {
      res.status(200).json(authUser);
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});
// get token verified
route.post("/tokenverify", fetchUser, (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(404).json(false);
  if (userId) return res.status(200).json(true);
});
// password change
route.post("/passwordchange", fetchUser, async (req, res) => {
  const userId = req.user.id;
  try {
    let user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json("Login Failed! Please login Again");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user = await User.findByIdAndUpdate(
        { _id: userId },
        { password: hashedPassword }
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
            to: user.email,
            subject: "Your Password Has Been Changed By Your",
            html: `
        <h2><b>Hey Dear! Your Profile Has been Access and Password has been change</b></h2>
        <b>New Login Password :</b><b><u>${req.body.password}</u></b><br />
        <small>This is an auto generated email for Extra security</small>
        `
          });
          res.status(200).json("Password has been send to email");
        }
        main().catch((error) => {
          res.status(500).json("Unable to send email");
        });
      } catch (error) {
        res.status(500).json("Internal Server Error");
      }
      // email shotting process end
    }
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
});
// reset password route
route.post("/resetpassword", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("Please Enter A Valid Email");
    if (user) {
      if (user.profileId == req.body.profileId)
        return res
          .status(200)
          .json("Password Already Updated! Please Check Email");
      const userId = user._id;
      const salt = await bcrypt.genSalt(10);
      const randPassword = `PMX${Math.floor(Math.random() * 10000000)}`;
      const hashedPassword = await bcrypt.hash(randPassword, salt);
      user = await User.findByIdAndUpdate(
        { _id: userId },
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
            from: '"Server Mail"servermail@noreply.com',
            to: req.body.email,
            subject: "Your New Auto Generated Password Is Here",
            html: `
        <h2><b>Hey Dear! Your Login Password Has Been Reset and New Password Will Be :-</b></h2>
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

module.exports = route;
