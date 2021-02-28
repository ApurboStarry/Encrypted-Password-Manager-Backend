const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {

});

router.get("/:id", (req, res) => {
  return res.send("Hello world");
});

router.post("/", auth, (req, res) => {
  res.send("Posted");
});

router.put("/:id", (req, res) => {

});

router.delete("/:id", (req, res) => {

});

module.exports = router;