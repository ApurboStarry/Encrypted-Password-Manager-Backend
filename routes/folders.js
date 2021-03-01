const {FolderPassword} = require("../models/folderPassword");
const { Folder, validate } = require("../models/folder");
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const folders = await Folder.find({ ownerId: req.user._id }).sort("name").select("-__v");
  res.send(folders);
});

router.get("/:id", auth, async (req, res) => {
  const isValidId = req.params.id.length == 24;
  if (!isValidId) return res.status(400).send("Invalid ID");

  const folder = await Folder.findOne({ _id: req.params.id, ownerId: req.user._id });
  if(!folder) {
    return res.status(404).send("No folder with the given ID was found");
  }

  res.send(folder);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let folder = await Folder.findOne({ name: req.body.name, ownerId: req.user._id });
  if(folder) {
    return res.status(400).send("A folder with the given name already exists");
  }

  folder = new Folder({
    name: req.body.name,
    ownerId: req.user._id
  });

  folder = await folder.save();
  res.send(folder);
});

router.put("/:id", auth, async (req, res) => {
  const isValidId = req.params.id.length == 24;
  if (!isValidId) return res.status(400).send("Invalid ID");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const folder = await Folder.findOneAndUpdate(
    {
      _id: req.params.id,
      ownerId: req.user._id
    }, 
    {
      name: req.body.name
    }, 
    {
      new: true
    }
  );

  if(!folder) {
    return res.status(404).send("No folder with the given ID was found");
  }

  res.send(folder);
});

router.delete("/:id", auth, async (req, res) => {
  const isValidId = req.params.id.length == 24;
  if (!isValidId) return res.status(400).send("Invalid ID");

  let folder = await Folder.findOne({ _id: req.params.id, ownerId: req.user._id });
  if(!folder) {
    return res.status(404).send("No folder with the given ID was found");
  }

  await FolderPassword.deleteMany({ folderId: req.params.id });
  folder = await Folder.findOneAndRemove({ _id: req.params.id });
  res.send(folder);
});

module.exports = router;