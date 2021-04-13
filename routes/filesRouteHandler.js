const auth = require("../middlewares/auth");
const express = require("express");
const { Files, validate } = require("../models/files");
const { checkFolderExistence } = require("../models/folder");
const router = express.Router();
const upload = require("../fileUploadService/multerFileHandler");
const uploadToFirebase = require("../fileUploadService/firebaseUpload");

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
  console.log("req.body.folderId", req.body.folderId);
  const folder = await checkFolderExistence(req.body.folderId, req.user._id);
  console.log(folder);
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


module.exports = router;