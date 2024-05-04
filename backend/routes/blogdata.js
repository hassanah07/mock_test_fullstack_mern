const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Blogpost = require("../model/Blogpost");
const fetchUser = require("../middleware/fetchuser");
const fetchAdmin = require("../middleware/fetchAdmin");

router.post("/write", async (req, res) => {
  try {
    const blog = await Blogpost.findOne({ blogId: req.body.blogId });
    let title = req.body.slug;
    // title = title.replace(/\s{2,}/g, " ").trim();
    let convertSlug = req.body.slug.replaceAll(" ", "-");
    // convertSlug = convertSlug.replace(/\s{2,}/g, " ").trim();
    const pera = req.body.desc;
    const shortPera = pera.substring(0, 150);
    if (!blog) {
      const blogpost = await Blogpost.create({
        heading: req.body.title,
        author: req.body.author,
        userId: req.body.userId,
        blogId: req.body.blogId,
        slug: convertSlug,
        title: title,
        category: req.body.category,
        desc: shortPera,
        image: req.body.image,
        step: 0
      });
      res.status(200).json({ msg: "Data Added Successfully!", status: true });
    } else {
      res.status(409).json({ msg: "Data Added Already!", status: false });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error !", status: false });
  }
});

router.post("/update", fetchUser, async (req, res) => {
  const userId = req.user.id;
  if (!userId)
    return res.status(403).json({ msg: "Login Again", status: false });
  try {
    const updateStatus = await Blogpost.findOne({
      updateId: req.body.updateId
    });
    if (!updateStatus) {
      let blog = await Blogpost.findOne({ blogId: req.body.blogId });
      let convertSlug = req.body.slug.replaceAll(" ", "-");
      const pera = req.body.desc;
      const shortPera = pera.substring(0, 150);
      if (!blog) {
        res.status(200).json({ msg: "Blog Not Found", status: false });
      } else {
        blog = await Blogpost.findOneAndUpdate(
          { blogId: req.body.blogId },
          {
            heading: req.body.heading,
            content: req.body.content,
            title: req.body.title,
            slug: convertSlug,
            updateId: req.body.updateId,
            desc: shortPera,
            image: req.body.image,
            step: 0
          }
        );
        res.status(200).json({ msg: "Updated Successfully", status: true });
      }
    } else {
      res.status(200).json({ msg: "Already Updated", status: true });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", status: false });
  }
});
// step one
router.post("/stepone", fetchUser, async (req, res) => {
  const userId = req.user.id;
  if (!userId)
    return res.status(404).json({ msg: "Login Again", status: false });
  try {
    const updateStatus = await Blogpost.findOne({
      updateId: req.body.updateId
    });
    if (!updateStatus) {
      let blog = await Blogpost.findOne({ blogId: req.body.blogId });
      if (!blog) {
        res.status(200).json({ msg: "Blog Not Found", status: false });
      } else {
        blog = await Blogpost.findOneAndUpdate(
          { blogId: req.body.blogId },
          {
            content: req.body.content,
            updateId: req.body.updateId,
            step: 1
          }
        );
        res.status(200).json({ msg: "Updated Successfully", status: true });
      }
    } else {
      res.status(200).json({ msg: "Already Updated", status: true });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", status: false });
  }
});
// step two 2222
router.post("/steptwo", fetchUser, async (req, res) => {
  const userId = req.user.id;
  if (!userId)
    return res.status(404).json({ msg: "Login Again", status: false });
  try {
    const updateStatus = await Blogpost.findOne({
      updateId: req.body.updateId
    });
    if (!updateStatus) {
      let blog = await Blogpost.findOne({ blogId: req.body.blogId });
      if (!blog) {
        res.status(200).json({ msg: "Blog Not Found", status: false });
      } else {
        blog = await Blogpost.findOneAndUpdate(
          { blogId: req.body.blogId },
          {
            contentTwo: req.body.contentTwo,
            updateId: req.body.updateId,
            step: 2
          }
        );
        res.status(200).json({ msg: "Updated Successfully", status: true });
      }
    } else {
      res.status(200).json({ msg: "Already Updated", status: true });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", status: false });
  }
});
// step three 3333
router.post("/stepthree", fetchUser, async (req, res) => {
  const userId = req.user.id;
  if (!userId)
    return res.status(403).json({ msg: "Login Again", status: false });
  try {
    const updateStatus = await Blogpost.findOne({
      updateId: req.body.updateId
    });

    if (!updateStatus) {
      let blog = await Blogpost.findOne({ blogId: req.body.blogId });
      if (!blog) {
        res.status(200).json({ msg: "Blog Not Found", status: false });
      } else {
        blog = await Blogpost.findOneAndUpdate(
          { blogId: req.body.blogId },
          {
            contentThree: req.body.contentThree,
            updateId: req.body.updateId,
            step: 3
          }
        );
        res.status(200).json({ msg: "Updated Successfully", status: true });
      }
    } else {
      res.status(200).json({ msg: "Already Updated", status: true });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", status: false });
  }
});
// view all blogs here
router.post("/myblogpost", async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 12;

    const totalItems = await Blogpost.countDocuments();
    const totalPages = Math.ceil(totalItems / pageSize);

    const skipItems = (page - 1) * pageSize;
    const blogposts = await Blogpost.find().skip(skipItems).limit(pageSize);

    res.status(200).json({
      page,
      pageSize,
      totalItems,
      totalPages,
      blogposts
    });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});
// get all blog data
router.post("/getdata", fetchUser, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.body.page) || 1;
  const pageSize = parseInt(req.body.pageSize) || 12;

  const totalItems = await Blogpost.countDocuments({
    userId: userId,
    status: false,
    deleted: false
  });
  const totalPages = Math.ceil(totalItems / pageSize);

  const skipItems = (page - 1) * pageSize;
  try {
    let blogposts = await Blogpost.find({
      userId: userId,
      status: false,
      deleted: false
    })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(pageSize);
    res.status(200).json({
      page,
      pageSize,
      totalItems,
      totalPages,
      blogposts
    });
    // res.json(blogpost);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});
// get step one blog data
router.post("/getstepone", fetchUser, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.body.page) || 1;
  const pageSize = parseInt(req.body.pageSize) || 12;

  const totalItems = await Blogpost.countDocuments({
    userId: userId,
    status: false,
    deleted: false,
    step: 0
  });
  const totalPages = Math.ceil(totalItems / pageSize);

  const skipItems = (page - 1) * pageSize;
  try {
    let blogposts = await Blogpost.find({
      userId: userId,
      status: false,
      deleted: false,
      step: 0
    })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(pageSize);
    res.status(200).json({
      page,
      pageSize,
      totalItems,
      totalPages,
      blogposts
    });
    // res.json(blogpost);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});
// get step two blog data
router.post("/getsteptwo", fetchUser, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.body.page) || 1;
  const pageSize = parseInt(req.body.pageSize) || 12;

  const totalItems = await Blogpost.countDocuments({
    userId: userId,
    status: false,
    deleted: false,
    step: 1
  });
  const totalPages = Math.ceil(totalItems / pageSize);

  const skipItems = (page - 1) * pageSize;
  try {
    let blogposts = await Blogpost.find({
      userId: userId,
      status: false,
      deleted: false,
      step: 1
    })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(pageSize);
    res.status(200).json({
      page,
      pageSize,
      totalItems,
      totalPages,
      blogposts
    });
    // res.json(blogpost);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});
// get step three blog data
router.post("/getstepthree", fetchUser, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.body.page) || 1;
  const pageSize = parseInt(req.body.pageSize) || 12;

  const totalItems = await Blogpost.countDocuments({
    userId: userId,
    status: false,
    deleted: false,
    step: 2
  });
  const totalPages = Math.ceil(totalItems / pageSize);

  const skipItems = (page - 1) * pageSize;
  try {
    let blogposts = await Blogpost.find({
      userId: userId,
      status: false,
      deleted: false,
      step: 2
    })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(pageSize);
    res.status(200).json({
      page,
      pageSize,
      totalItems,
      totalPages,
      blogposts
    });
    // res.json(blogpost);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});
// get all Approved blog data
router.post("/approved", fetchUser, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.body.page) || 1;
  const pageSize = parseInt(req.body.pageSize) || 12;

  const totalItems = await Blogpost.countDocuments({
    userId: userId,
    status: true,
    deleted: false
  });
  const totalPages = Math.ceil(totalItems / pageSize);

  const skipItems = (page - 1) * pageSize;
  try {
    let blogposts = await Blogpost.find({
      userId: userId,
      status: true,
      deleted: false
    })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(pageSize);
    res.status(200).json({
      page,
      pageSize,
      totalItems,
      totalPages,
      blogposts
    });
    // res.json(blogpost);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});
// get all Approved blog data
router.post("/globel", fetchUser, async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(500).json("Internal Server Error");
  const page = parseInt(req.body.page) || 1;
  const pageSize = parseInt(req.body.pageSize) || 12;

  const totalItems = await Blogpost.countDocuments({
    status: false,
    deleted: false
  });
  const totalPages = Math.ceil(totalItems / pageSize);

  const skipItems = (page - 1) * pageSize;
  try {
    let blogposts = await Blogpost.find({
      status: false,
      deleted: false
    })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(pageSize);
    res.status(200).json({
      page,
      pageSize,
      totalItems,
      totalPages,
      blogposts
    });
    // res.json(blogpost);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
});
// making category wise API End Ponts STARTS FROM HERE => => =>
// making category wise API End Ponts STARTS FROM HERE => => =>
// making category wise API End Ponts STARTS FROM HERE => => =>
// 1. view all blogs (Career)
router.get("/view", async (req, res) => {
  const page = parseInt(req.query.currentpage) || 1;
  const limit = parseInt(req.query.datalimit) || 12;
  const totalItems = await Blogpost.countDocuments({
    status: true,
    category: "career"
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const blogposts = await Blogpost.find({ status: true, category: "career" })
      .sort({ updatedAt: -1 })
      .skip(skipItems)
      .limit(limit);
    res.status(200).json({ page, limit, totalItems, totalPages, blogposts });
  } catch (error) {
    res.status(500).json({ error });
  }
});
// 2. view all blogs *(news blog posts)
router.get("/news", async (req, res) => {
  const page = parseInt(req.query.currentpage) || 1;
  const limit = parseInt(req.query.datalimit) || 12;
  const totalItems = await Blogpost.countDocuments({
    status: true,
    category: "news"
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const blogposts = await Blogpost.find({ status: true, category: "news" })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);
    res.status(200).json({ page, limit, totalItems, totalPages, blogposts });
  } catch (error) {
    res.status(500).json({ error });
  }
});
// 3. view all blogs (Health related)
router.get("/health", async (req, res) => {
  const page = parseInt(req.query.currentpage) || 1;
  const limit = parseInt(req.query.datalimit) || 12;
  const totalItems = await Blogpost.countDocuments({
    status: true,
    category: "health"
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const blogposts = await Blogpost.find({ status: true, category: "health" })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);
    res.status(200).json({ page, limit, totalItems, totalPages, blogposts });
  } catch (error) {
    res.status(500).json({ error });
  }
});
// 4. view all blogs (Education Related)
router.get("/education", async (req, res) => {
  const page = parseInt(req.query.currentpage) || 1;
  const limit = parseInt(req.query.datalimit) || 12;
  const totalItems = await Blogpost.countDocuments({
    status: true,
    category: "education"
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const blogposts = await Blogpost.find({
      status: true,
      category: "education"
    })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);
    res.status(200).json({ page, limit, totalItems, totalPages, blogposts });
  } catch (error) {
    res.status(500).json({ error });
  }
});
// 5. view all blogs (Sports related)
router.get("/sports", async (req, res) => {
  const page = parseInt(req.query.currentpage) || 1;
  const limit = parseInt(req.query.datalimit) || 12;
  const totalItems = await Blogpost.countDocuments({
    status: true,
    category: "sports"
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const blogposts = await Blogpost.find({ status: true, category: "sports" })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);
    res.status(200).json({ page, limit, totalItems, totalPages, blogposts });
  } catch (error) {
    res.status(500).json({ error });
  }
});
// 5. view all blogs (Drugs related)
router.get("/medicine", async (req, res) => {
  const page = parseInt(req.query.currentpage) || 1;
  const limit = parseInt(req.query.datalimit) || 12;
  const totalItems = await Blogpost.countDocuments({
    status: true,
    category: "medicine"
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const blogposts = await Blogpost.find({
      status: true,
      category: "medicine"
    })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);
    res.status(200).json({ page, limit, totalItems, totalPages, blogposts });
  } catch (error) {
    res.status(500).json({ error });
  }
});
// making category wise API End Ponts FINISHED AT HERE => => =>
// making category wise API End Ponts FINISHED AT HERE => => =>
// making category wise API End Ponts FINISHED AT HERE => => =>
// view all blogs for logged in users
router.get("/allview", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const blog = await Blogpost.find({});
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// view a specific blog posted by the user
router.post("/specificdata", async (req, res) => {
  try {
    const data = await Blogpost.findOne({ blogId: req.body.blogId });
    if (!data) {
      res.status(404).json({ msg: "Data Not Found!" });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// get sitemap blogs
router.get("/sitemap", async (req, res) => {
  try {
    const blogposts = await Blogpost.find({ status: true, deleted: false });
    if (!blogposts) {
      res.status(404).json({ msg: "Data Not Found!" });
    } else {
      res.status(200).json(blogposts);
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// get RSS Feed blogs
router.get("/rssfeed", async (req, res) => {
  try {
    const blogposts = await Blogpost.find({
      status: true,
      category: "career"
    }).sort({ updatedAt: -1 });

    if (!blogposts) {
      res.status(404).json({ msg: "Data Not Found!" });
    } else {
      res.status(200).json({ blogposts });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// get approved blogs
router.get("/approvedblogs", async (req, res) => {
  const page = parseInt(req.query.currentpage) || 1;
  const limit = parseInt(req.query.datalimit) || 12;
  const totalItems = await Blogpost.countDocuments({
    status: true,
    deleted: false
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const blogposts = await Blogpost.find({ status: true, deleted: false })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);
    if (!blogposts) {
      res.status(404).json({ msg: "Data Not Found!" });
    } else {
      res.status(200).json({ page, limit, totalItems, totalPages, blogposts });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// get approved blogs
router.get("/pendingblogs", async (req, res) => {
  const page = parseInt(req.query.currentpage) || 1;
  const limit = parseInt(req.query.datalimit) || 12;
  const totalItems = await Blogpost.countDocuments({
    status: false,
    deleted: false
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const blogposts = await Blogpost.find({ status: false, deleted: false })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);
    if (!blogposts) {
      res.status(404).json({ msg: "Data Not Found!" });
    } else {
      res.status(200).json({ page, limit, totalItems, totalPages, blogposts });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// get approved blogs
router.get("/deletedblogs", async (req, res) => {
  const page = parseInt(req.query.currentpage) || 1;
  const limit = parseInt(req.query.datalimit) || 12;
  const totalItems = await Blogpost.countDocuments({
    status: false,
    deleted: true
  });
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const blogposts = await Blogpost.find({ status: false, deleted: true })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);
    if (!blogposts) {
      res.status(404).json({ msg: "Data Not Found!" });
    } else {
      res.status(200).json({ page, limit, totalItems, totalPages, blogposts });
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// making a post draft
router.post("/drafted", fetchUser, async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(404).json("Access Denied");
  try {
    // const blog = await Blogpost.findOne({ blogId: req.body.blogId });
    const deleted = await Blogpost.findOneAndUpdate(
      { blogId: req.body.blogId },
      { status: false, deleted: true }
    );
    res.status(200).json({ msg: true });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// delete a specific blog
router.post("/delete", async (req, res) => {
  try {
    const deleteBlog = await Blogpost.findOneAndDelete({
      blogId: req.body.blogId
    });
    res.status(200).json({ msg: true });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// approve a specific blog
router.post("/approve", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  try {
    const approveBlog = await Blogpost.findOneAndUpdate(
      { blogId: req.body.blogId },
      { status: true }
    );
    res.status(200).json({ msg: true });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// approve a specific blog
router.post("/isdeleted", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  try {
    // const blog = await Blogpost.findOne({ blogId: req.body.blogId });
    const deleted = await Blogpost.findOneAndUpdate(
      { blogId: req.body.blogId },
      { deleted: true }
    );
    res.status(200).json({ msg: true });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// approve a specific blog
router.post("/restored", fetchAdmin, async (req, res) => {
  const adminId = req.admin.id;
  if (!adminId) return res.status(404).json("Access Denied");
  try {
    const deleted = await Blogpost.findOneAndUpdate(
      { blogId: req.body.blogId },
      { deleted: false }
    );
    res.status(200).json({ msg: true });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// find a blog by slug
router.post("/slugview", async (req, res) => {
  try {
    const blog = await Blogpost.findOne({ slug: req.body.slug });
    if (!blog) {
      res.status(404).json({ msg: "Blog Not Found" });
    } else {
      res.status(200).json(blog);
    }
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// find a blog by blog id
router.post("/latest", async (req, res) => {
  try {
    const blogWithId = await Blogpost.findOne({ blogId: req.body.blogId });
    res.status(200).json({ blogWithId });
    // if (!blogWithId) {
    //   res.status(404).json({ msg: "Blog Not Found" });
    // } else {
    //   res.status(200).json(blogWithId);
    // }
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// post counting process
router.post("/postsperformnot", fetchUser, async (req, res) => {
  const userId = req.user.id;
  try {
    const data = await Blogpost.find({ userId: userId, status: false });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
router.post("/postsperform", fetchUser, async (req, res) => {
  const userId = req.user.id;
  try {
    const data = await Blogpost.find({ userId: userId, status: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});
// api testing here
router.get("/test", async (req, res) => {
  const page = parseInt(req.query.currentpage) || 1;
  const limit = parseInt(req.query.datalimit) || 12;
  const totalItems = await Blogpost.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);

  const skipItems = (page - 1) * limit;
  try {
    const blogposts = await Blogpost.find({ status: true })
      .sort({ createdAt: -1 })
      .skip(skipItems)
      .limit(limit);
    res.status(200).json({ page, limit, totalItems, totalPages, blogposts });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
