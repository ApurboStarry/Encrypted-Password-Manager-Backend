const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Files = mongoose.model("Files", photoSchema);

function validateFiles(file) {
  const schema = Joi.object({
    name: Joi.string().required(),
    // ownerId: Joi.objectId().required(), // user doesn't need to pass his ownerId as "middleware/auth.js" has set req.user by verifying JWT token
    // location: Joi.string().required(), // location should not be validated here as this function validates user input. and location is set by ourselves
  });

  return schema.validate(file);
}

module.exports.Files = Files;
module.exports.validate = validateFiles;
