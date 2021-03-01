const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const folderPasswordSchema = new mongoose.Schema({
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
  },
  passwordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Password"
  },
});

const FolderPassword = mongoose.model("FolderPassword", folderPasswordSchema);

module.exports.FolderPassword = FolderPassword;