const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const { createDefualtFolder } = require("../models/folder");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 5,
    max: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 5,
    max: 1024,
  },
  defaultFolderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
  },
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, email: this.email }, config.get("jwtPrivateKey"));
  return token;
}

userSchema.methods.getDefaultFolderId = async function() {
  return await createDefualtFolder(this._id);
}

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(255).required()
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;