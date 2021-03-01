require("express-async-errors");
const winston = require("winston");
const error = require("./middlewares/error");
const config = require("config");
const mongoose = require("mongoose");
const users = require("./routes/users");
const auth = require("./routes/auth");
const folderPasswords = require("./routes/folderPasswords");
const folders = require("./routes/folders");
const passwords = require("./routes/passwords");
const express = require("express");

const app = express();

winston.handleExceptions(new winston.transports.File({ filename: "uncaughtExceptions.log" }));

process.on("unhandledRejection", (ex) => {
  throw ex;
});

if(!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: 'jwtPrivateKey' is not defined");
  process.exit(1);
}

mongoose
  .connect(
    "mongodb+srv://apurbo:984621kk@cluster0.potfq.mongodb.net/EncryptedPasswordManager?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("FATAL ERROR: Could not connect to MongoDB");
    process.exit(1);
  });

// Middlewares
app.use(express.json());
app.use("/api/v1/passwords", passwords);
app.use("/api/v1/folders", folders);
app.use("/api/v1/folderPasswords", folderPasswords);
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);

app.use(error);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
