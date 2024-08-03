const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const authSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
});

authSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Auth", authSchema);
