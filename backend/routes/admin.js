const User = require("../model/Auth");
const Admin = require("../model/Admin");
const Blogpost = require("../model/Blogpost");
const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fetchAdmin = require("../middleware/fetchAdmin");
const nodemailer = require("nodemailer");
const Contact = require("../model/Contact");
// admin login here
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(404).json({ msg: "Please Enter Email", type: "error" });
    } else {
      let login = await Admin.findOne({ email: email });
      if (!login) {
        return res.status(404).json({ msg: "Access Denied", type: "error" });
      } else {
        const fingerprint = await bcrypt.compare(password, login.password);
        if (!fingerprint) {
          return res.status(500).json({ msg: "Access Denied", type: "error" });
        } else {
          const payload = {
            login: {
              id: login._id,
              name: login.name,
              email: login.email
            }
          };
          const adminToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 7200
          });
          return res.status(200).json({
            adminToken: adminToken,
            msg: "Access Granted",
            type: "success"
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", type: "error" });
  }
});
// reset password
route.post("/resetpassword", async (req, res) => {
  try {
    let user = await Admin.findOne({ email: req.body.email });
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
        <h2><b>Hello Admin! Your Login Password Has Been Reset and New Password Will Be :-</b></h2>
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
// admin regn here
route.post("/regn", async (req, res) => {
  try {
    let admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      admin = await Admin.findOne({ mobile: req.body.mobile });
      if (!admin) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        admin = await Admin.create({
          name: req.body.name,
          mobile: req.body.mobile,
          email: req.body.email,
          password: hashedPassword
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
              from: '"Admin Account Created"anowarulah07@gmail.com',
              to: req.body.email,
              subject: "Congratulations! Dear Admin",
              html: `
            <h2><b>Congratulation! You are Appointed As a Admin</b></h2>
            <b>Name :</b>${req.body.name}<br />
            <b>email :</b>${req.body.email}<br />
            <b>phone :</b>${req.body.mobile}<br />
            <b>password :</b>${req.body.password}<br />
            <small>Login with your system generated Password</small><br />
            <small>You Have Full Root Access!</small>
            `
            });
            res.status(200).json("Account Created! Check Your Email");
          }
          main().catch(() => {
            res.status(500).json("Mailer Server Code Error!");
          });
        } catch (error) {
          res.status(500).json("Mailer Server Error!");
        }
        // email shotting process end
      } else {
        return res.status(404).json("URL Not Found");
      }
    } else {
      return res.status(404).json("URL Not Found");
    }
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});
// get profile with profile id
route.post("/profile", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  try {
    let profile = await Admin.findById({ _id: adminId });
    if (!profile) {
      res.status(404).json("Access Denied");
    } else {
      res.status(200).json(profile);
    }
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});
// get profile verification
route.post("/tokenVerify", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  try {
    let profile = await Admin.findById({ _id: adminId });
    if (!profile) {
      res.status(404).json(false);
    } else {
      res.status(200).json(true);
    }
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});
// Blog management Blog View with Blog ID
route.post("/blogidview", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  try {
    const data = await Blogpost.findOne({ blogId: req.body.blogId });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// Blog Management Approval
route.post("/approval", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(500).json("Access Denied");
  try {
    let data = await Blogpost.findOne({ blogId: req.body.blogId });
    if (!data)
      return res.status(404).json({ msg: "Access Denied!", status: false });
    if (data) {
      data = await Blogpost.findOneAndUpdate(
        { blogId: req.body.blogId },
        { status: true, deleted: false, withdrawn: false }
      );
      res.status(200).json({ msg: "Approved", status: true, withdrawn: false });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// Blog Management revert
route.post("/revert", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  try {
    const data = await Blogpost.findOne({ blogId: req.body.blogId });
    if (!data)
      return res.status(404).json({ msg: "Access Denied", status: false });
    if (data) {
      const blog = await Blogpost.findOneAndUpdate(
        { blogId: req.body.blogId },
        { status: false, deleted: false, withdrawn: false }
      );
      res.status(200).json({ msg: "Reverted", status: true });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// Blog Management withdraw
route.post("/withdraw", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  try {
    const data = await Blogpost.findOne({ blogId: req.body.blogId });
    if (!data)
      return res.status(404).json({ msg: "Access Denied", status: false });
    if (data) {
      const blog = await Blogpost.findOneAndUpdate(
        { blogId: req.body.blogId },
        { status: false, deleted: true, withdrawn: true }
      );
      res.status(200).json({ msg: "Withdrawn", status: true });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// Blog Management deleteblog
route.post("/deleteblog", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  try {
    const data = await Blogpost.findOne({ blogId: req.body.blogId });
    if (!data)
      return res.status(404).json({ msg: "Access Denied", status: false });
    if (data) {
      const blog = await Blogpost.findOneAndDelete({
        blogId: req.body.blogId
      });
      res.status(200).json({ msg: "Deleted", status: true });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// Blog Management deleted blogs lists
route.post("/deleteblogs", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  const page = parseInt(req.body.currentpage) || 1;
  const limit = parseInt(req.body.datalimit) || 12;
  const totalItems = await Blogpost.countDocuments({
    status: false,
    deleted: true,
    withdrawn: true
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const blogposts = await Blogpost.find({
      status: false,
      deleted: true,
      withdrawn: true
    })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);

    if (!blogposts)
      return res.status(404).json({ msg: "Access Denied", status: false });
    if (blogposts) {
      res.status(200).json({ page, limit, totalItems, totalPages, blogposts });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});

//All post control routes here
// post counting process
route.post("/blogscount", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  try {
    const data = await Blogpost.find();
    const approved = await Blogpost.find({ status: true });
    const blogStatus = await Blogpost.find({ status: false });
    const blogDeleted = await Blogpost.find({ deleted: true });
    const blogWithdrawn = await Blogpost.find({ withdrawn: true });
    res.status(200).json({
      total: data.length,
      approved: approved.length,
      deleted: blogDeleted.length,
      pending: blogStatus.length,
      withdrawn: blogWithdrawn.length
    });
  } catch (error) {
    res.status(500).json("internal server error");
  }
});

// total number of User counter
route.post("/usercount", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  try {
    const data = await User.find();
    const verified = await User.find({ status: true });
    const userStatus = await User.find({ status: false });
    const userDeleted = await User.find({ deleted: true });
    const userWithdrawn = await User.find({ withdrawn: true });
    res.status(200).json({
      totalUsers: data.length,
      verifiedUsers: verified.length,
      deletedUsers: userDeleted.length,
      unverifiedUsers: userStatus.length,
      suspendedUsers: userWithdrawn.length
    });
  } catch (error) {
    res.status(500).json("internal server error");
  }
});
// contact counter
route.post("/contactcount", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  try {
    const total = await Contact.find();
    const pendingtalk = await Contact.find({ talk: false });
    const approvedtalk = await Contact.find({ talk: true });
    const pendingcontact = await Contact.find({ status: false });
    const approvedcontact = await Contact.find({ status: true });
    res.status(200).json({
      totalContact: total.length,
      approvedtalk: approvedtalk.length,
      pendingtalk: pendingtalk.length,
      approvedcontact: approvedcontact.length,
      pendingcontact: pendingcontact.length
    });
  } catch (error) {
    res.status(500).json("Access Denied");
  }
});

// user control system
route.post("/userpending", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  const page = parseInt(req.body.currentpage) || 1;
  const limit = parseInt(req.body.datalimit) || 12;
  const totalItems = await User.countDocuments({
    status: false,
    deleted: false,
    withdrawn: false
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const userslist = await User.find({
      status: false,
      deleted: false,
      withdrawn: false
    })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);

    if (!userslist)
      return res.status(404).json({ msg: "Access Denied", status: false });
    if (userslist) {
      res.status(200).json({ page, limit, totalItems, totalPages, userslist });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// approved uuserss l;ist
route.post("/userapproved", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  const page = parseInt(req.body.currentpage) || 1;
  const limit = parseInt(req.body.datalimit) || 12;
  const totalItems = await User.countDocuments({
    status: true,
    deleted: false,
    withdrawn: false
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const userslist = await User.find({
      status: true,
      deleted: false,
      withdrawn: false
    })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);

    if (!userslist)
      return res.status(404).json({ msg: "Access Denied", status: false });
    if (userslist) {
      res.status(200).json({ page, limit, totalItems, totalPages, userslist });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// suspended uuserss l;ist
route.post("/usersuspended", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  const page = parseInt(req.body.currentpage) || 1;
  const limit = parseInt(req.body.datalimit) || 12;
  const totalItems = await User.countDocuments({
    status: false,
    deleted: true,
    withdrawn: true
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const userslist = await User.find({
      status: false,
      deleted: true,
      withdrawn: true
    })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);

    if (!userslist)
      return res.status(404).json({ msg: "Access Denied", status: false });
    if (userslist) {
      res.status(200).json({ page, limit, totalItems, totalPages, userslist });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// all uuserss l;ist
route.post("/userall", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  const page = parseInt(req.body.currentpage) || 1;
  const limit = parseInt(req.body.datalimit) || 12;
  const totalItems = await User.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const userslist = await User.find()
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);

    if (!userslist)
      return res.status(404).json({ msg: "Access Denied", status: false });
    if (userslist) {
      res.status(200).json({ page, limit, totalItems, totalPages, userslist });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// One User
route.post("/userwithid", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");

  try {
    const oneUser = await User.findById({ _id: req.body.id });

    if (!oneUser)
      return res.status(404).json({ msg: "Access Denied", status: false });
    if (oneUser) {
      res.status(200).json(oneUser);
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// User Management Approval
route.post("/userapproval", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(500).json("Access Denied");
  try {
    let data = await User.findById({ _id: req.body.id });
    if (!data)
      return res.status(404).json({ msg: "Access Denied!", status: false });
    if (data) {
      data = await User.findByIdAndUpdate(
        { _id: req.body.id },
        { status: true, deleted: false, withdrawn: false }
      );
      res.status(200).json({ msg: "Approved", status: true });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// User Management revert
route.post("/userrevert", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(500).json("Access Denied");
  try {
    let data = await User.findById({ _id: req.body.id });
    if (!data)
      return res.status(404).json({ msg: "Access Denied!", status: false });
    if (data) {
      data = await User.findByIdAndUpdate(
        { _id: req.body.id },
        { status: false, deleted: false, withdrawn: false }
      );
      res.status(200).json({ msg: "Reverted", status: true });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// userwithdraw Management
route.post("/userwithdraw", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(500).json("Access Denied");
  try {
    let data = await User.findById({ _id: req.body.id });
    if (!data)
      return res.status(404).json({ msg: "Access Denied!", status: false });
    if (data) {
      data = await User.findByIdAndUpdate(
        { _id: req.body.id },
        { status: false, deleted: true, withdrawn: true }
      );
      res.status(200).json({ msg: "Withdrawn", status: true });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// userdelete Management
route.post("/userdelete", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(500).json("Access Denied");
  try {
    let data = await User.findById({ _id: req.body.id });
    if (!data)
      return res.status(404).json({ msg: "Access Denied!", status: false });
    if (data) {
      data = await User.findByIdAndDelete({ _id: req.body.id });
      res.status(200).json({ msg: "Deleted", status: true });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});

// contact Management
route.post("/contactall", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  const page = parseInt(req.body.currentpage) || 1;
  const limit = parseInt(req.body.datalimit) || 12;
  const totalItems = await Contact.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const contactlist = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);

    if (!contactlist)
      return res.status(404).json({ msg: "Access Denied", status: false });
    if (contactlist) {
      res
        .status(200)
        .json({ page, limit, totalItems, totalPages, contactlist });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// contactpending Management
route.post("/contactpending", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  const page = parseInt(req.body.currentpage) || 1;
  const limit = parseInt(req.body.datalimit) || 12;
  const totalItems = await Contact.countDocuments({
    status: false,
    deleted: false,
    talk: false
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const contactlist = await Contact.find({
      status: false,
      deleted: false,
      talk: false
    })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);

    if (!contactlist)
      return res.status(404).json({ msg: "Access Denied", status: false });
    if (contactlist) {
      res
        .status(200)
        .json({ page, limit, totalItems, totalPages, contactlist });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// One contact Management
route.post("/contactwithid", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  try {
    const data = await Contact.findById({ _id: req.body.id });

    if (!data)
      return res.status(404).json({ msg: "Access Denied", status: false });
    if (data) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// Contact Management Approval
route.post("/contactapproval", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(500).json("Access Denied");
  try {
    let data = await Contact.findById({ _id: req.body.id });
    if (!data)
      return res.status(404).json({ msg: "Access Denied!", status: false });
    if (data) {
      data = await Contact.findByIdAndUpdate(
        { _id: req.body.id },
        { status: true, deleted: false }
      );
      res.status(200).json({ msg: "Approved", status: true });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// Contact Management revert
route.post("/contactrevert", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(500).json("Access Denied");
  try {
    let data = await Contact.findById({ _id: req.body.id });
    if (!data)
      return res.status(404).json({ msg: "Access Denied!", status: false });
    if (data) {
      data = await Contact.findByIdAndUpdate(
        { _id: req.body.id },
        { status: false, deleted: true }
      );
      res.status(200).json({ msg: "reverted", status: true });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error", status: false });
  }
});
// Contact Management Delete
route.post("/contactdelete", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(500).json("Access Denied");
  try {
    let data = await Contact.findById({ _id: req.body.id });
    if (!data)
      return res.status(404).json({ msg: "Access Denied!", status: false });
    if (data) {
      data = await Contact.findByIdAndDelete({ _id: req.body.id });
      res.status(200).json({ msg: "Deleted", status: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error", status: false });
  }
});

module.exports = route;
