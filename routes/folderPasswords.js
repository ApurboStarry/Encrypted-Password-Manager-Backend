const express = require("express");
const { Folder } = require("../models/folder");
const { FolderPassword } = require("../models/folderPassword");
const { Password } = require("../models/password");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/:folderId", auth, async (req, res) => {
  const isValidId = req.params.folderId.length == 24;
  if (!isValidId) return res.status(400).send("Invalid ID");

  const folder = await Folder.findOne({
    _id: req.params.folderId,
    ownerId: req.user._id,
  });
  if (!folder) {
    return res.status(400).send("No folder with the given ID was found");
  }

  const folderPasswords = await FolderPassword
    .find({ folderId: req.params.folderId, })
    .populate("passwordId", "url username password")
    .select("-__v");
  
  res.send(folderPasswords);
});

router.post("/:folderId/:passwordId", auth, async (req, res) => {
  const isValidId =
    req.params.folderId.length == 24 && req.params.passwordId.length == 24;
  if (!isValidId) return res.status(400).send("Invalid ID");

  const folder = await Folder.findOne({
    _id: req.params.folderId,
    ownerId: req.user._id,
  });
  if (!folder) {
    return res.status(400).send("No folder with the given ID was found");
  }

  const password = await Password.findOne({ _id: req.params.passwordId, ownerId: req.user._id });
  if(!password) {
    return res.status(400).send("No password with the given ID was found");
  }

  let folderPassword = await FolderPassword.findOne({ folderId: req.params.folderId, passwordId: req.params.passwordId });
  if(folderPassword) {
    return res.status(400).send("Password already exists in the folder");
  }

  folderPassword = new FolderPassword({
    folderId: req.params.folderId,
    passwordId: req.params.passwordId
  });
  folderPassword = await folderPassword.save();

  res.send(folderPassword);
});

router.delete("/:folderId/:passwordId", auth, async (req, res) => {
  const isValidId =
    req.params.folderId.length == 24 && req.params.passwordId.length == 24;
  if (!isValidId) return res.status(400).send("Invalid ID");

  const folder = await Folder.findOne({
    _id: req.params.folderId,
    ownerId: req.user._id,
  });
  if (!folder) {
    return res.status(400).send("No folder with the given ID was found");
  }

  const password = await Password.findOne({
    _id: req.params.passwordId,
    ownerId: req.user._id,
  });
  if (!password) {
    return res.status(400).send("No password with the given ID was found");
  }

  let folderPassword = await FolderPassword.findOneAndRemove({
    folderId: req.params.folderId,
    passwordId: req.params.passwordId
  });
  if(!folderPassword) {
    return res.status(400).send("The password with the given ID was not in the folder with the given ID");
  }

  return res.send(folderPassword);
});

module.exports = router;
