const { rejects } = require("assert");
const path = require("path");
const firebase = require("firebase/app");
const fs = require("fs");
const { resolve } = require("path");
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7vR8hOU7g88ng4K4X24h47iUleOF1S6M",
  authDomain: "encrypted-password-manager.firebaseapp.com",
  projectId: "encrypted-password-manager",
  storageBucket: "encrypted-password-manager.appspot.com",
  messagingSenderId: "392647849670",
  appId: "1:392647849670:web:efff175d3841f8d8afc9c7",
  measurementId: "G-52JZN3K986",
};

firebase.initializeApp(firebaseConfig);

const storageRef = firebase.storage().ref();

async function uploadToFirebase(userId, filename) {
  const fileLocationInFirebase = userId + "/" + filename;
  console.log("fileLocationInFirebase", fileLocationInFirebase);
  const fileLocationInServer = path.join(__dirname, "../") + "fileUploads/" + userId + filename;

  console.log("fileLocationInServer", fileLocationInServer);

  // first upload to firebase
  const imagesRef = storageRef.child(fileLocationInFirebase); // child("file name to be created")
  var metadata = {
    contentType: "application/pdf",
  };

  const fsPromise = await fs.promises.readFile(fileLocationInServer);
  // console.log("fsPromise", fsPromise);
  try {
    const snapshot = await imagesRef.put(fsPromise.buffer, metadata);
  } catch (error) {
    console.error(error);
  }
  console.log("File uploaded");

  const url = await storageRef.child(fileLocationInFirebase).getDownloadURL();
  // console.log(url);
  return new Promise((resolve, reject) => {
    resolve(url);
  });
}

module.exports = uploadToFirebase;
