const {User, validate} = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// for registering users
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if(error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if(user) {
    return res.status(400).send("User already registered");
  }

  user = new User({
    email: req.body.email,
    password: req.body.password
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  
  await user.save();
  const newUser = await User.findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      defaultFolderId: await user.getDefaultFolderId(),
    },
    {
      new: true,
    }
  );

  console.log(newUser);

  const token = user.generateAuthToken();
  
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send({ _id: user._id, email: user.email });
});

module.exports = router;