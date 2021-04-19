const auth = require("../middlewares/auth");
const express = require("express");

const { Files, validate } = require("../models/files");
const { checkFolderExistence } = require("../models/folder");
const upload = require("../fileUploadService/multerFileHandler");
const uploadToFirebase = require("../fileUploadService/firebaseUpload");

const router = express.Router();

function isValidObjectId(objectId) {
  return objectId.match(/^[0-9a-fA-F]{24}$/);
}

router.get("/", auth, async (req, res) => {
  const files = await Files
                      .find({ ownerId: req.user._id })
                      .sort("name")
                      .select("-ownerId -__v");
  res.send(files);
});

router.get("/:id", auth, async (req, res) => {
  const isValidId = isValidObjectId(req.params.id);
  if (!isValidId) return res.status(400).send("Invalid ID");

  const file = await Files.findOne({
    _id: req.params.id,
    ownerId: req.user._id
  });

  if(!file) {
    return res.status(404).send("No file with the given ID was found");
  }

  return res.send({
    name: file.name,
    location: file.location,
    folderId: file.folderId
  });
});

router.post("/", [auth, upload.single("image")], async (req, res) => {
  // Check if file is provided
  if (!req.uploadedFile) {
    return res.status(400).send("Invalid input file");
  }

  // Check if file already exists
  let file = await Files.findOne({
    name: req.uploadedFile.originalname,
    ownerId: req.user._id,
  });
  if (file) {
    return res
      .status(400)
      .send(
        `File with name "${req.uploadedFile.originalname}" already exists`
      );
  }

  // Check validity of "folderId"
  const folder = await checkFolderExistence(req.body.folderId, req.user._id);
  if(!folder) {
    return res.status(400).send("Invalid folder ID");
  }

  const fileLocation = await uploadToFirebase(
    req.user._id,
    req.uploadedFile.originalname
  );

  file = new Files({
    name: req.uploadedFile.originalname,
    ownerId: req.user._id,
    location: fileLocation,
    folderId: req.body.folderId
  });
  file = await file.save();

  res.send({
    _id: file._id,
    name: file.name,
  });
});

router.put("/:id", auth, async (req, res) => {
  const isValidId = isValidObjectId(req.params.id);
  if (!isValidId) return res.status(400).send("Invalid ID");

  if(!req.body.folderId) {
    return res.status(400).send("No 'folderId' provided");
  }

  const folder = await checkFolderExistence(req.body.folderId, req.user._id);
  if (!folder) {
    return res.status(400).send("Invalid folder ID");
  }

  const file = await Files.findOneAndUpdate(
    {
      _id: req.params.id,
      ownerId: req.user._id
    }, 
    {
      folderId: req.body.folderId
    }, 
    {
      new: true
    }
  );

  if(!file) {
    return res.status(400).send("No file with the given ID was found");
  }

  return res.send({
    name: file.name,
    location: file.location,
    folderId: file.folderId
  });
});

router.delete("/:id", auth, async (req, res) => {
  const isValidId = isValidObjectId(req.params.id);
  if (!isValidId) return res.status(400).send("Invalid ID");

  let file = await Files.findOne({
    _id: req.params.id,
    ownerId: req.user._id
  });
  if(!file) {
    return res.status(400).send("No file with the given ID was found");
  }

  file = await Files.findOneAndRemove({
    _id: req.params.id,
    ownerId: req.user._id
  });

  return res.send({
    name: file.name
  });
});


module.exports = router;