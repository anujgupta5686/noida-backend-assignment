const mongoose = require("mongoose");
const createUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "active",
  },
  register_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CreateUser", createUserSchema);
