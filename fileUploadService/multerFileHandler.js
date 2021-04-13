const multer = require("multer");

function removeSpacesInFilename(filename) {
  const modifiedFilename = filename.replace(/ /g, "_");
  return modifiedFilename;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "fileUploads/");
  },
  filename: (req, file, cb) => {
    file.originalname = removeSpacesInFilename(file.originalname);
    req.uploadedFile = file;
    console.log(file);
    cb(null, req.user._id + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
