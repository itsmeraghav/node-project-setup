const mongoose = require("mongoose");
const moment = require("moment");
const fcmNode = require("fcm-node");
const fcm = new fcmNode("ABC5DEfF78G7I5JKL8MNO7PQR8ST5UVnasdWXYZa5bjcFh6ijk123456789");

const randomString = (
  length = 30,
  charSet = "ABC5DEfF78G7I5JKL8MNO7PQR8ST5UVnasdWXYZa5bjcFh6ijk123456789"
) => {
  let randomString = "";
  for (let i = 0; i < length; i++) {
    let randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  let time = new Date().valueOf();
  return randomString + time;
};

const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

// eslint-disable-next-line no-console
const logError = console.error;

/**
 * @param {string} objectId
 * @return {boolean}
 */
const isValidObjectId = (objectId) => {
  if (mongoose.Types.ObjectId.isValid(objectId)) {
    const id = new mongoose.Types.ObjectId(objectId);
    return id.toString() === objectId;
  }
  return false;
};

const utcDate = (date = new Date()) => {
  date = new Date(date); 
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0
    )
  );
};

const utcDateTime = (date = new Date()) => {
  date = new Date(date);
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    )
  );
};

const generateResetToken = (length = 4) => {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  );
};

const generateOtp = (length = 4, charSet = "1234567890") => {
  let randomString = "";
  for (let i = 0; i < length; i++) {
    let randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  //return randomString;
  if (process.env.NODE_ENV == "development") {
    return randomString;
  } else {
    return randomString;
  }
};

const showDate = (date, format = "MMM DD YYYY hh:mm A", toLocale = false) => {
  date = toLocale ? new Date(date).toLocaleString() : date;
  //return utcDate(date).toString() !== "Invalid Date" ? moment.utc(date).format(format) : "N/A";
  return moment(date).format(format);
};

const showTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

const fromNow = (date) => moment(date).fromNow();

const sendFCMPush = (
  tokens,
  title,
  body,
  data = {},
  priority = "high",
  notificationOptions = {
    click_action: "FCM_PLUGIN_ACTIVITY",
    icon: "ic_stat_icon",
    sound: "default",
    vibrate: true,
  }
) => {
  tokens = !Array.isArray(tokens) ? [tokens] : tokens;
  const fcmMessage = {
    registration_ids: tokens,
    collapse_key: "",
    priority,
    content_available: true,
    notification: {
      title,
      body,
      ...notificationOptions,
    },
    data: {
      PATH: data,
    },
  };

  fcm.send(fcmMessage, function(err, response) {
    console.log("FCM Error", err);
    console.log("FCM response", response);
  });
};

const sendIosVideoCallNotification = (values) => {
  const { deviceIds, data, notification, apns, android } = values;        
  deviceIds.forEach(element => {   
      const notificationObject = { to: element, notification, data, apns, android};
      // console.log("----notificationObject sendIosVideoCallNotification----",notificationObject)
      console.log("----notificationObject sendIosVideoCallNotification----");
      fcm.send(notificationObject, function (err, response) {
          if (err) {
              console.log("Something has gone wrong!", err);
          } else {
              console.log("Successfully sent sendIosVideoCallNotification with response: ", response);
          }
      });  
  }); 
}

module.exports = {
  escapeRegex,
  logError,
  isValidObjectId,
  utcDate,
  utcDateTime,
  randomString,
  generateResetToken,
  showDate,
  showTime,
  fromNow,
  sendFCMPush,
  generateOtp,
  sendIosVideoCallNotification
};
