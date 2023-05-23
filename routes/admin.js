const express = require("express");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const adminController = require("../controllers/admin");
const router = express.Router();
const routerDetail = require("../controllers/index");
// phân quyền
async function requireAdmin(req, res, next) {
  const sessionEmail = req.session.email;
  const token = req.body.token;
  if (sessionEmail) {
    try {
      const user = await User.findOne({ email: sessionEmail });
      if (!user) {
        return res.status(200).json({
          status: false,
          message: "Tài khoản không tồn tại",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  } else if (token) {
    try {
      const user = await User.findOne({ token: token });
      if (!user) {
        return res.status(200).json({
          status: false,
          message: "Tài khoản không tồn tại",
        });
      }
      if (user.level === "admin") {
        next();
      } else {
        res.status(403).send("Liên Hệ 0999999999");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  } else {
    res.render("404");
  }
}
// index
///
router.get("/add-product", requireAdmin, adminController.getProductForm);

router.post("/add-product", requireAdmin, adminController.postProduct);
router.get("/view-products", requireAdmin, adminController.getProductForm2);
router.post("/view-products", requireAdmin, adminController.getProductForm2);
//
router.get("/detail", routerDetail.getDetail);
router.post("/detail", routerDetail.getDetail);

router.get(
  "/edit-product/:prodId",
  requireAdmin,
  adminController.editProductPage
);

router.post("/edit-product", requireAdmin, adminController.editProductPost);

router.post("/delete-product", adminController.deleteProduct);

module.exports = router;
