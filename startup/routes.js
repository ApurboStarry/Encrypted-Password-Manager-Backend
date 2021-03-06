const express = require("express");

const users = require("../routes/users");
const auth = require("../routes/auth");
const folders = require("../routes/folders");
const passwords = require("../routes/passwords");
const filesRouteHandler = require("../routes/filesRouteHandler");

const error = require("../middlewares/error");

module.exports = function(app) {
  app.use(express.json());
  
  app.use("/api/v1/passwords", passwords);
  app.use("/api/v1/files", filesRouteHandler);
  app.use("/api/v1/folders", folders);
  app.use("/api/v1/users", users);
  app.use("/api/v1/auth", auth);

  app.use(error);
}