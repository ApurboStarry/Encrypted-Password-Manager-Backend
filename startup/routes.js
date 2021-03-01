const users = require("../routes/users");
const auth = require("../routes/auth");
const folderPasswords = require("../routes/folderPasswords");
const folders = require("../routes/folders");
const passwords = require("../routes/passwords");
const error = require("../middlewares/error");
const express = require("express");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/v1/passwords", passwords);
  app.use("/api/v1/folders", folders);
  app.use("/api/v1/folderPasswords", folderPasswords);
  app.use("/api/v1/users", users);
  app.use("/api/v1/auth", auth);

  app.use(error);
}