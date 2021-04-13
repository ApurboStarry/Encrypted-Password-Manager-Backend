const path = require("path");
const firebase = require("firebase/app");
const fs = require("fs");
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
  const fileLocationInServer = path.join(__dirname, "../") + "fileUploads/" + userId + filename;

  // first upload to firebase
  const fileRef = storageRef.child(fileLocationInFirebase); // child("file name to be created")

  const fsPromise = await fs.promises.readFile(fileLocationInServer);
  
  const snapshot = await fileRef.put(fsPromise.buffer);
  console.log("File uploaded");

  const url = await storageRef.child(fileLocationInFirebase).getDownloadURL();

  return new Promise((resolve, reject) => {
    resolve(url);
  });
}

module.exports = uploadToFirebase;
