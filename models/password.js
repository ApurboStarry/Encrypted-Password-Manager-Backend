const Joi = require("joi");
Joi.objectId = require("joi-objectid");
const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder"
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Password = mongoose.model("Password", passwordSchema);

function validatePassword(password) {
  const schema = Joi.object({
    url: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    folderId: Joi.string().required()
  });

  return schema.validate(password);
}

module.exports.Password = Password;
module.exports.validate = validatePassword;