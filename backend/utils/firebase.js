const admin = require("firebase-admin");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const serviceAccount = require("../config/firebaseServiceAccount.json"); // 🔐 You'll need to generate this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "no-qash-project.appspot.com", // 🔁 Replace with your Firebase Storage bucket
});

const bucket = admin.storage().bucket();

const uploadToFirebase = async (file) => {
  const uniqueName = `${Date.now()}-${file.originalname}`;
  const fileUpload = bucket.file(uniqueName);
  const uuid = uuidv4();

  return new Promise((resolve, reject) => {
    fileUpload
      .createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: uuid,
          },
        },
      })
      ///
      .on("error", reject)
      .on("finish", () => {
        const url = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(uniqueName)}?alt=media&token=${uuid}`;
        resolve(url);
      })
      .end(file.buffer);
  });
};

module.exports = uploadToFirebase;
