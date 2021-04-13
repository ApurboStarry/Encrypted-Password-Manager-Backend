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

function isValidObjectId(objectId) {
  return objectId.match(/^[0-9a-fA-F]{24}$/);
}

async function checkFolderExistence(folderId, ownerId) {
  // check if "folderId" and "ownerId" is valid object id
  if(!isValidObjectId(folderId) || !isValidObjectId(ownerId)) return null;

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