const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Keeper = require("../model/StoreKeeper");
// const fetchStudent = require("../middleware/fetchStudent");
const Customer = require("../model/Customer");
const fetchLabUser = require("../middleware/fetchLabUser");

// store admin registration
router.post("/storeAdminRegn", async (req, res) => {
  try {
    let keeper = await Keeper.findOne({ email: req.body.email });
    if (keeper) {
      res.status(201).json({ status: false, msg: "User Already Exist" });
    } else {
      const password = `PMX${Math.round(Math.random() * 282571457)}`;

      const salt = await bcrypt.genSalt(10);

      const hashedPass = await bcrypt.hash(password, salt);
      keeper = await Keeper.create({
        storeName: req.body.storeName,
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: hashedPass,
        role: "labAdmin",
        storeId: Math.round(Math.random() * 101020000)
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
            user: process.env.MAILER_USERID,
            pass: process.env.MAILER_PASSWORD
          }
        });
        async function main() {
          const info = await transporter.sendMail({
            from: '"Server Mail"anowarulah07@gmail.com',
            to: req.body.email,
            subject: "Registration Completed!",
            html: `
          <h2><b>Hello Chief! You are Registered as an Admin</b></h2>
          <b>Name :</b>${req.body.name}<br />
          <b>email :</b>${req.body.email}<br />
          <b>phone :</b>${req.body.mobile}<br />
          <b>password :</b>${password}<br />
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
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// store user addition
router.post("/storeUserRegn", async (req, res) => {
  try {
    let keeper = await Keeper.findOne({ email: req.body.email });
    if (keeper)
      return res.status(201).json({ status: false, msg: "User Already Exist" });

    const password = `USR${Math.round(Math.random() * 282571457)}`;
    const salt = await bcrypt.genSalt(10);

    const hashedPass = await bcrypt.hash(password, salt);
    keeper = await Keeper.create({
      storeName: req.body.storeName,
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: hashedPass,
      role: req.body.role,
      storeId: req.body.storeId
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
          subject: "Congratulation! You Are Hired",
          html: `
        <h2><b>Congratulation! You are You are Hired as a ${req.body.role}</b></h2>
        <b>Name :</b>${req.body.name}<br />
        <b>email :</b>${req.body.email}<br />
        <b>phone :</b>${req.body.mobile}<br />
        <b>password :</b>${password}<br />
        `
        });
        res.status(200).json({ status: true, msg: "Employee Added!" });
      }
      main().catch(() => {
        res.status(500).json({ status: false, mag: "Email Sending Error" });
      });
    } catch (error) {
      res.status(500).json({ msg: "Internal Server Error for Email Service" });
    }
    // email shotting process end
    // res.status(200).json({ status: true, msg: keeper });
  } catch (error) {
    res.json(error);
  }
});
// store user get
router.post("/storeUserGet", fetchLabUser, async (req, res) => {
  const adminId = req.keeper.id;
  const role = req.keeper.role;
  const storeId = req.keeper.storeId;
  // const data = { adminId, role, storeId };
  try {
    if (role == "labAdmin") {
      let users = await Keeper.find({ storeId: storeId });
      res.status(200).json({ users });
    } else {
      res.status(401).json({ msg: "user are not authorized", users: null });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});
// find user and edit user by user id
router.post("/storeUserEdit", fetchLabUser, async (req, res) => {
  const adminId = req.keeper.id;
  try {
    let user = await Keeper.findOne({ _id: adminId });
    if (user.role != "labAdmin") {
      return res
        .status(401)
        .json({ status: false, msg: "You Are Not Authorized", data: null });
    } else {
      user = await Keeper.findOne({ _id: req.body.id });
      if (!user) {
        return res
          .status(404)
          .json({ status: false, msg: "User Not Found!", data: null });
      } else {
        return res
          .status(200)
          .json({ status: true, msg: "Access Granted", data: user });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: false, msg: "Internal Server Error", error });
  }
});
// store user deletion
router.post("/storeUserDelete", async (req, res) => {
  try {
    let keeper = await Keeper.findOne({ email: req.body.email });
    if (!keeper)
      return res.status(201).json({ status: false, msg: "Invalid Email ID" });

    keeper = await Keeper.findOneAndDelete({
      email: req.body.email
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
          subject: "Your Account Is Deleted",
          html: `
        <h2><b>Oopssss! You are fired</b></h2>
        `
        });
        res
          .status(200)
          .json({ status: true, msg: "Account Deleted And Email Sent" });
      }
      main().catch(() => {
        res.status(500).json({ status: false, mag: "Email Sending Error" });
      });
    } catch (error) {
      res.status(500).json({ msg: "Internal Server Error for Email Service" });
    }
    // email shotting process end
    // res.status(200).json({ status: true, msg: keeper });
  } catch (error) {
    res.json(error);
  }
});
// store login
router.post("/storeUserLogin", async (req, res) => {
  try {
    let keeper = await Keeper.findOne({ email: req.body.email });
    if (!keeper)
      return res.status(404).json({ status: false, msg: "User Not Found" });
    const passVerify = await bcrypt.compare(req.body.password, keeper.password);

    if (!passVerify)
      return res.status(401).json({ status: false, msg: "Invalid Password" });
    const payload = {
      keeper: {
        id: keeper._id,
        name: keeper.name,
        email: keeper.email,
        mobile: keeper.mobile,
        role: keeper.role,
        storeId: keeper.storeId
      }
    };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 86400
    });
    if (passVerify)
      return res.status(200).json({
        status: true,
        msg: "User Logged Innn",
        token: jwtToken,
        data: keeper
      });
  } catch (error) {
    res.status(500).json({ status: false, msg: error });
  }
});
// profile verify
router.post("/profile", fetchLabUser, async (req, res) => {
  const keeperId = req.keeper.id;
  let response = await Keeper.findOne({ _id: keeperId });
  if (!response)
    return res.status(404).json({ status: false, msg: "Invalid User Profile" });
  if (response)
    return res.status(200).json({
      status: true,
      msg: `Logged In As ${req.keeper.name}`,
      data: response
    });
  // console.log("object");
});

// find new customer
router.post("/findCustomer", async (req, res) => {
  let data = await Customer.find({ mobile: req.body.mobile });
  if (data.length == 0) {
    res.status(200).json({ status: false, msg: "New Custore" });
  } else {
    res.status(200).json({ status: true, msg: "Customer Exists", data });
  }
});
// create new customer
router.post("/findAndCreateCustomer", fetchLabUser, async (req, res) => {
  const keeperId = req.keeper.id;
  try {
    let data = await Customer.find({ mobile: req.body.mobile });
    data = await Customer.create({
      mobile: req.body.mobile,
      name: req.body.name,
      age: req.body.age,
      gender: req.body.sex,
      address: req.body.address,
      addedAt: keeperId,
      addedAt: req.body.userId
    });
    res.status(200).json({ status: true, msg: "Addition Completed" });
  } catch (error) {
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
});

module.exports = router;
