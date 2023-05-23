const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth");
const indexController = require("../controllers/index");
const empoyle = require("../models/product");

// check login
function checkLoggedIn(req, res, next) {
  if (!req.session.loggedin) {
    return res.redirect("/login");
  }
  next();
}

router.get("/", indexController.getIndex);
router.get("/detail/:slug", indexController.getDetail);
router.post("/postComment", indexController.postComment);
router.post("/updateComment", indexController.updateComment);
router.post("/deleteComment", indexController.deleteComment);

router.get("/register", async (req, res, next) => {
  res.render("auth/register");
});

router.get("/login", async (req, res, next) => {
  res.render("auth/login");
});
router.post("/postCreateUser", userController.createUser);
router.post("/postLoginUser", userController.loginUser);
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

router.get("/autocomplete/", async function (req, res, next) {
  try {
    var regex = new RegExp(req.query["term"], "i");
    var empoyleFilter = await empoyle
      .find({ title: regex }, { title: 3, imageURL: 1 }) // Lấy thêm trường imageURL
      .sort({ update_at: -1 })
      .sort({ created_at: -1 })
      .limit(20);
    var result = [];
    if (empoyleFilter && empoyleFilter.length && empoyleFilter.length > 0) {
      empoyleFilter.forEach((product) => {
        let obj = {
          id: product.id,
          label: product.title,
          imageURL: product.imageURL, // Thêm trường imageURL vào kết quả trả về
        };
        result.push(obj);
      });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
