const express = require("express");

const { FolderPassword } = require("../models/folderPassword");
const { Password, validate } = require("../models/password");
const { checkFolderExistence } = require("../models/folder");
const { User } = require("../models/user");
const auth = require("../middlewares/auth");

const router = express.Router();

function isValidObjectId(objectId) {
  return objectId.match(/^[0-9a-fA-F]{24}$/);
}

router.get("/", auth, async (req, res) => {
  const passwords = await Password.find({ ownerId: req.user._id })
    .sort("url")
    .select("-ownerId");

  res.send(passwords);
});

router.get("/:id", auth, async (req, res) => {
  const isValidId = isValidObjectId(req.params.id);
  if (!isValidId) return res.status(400).send("Invalid ID");

  const password = await Password.findOne({
    _id: req.params.id,
    ownerId: req.user._id,
  });
  if (!password) {
    return res.status(404).send("The password with the given ID was not found");
  }

  return res.send({
    url: password.url,
    username: password.username,
    password: password.password,
    folderId: password.folderId
  });
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const folder = await checkFolderExistence(req.body.folderId, req.user._id);
  if (!folder) {
    return res.status(400).send("No folder with the given ID was found");
  }

  let password = new Password({
    url: req.body.url,
    username: req.body.username,
    password: req.body.password,
    folderId: req.body.folderId,
    ownerId: req.user._id,
  });

  password = await password.save();

  res.send({ _id: password._id, url: password.url });
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isValidId = isValidObjectId(req.params.id);
  if (!isValidId) return res.status(400).send("Invalid ID");

  const password = await Password.findOneAndUpdate(
    {
      _id: req.params.id,
      ownerId: req.user._id,
    },
    {
      url: req.body.url,
      username: req.body.username,
      password: req.body.password,
      folderId: req.body.folderId
    },
    {
      new: true,
    }
  );
  if (!password) {
    return res.status(404).send("The password with the given ID was not found");
  }

  res.send({
    _id: password._id,
    url: password.url,
    username: password.username,
    password: password.password,
  });
});

router.delete("/:id", auth, async (req, res) => {
  const isValidId = isValidObjectId(req.params.id);
  if (!isValidId) return res.status(400).send("Invalid ID");

  let password = await Password.findOne({
    _id: req.params.id,
    ownerId: req.user._id,
  });
  if (!password) {
    return res.status(400).send("No password with the given ID was found");
  }

  password = await Password.findOneAndRemove({ _id: req.params.id });
  res.send({
    _id: password._id,
    url: password.url,
  });
});

module.exports = router;
