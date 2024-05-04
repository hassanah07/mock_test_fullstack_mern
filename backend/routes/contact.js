const express = require("express");
const route = express.Router();
const nodemailer = require("nodemailer");
const Contact = require("../model/Contact");

route.post("/newcontact", async (req, res) => {
  try {
    let newContact = await Contact.findOne({
      contactId: req.body.contactId
    });
    if (!newContact) {
      newContact = await Contact.create({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        contactId: req.body.contactId,
        status: false
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
            to: `${req.body.email}, anowarulah07@gmail.com`,
            subject: "Confirmation Email Copy",
            html: `
        <h2><b>Thank You for Your Message! We Will Resolve Your Issue Soon</b></h2>
        <br />
        <p>Description Of your Complaint/Service/Business Related Issue</p>
        <b>Name :</b>${req.body.name}<br />
        <b>email :</b>${req.body.email}<br />
        <b>Message :</b>${req.body.message}<br />
        <b>Reference Code :</b>${req.body.contactId}<br />
        <small>Confirmation Copy of Email</small>
        `
          });
          res.status(200).json({ msg: true });
        }
        main().catch(() => {
          res.status(500).json({ msg: false });
        });
      } catch (error) {
        res.status(500).json({ msg: false });
      }
      // email shotting process end
    } else {
      res.status(400).json({ msg: false });
    }
  } catch (error) {
    res.status(500).json({ msg: false });
  }
});
route.post("/callreq", async (req, res) => {
  try {
    let newCall = await Contact.findOne({ contactId: req.body.contactId });
    if (newCall) return res.status(200).json("Message Sent Already");
    if (!newCall) {
      newCall = await Contact.create({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        message: req.body.desc,
        contactId: req.body.contactId,
        talk: true
      });
      // email shotting process start
      try {
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
            to: `${req.body.email}, anowarulah07@gmail.com`,
            subject: `Confirmation Email With Ref ${req.body.contactId}`,
            html: `
        <h2><b>Thank You! We Will Get Back To You Within 24 Hours</b></h2>
        <br />
        <p>Description Of your Complaint/Service/Business Related Issue</p>
        <b>Name :</b>${req.body.name}<br />
        <b>email :</b>${req.body.email}<br />
        <b>email :</b>${req.body.mobile}<br />
        <b>Message :</b>${req.body.desc}<br />
        <b>Reference Code :</b>${req.body.contactId}<br />
        <small>Confirmation Copy of Email</small>
        `
          });
          res.status(200).json("Request Sent successfully");
        }
        main().catch(() => {
          res.status(500).json("Server Error, Please try after sometime");
        });
      } catch (error) {
        res.status(500).json("Server Error, Please try after sometime");
      }
      // email shotting process end
    }
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});
module.exports = route;
