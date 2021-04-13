const auth = require("../middlewares/auth");
const express = require("express");
const { Files, validate } = require("../models/files");
const router = express.Router();
const upload = require("../fileUploadService/multerFileHandler");
const uploadToFirebase = require("../fileUploadService/firebaseUpload");

router.post("/", [auth, upload.single("image")], async (req, res) => {
  if (!req.uploadedFile) {
    return res.status(400).send("Invalid input file");
  }

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

  const fileLocation = await uploadToFirebase(
    req.user._id,
    req.uploadedFile.originalname
  );
  // uploadToFirebase(req.user._id, req.file.originalname);
  console.log("req.body.folderId", req.body.folderId);

  file = new Files({
    name: req.uploadedFile.originalname,
    ownerId: req.user._id,
    location: fileLocation,
  });
  file = await file.save();

  res.send({
    _id: file._id,
    name: file.name,
  });
});


module.exports = router;