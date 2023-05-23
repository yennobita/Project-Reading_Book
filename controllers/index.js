const random = require("random-token");
const Product = require("../models/product");
const Comment = require("../models/comment");
const User = require("../models/user");

exports.getIndex = async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("index", { products: products });
  } catch (err) {
    console.log(err);
  }
};

// exports.getDetail = async (req, res) => {
//   try {
//     const slug = req.params.slug;
//     const product = await Product.findOne({ slug: slug });
//     const comments = await Comment.find({ slugProduct: slug });
//     // console.log("Comments : ", comments);

//     res.render("detail", {
//       detailProducts: product,
//       comments: comments,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.getDetail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const product = await Product.findOne({ title: slug });
    const comments = await Comment.find({ slugProduct: slug });

    // console.log("Comments : ", comments);

    res.render("detail", {
      detailProducts: product,
      comments: comments,
    });
  } catch (error) {
    console.log(error);
  }
};
// get slug category

// post comment

exports.postComment = async (req, res) => {
  if (!req.session.loggedin) {
    return res
      .status(200)
      .json({ status: false, message: "Vui Lòng Đăng Nhập Để Tiếp Tục" });
  } else {
    if (req.body.star == "" || req.body.message == "") {
      res.status(200).json({ status: false, message: "Không Được Để Trống" });
    } else {
      const commentLenght = await Comment.count({
        email: req.session.email,
      });
      console.log(
        "Tổng Comment Của Email : ",
        req.session.email,
        "Là : ",
        commentLenght
      );
      if (commentLenght >= 5) {
        res.json({ status: false, message: "Bình Luận Quá 5 Lần !" });
      } else {
        const comment = new Comment({
          email: req.session.email,
          rating: req.body.star,
          comment: req.body.message,
          slugProduct: req.body.slugProduct,
        });
        comment
          .save()
          .then((result) => {
            // console.log(result);
            res.json({ status: true, message: "Bình Luận Thành Công" });
          })
          .catch((error) => {
            console.error(error);
            res
              .status(500)
              .json({ status: false, message: "Lỗi Bình Luận Ròi" });
          });
      }
    }
  }
};

// update comment

exports.updateComment = (req, res, next) => {
  if (!req.session.loggedin) {
    return res.status(200).json({
      status: false,
      message: "Vui Lòng Đăng Nhập Để Tiếp Tục",
    });
  }

  if (req.body.editlistcomment == "") {
    return res.status(200).json({
      status: false,
      message: "Không Được Để Trống",
    });
  }

  Comment.findOne({ _id: req.body.idEditComment, email: req.session.email })
    .then((comment) => {
      if (null) {
        return res.status(200).json({
          status: false,
          message: "Không Tìm Thấy Bình Luận",
        });
      } else {
        comment.comment = req.body.editlistcomment;
        return comment.save();
      }
    })
    .then(() => {
      return res.status(200).json({
        status: true,
        message: "Cập Nhật Bình Luận Thành Công",
      });
    })
    .catch((err) => {
      // console.log(err);
      return res.status(200).json({
        status: false,
        message: "Không Được Edit Bình Luận Của Người Ta!",
      });
    });
};

// delete comment

exports.deleteComment = (req, res) => {
  if (!req.session.loggedin) {
    return res.status(200).json({
      status: false,
      message: "Vui Lòng Đăng Nhập Để Tiếp Tục",
    });
  }
  // console.log(req.body.idDeleteComment);
  // console.log(req.session.email);
  Comment.findOne({ _id: req.body.idDeleteComment, email: req.session.email })
    .then((comment) => {
      console.log(comment); // output : null
      if (null) {
        return res.status(200).json({
          status: false,
          message: "Không Tìm Thấy Bình Luận",
        });
      }

      return Comment.deleteOne({ _id: comment._id });
    })
    .then(() => {
      return res.status(200).json({
        status: true,
        message: "Xóa Bình Luận Thành Công",
      });
    })
    .catch((err) => {
      // console.log('cc',err);
      return res.status(200).json({
        status: false,
        message: "Không Được Xóa Bình Luận Của Người Ta!",
      });
    });
};
