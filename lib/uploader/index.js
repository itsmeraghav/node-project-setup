const fs = require("fs");
const AWS = require("aws-sdk");
const { logError, randomString } = require("../util");
const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;
const region = process.env.AWS_S3_REGION;
const bucket = process.env.AWS_S3_BUCKET;
var mime = require("mime-types");
AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
  ACL: "public-read",
});
const s3 = new AWS.S3({
  sslEnabled: process.env.AWS_S3_SECURE === "true",
});
const S3_BASE = `https://${bucket}.s3.${region}.amazonaws.com/`;

const getSignedUrl = (location, extension) =>
  new Promise((resolve, reject) => {
    const fname = randomString() + "." + extension;
    console.log("this is fname", fname);
    const key = `${location}/${fname}`;
    s3.getSignedUrl(
      "putObject",
      {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        ACL: "public-read",
      },
      (err, data) => {
        if (err) return reject(err);
        resolve({
          url: data,
          preview: `${S3_BASE}${key}`,
          fileName: fname,
        });
      }
    );
  });

const upload = (files, location, extension = "pdf") => {
  const urlsArr = [];
  const onErr = (err) => {
    logError("Error in uploading file: ", err);
    return null;
  };
  files = !Array.isArray(files) ? [files] : files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    var fileExtention = mime.extension(file.mimetype);
    let namePath = randomString();
    const fileUrl = `https://debtrons.s3.amazonaws.com/file-uploaded/${namePath}.${fileExtention}`;
    const filePath = `file-uploaded/${namePath}.${fileExtention}`;

    s3.putObject(
      {
        Bucket: bucket,
        Key: filePath,
        Body: file.data,
        ACL: "public-read",
        ContentType: file.mimetype,
      },
      (uploadErr) => {
        console.log("errror====--->", uploadErr);
        uploadErr && onErr(uploadErr);
      }
    );
    urlsArr.push(fileUrl);
  }
  return urlsArr && urlsArr.length === 1 ? urlsArr[0] : urlsArr;
};

const deleteObj = (Key) =>
  new Promise((resolve) => {
    s3.deleteObject(
      {
        Bucket: bucket,
        Key,
      },
      (error) => {
        if (error) {
          logError("Error in uploading file: ", error);
          resolve(false);
        }
        resolve(true);
      }
    );
  });

module.exports = {
  getSignedUrl,
  upload,
  deleteObj,
};
