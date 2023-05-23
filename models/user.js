const { default: mongoose } = require("mongoose");

const schema = mongoose.Schema;
const userSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ["member", "admin"],
    default: "member",
  },
});
module.exports = mongoose.model("users", userSchema);
