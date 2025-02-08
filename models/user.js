const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true }, 
  githubId: { type: String, unique: true, sparse: true }, 
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: String,
});

module.exports = mongoose.model("User", userSchema);

