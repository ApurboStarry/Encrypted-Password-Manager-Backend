const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Folder = mongoose.model("Folder", folderSchema);

function validateFolder(folder) {
  const schema = Joi.object({
    name: Joi.string().required()
  });

  return schema.validate(folder);
}

async function checkFolderExistence(folderId, ownerId) {
  return await Folder.findOne({
    _id: folderId,
    ownerId: ownerId,
  });
}

async function createDefualtFolder(ownerId) {
  let folder = new Folder({ 
    name: "uncategorized",
    ownerId: ownerId
  });

  folder = await folder.save();
  return folder._id;
}

module.exports.Folder = Folder;
module.exports.validate = validateFolder;
module.exports.checkFolderExistence = checkFolderExistence;
module.exports.createDefualtFolder = createDefualtFolder;