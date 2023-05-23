const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const port = 3000;
const webRoutes = require("./routes/home");
const adminRoutes = require("./routes/admin");
const apiRoutes = require("./routes/api");
const session = require("express-session");
const shopRoutes = require("./routes/shop");

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// views

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
// Thêm middleware để cấu hình CORS
app.use(cors());

app.use(function (req, res, next) {
  res.locals.loggedin = req.session.loggedin;
  res.locals.email = req.session.email;
  next();
});

app.use("/", webRoutes);
app.use("/admin", adminRoutes);
app.use("/api", apiRoutes);
app.use(shopRoutes);

// middleware

app.use((req, res) => {
  return res.render("404");
});

// connect

mongoose
  .connect("mongodb://localhost:27017/book")
  .then((result) => {
    app.listen(port, () => {
      console.log(`ứng dụng đang chạy với port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
