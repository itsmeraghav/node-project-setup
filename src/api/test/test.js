//During the test the env variable is set to test
// process.env.NODE_ENV = "test";
require("custom-env").env("api");
let mongoose = require("mongoose");
const {
  models: { User },
} = require("../../../lib/models");

// let Employee = require("../models/Employee").Employee;

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let authServerRoute = `${process.env.SITE_URL}auth/`;
let should = chai.should();
// console.log('process.envprocess.env', process.env)
chai.use(chaiHttp);

let login_details = {
  email: "shubham@yopmail.com",
  password: "Kipl@123",
  deviceToken: "",
};

let signup_details = {
  name: "Shubham",
  email: "shubham222@yopmail.com",
  password: "Kipl@123",
  confirmPassword: "Kipl@123",
  selectedLanguages: [
    "5ffbdfb98dc29d02c49626eb"
  ]
};

let verify_otp_details = {
  otp: "1234",
  email: "shubham222@yopmail.com",
  otpType: "SIGNUP",
};

let resend_otp_details = {
  email: "shubham@yopmail.com",
  otpType: "SIGNUP",
};

let reset_password_details = {
  token: "CXlbBUaQQWhVPqeSTS",
  email: "shubham@yopmail.com",
  password: "Kipl@1234",
  confirmPassword: "Kipl@1234",
};

let forgotPassword = {
  email: "shubham@yopmail.com",
};

/*
 * Login api
 */
describe("/POST login", () => {
  it("it should login", (done) => {
    chai
      .request(authServerRoute)
      .post("login")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(login_details)
      .end((err, res) => {
        done();
      });
  });
});

/*
 * Signup api
 */

describe("/POST signup", () => {
  it("it should Signup a user", (done) => {
    chai
      .request(authServerRoute)
      .post("signup")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(signup_details)
      .end((err, res) => {
        console.log("err=====---->", err, res.body);
        if (res && !err) {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        }
      });
  });
});

/*
 * Verify OTP api
//  */

describe("/POST verify-otp", () => {
  it("it should verify-otp a user", (done) => {
    chai
      .request(authServerRoute)
      .post("verify-otp")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(verify_otp_details)
      .end((err, res) => {
        console.log("err=======>", err, res.body);
        if (res && !err) {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        }
      });
  });
});

/*
 * Resent OTP api
 */

describe("/POST resend-otp", () => {
  it("it should resend-otp a user", (done) => {
    chai
      .request(authServerRoute)
      .post("resend-otp")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(resend_otp_details)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

/*
 * Reset Password api
 */

describe("/POST reset-password", () => {
  it("it should reset-password a user", (done) => {
    chai
      .request(authServerRoute)
      .post("reset-password")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(reset_password_details)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});
/*
 * Language List api
 */

describe("/GET language_list", () => {
  it("it should language_list a user", (done) => {
    chai
      .request(authServerRoute)
      .get("language_list")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send()
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

/*
 * forgotPassword api
 */
describe("/POST forgot-password", () => {
  it("it should forgot-password", (done) => {
    chai
      .request(authServerRoute)
      .post("forgot-password")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(forgotPassword)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});

let social_login_details = {
  socialType: "apple",
  socailId: "1454asdadad12554asda2sda2s1d",
  deviceToken: "faasder4454er1fdfdf1154",
};
/*
 * social api
 */
describe("/POST social-login", () => {
  it("it should social-login", (done) => {
    chai
      .request(authServerRoute)
      .post("social-login")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(social_login_details)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});

let social_signup_details = {
  name: "Kamlesh",
  email: "kamlesh123@yopmail.com",
  socialType: "apple",
  socailId: "1454asdadad12554asda2sda2s1d",
  deviceToken: "faasder4454er1fdfdf1154",
};
/*
 * social api
 */
describe("/POST social-signup", () => {
  it("it should social-signup", (done) => {
    chai
      .request(authServerRoute)
      .post("social-signup")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(social_signup_details)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});


//--------user routes-------------//
let userServerRoute = `${process.env.SITE_URL}users/`;

let update_profile_language = {
  languageList: [
    "5ffbdfb98dc29d02c49626eb"
  ]
};
/*
 * Update Profile Language
 */
describe("/POST update-profile-language", () => {
  it("User profile langauge update", (done) => {
    chai
      .request(userServerRoute)
      .post("update-profile-language")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(update_profile_language)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});


let update_notification = {
  "notificationStatus": true
};
/*
 * Update Notification
 */
describe("/POST update-notification", () => {
  it("User Notification update", (done) => {
    chai
      .request(userServerRoute)
      .post("update-notification")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(update_notification)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

/*
 * Fetch Porfile
 */
describe("/GET profile", () => {
  it("it shows user profile details", (done) => {
    chai
      .request(authServerRoute)
      .get("profile")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send()
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

/*
 * Fetch Admin settings
 */
describe("/GET get-admin-setting", () => {
  it("it get admin settings details", (done) => {
    chai
      .request(authServerRoute)
      .get("get-admin-setting")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send()
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});


let update_profile = {
  "name": "testing User"
};
/*
 * Update Notification
 */
describe("/POST update-profile", () => {
  it("User update profile completed", (done) => {
    chai
      .request(userServerRoute)
      .post("update-profile")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(update_profile)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});


let profile_complete = {
  "notificationStatus": true
};
/*
 * Update Notification
 */
describe("/POST profile-complete", () => {
  it("User Profile completed", (done) => {
    chai
      .request(userServerRoute)
      .post("profile-complete")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(profile_complete)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});


let change_password = {
  "currentPassword": "12345678",
  "newPassword": "123456789",
  "confirmPassword": "123456789"
};
/*
 * User change password
 */
describe("/POST change-password", () => {
  it("User change password", (done) => {
    chai
      .request(userServerRoute)
      .post("change-password")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(change_password)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

/*
 * get pages
 */
describe("/GET get-page", () => {
  it("Get pages", (done) => {
    chai
      .request(authServerRoute)
      .get("get-page")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send()
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

//--------Destination api--------------//
let update_destination = {
  "latitude": 26.1445,
  "longitude": 75.6214,
  "placemark": "placemark",
  "address": "address",
  "locationSharing": true,
  "deviceTime": 65432
};
/*
 * User update destination
 */
describe("/POST update-destination", () => {
  it("User update destination", (done) => {
    chai
      .request(userServerRoute)
      .post("update-destination")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(update_destination)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

let get_near_by_list = {
  "latitude": 26.1445,
  "longitude": 75.6214,
  "radius": 50
};
/*
 * User get near by list
 */
describe("/POST get-near-by-list", () => {
  it("User get near by list of users", (done) => {
    chai
      .request(userServerRoute)
      .post("get-near-by-list")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(get_near_by_list)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

let favorite_destination = {
  "latitude": 26.1445,
  "longitude": 75.6214,
  "placemark": "placemark",
  "address": "A-23 swej farm new sanganer road jaipur",
  "favoriteStatus": true
};
/*
 * User add favorite destination
 */
describe("/POST favorite-destination", () => {
  it("User favorite destination", (done) => {
    chai
      .request(userServerRoute)
      .post("favorite-destination")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(favorite_destination)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

let favorite_destination_remove = {
  "id": "5ffbf7b3da4baf18437058d1"
};
/*
 * User favorite destination remove
 */
describe("/POST favorite-destination-remove", () => {
  it("User favorite destination remove", (done) => {
    chai
      .request(userServerRoute)
      .post("favorite-destination-remove")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(favorite_destination_remove)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

/*
 * user favorite destination list
 */
describe("/GET favorite-destination-list", () => {
  it("Get favorite destionation list", (done) => {
    chai
      .request(authServerRoute)
      .get("favorite-destination-list")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send()
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

//----------topics api are listed here---------//
let topicsServerRoute = `${process.env.SITE_URL}topics/`;

let add_topic = {
  "topicId": "5ffbf7b3da4baf18437058d1",
  "subTopicId": "600950706396ba1dfc0df307",
  "level": "advanced",
  "status": "true",
  "isLevelChange": "true"
};
/*
 * Topics: add new topic
 */
describe("/POST add-topic", () => {
  it("Topic add a new topic", (done) => {
    chai
      .request(topicsServerRoute)
      .post("add-topic")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(add_topic)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

/*
 * Topics: view list
 */
describe("/GET topic-list", () => {
  it("Get topic list", (done) => {
    chai
      .request(topicsServerRoute)
      .get("topic-list")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send()
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

/*
 * Topics: check-valid-sub-topic-select
 */
describe("/GET check-valid-sub-topic-select", () => {
  it("Get checkvalid sub topic select", (done) => {
    chai
      .request(topicsServerRoute)
      .get("check-valid-sub-topic-select")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send()
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

/*
 * Topics: reset-topic-list
 */
describe("/GET reset-topic-list", () => {
  it("Get reset topic list", (done) => {
    chai
      .request(topicsServerRoute)
      .get("reset-topic-list")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send()
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

let search_sub_topic = {
  "topicId": "5ffbf7b3da4baf18437058d1",
  "searchTerm": "art"
};
/*
 * Topics: add new topic
 */
describe("/POST search-sub-topic", () => {
  it("Topic search sub topic", (done) => {
    chai
      .request(topicsServerRoute)
      .post("search-sub-topic")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(search_sub_topic)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

let suggest_topic = {
  "topicId": "5ffbf7b3da4baf18437058d1",
  "searchTerm": "art"
};
/*
 * Topics: add new topic
 */
describe("/POST suggest-topic", () => {
  it("Topic suggest topic", (done) => {
    chai
      .request(topicsServerRoute)
      .post("suggest-topic")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(suggest_topic)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

let favorite_topic = {
  "topicId": "5ffbf7b3da4baf18437058d1",
  "subTopicId": "600950706396ba1dfc0df307",
  "favoriteStatus": "true"
};
/*
 * Topics: add new topic
 */
describe("/POST favorite-topic", () => {
  it("Topic favorite topic", (done) => {
    chai
      .request(topicsServerRoute)
      .post("favorite-topic")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(favorite_topic)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

describe("/GET main-topic-list", () => {
  it("Get mina topic list", (done) => {
    chai
      .request(topicsServerRoute)
      .get("main-topic-list")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send()
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

describe("/GET favorite-topic-list", () => {
  it("Get favorite topic list", (done) => {
    chai
      .request(topicsServerRoute)
      .get("favorite-topic-list")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send()
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

//-------calls api list --------------//
let callsServerRoute = `${process.env.SITE_URL}calls/`;

let get_video_call_token = {
  "topicId": "5ffbf7b3da4baf18437058d1",
  "subTopicId": "600950706396ba1dfc0df307",
  "description": "This is description of call ",
  "callType": "topic",
  "address": "New sanganer road sodala Jaipur",
  "latitude": 26.1445,
  "longitude": 75.6214,
  "radius": 50
};
/*
 * Calls: get video call token
 */
describe("/POST get-video-call-token", () => {
  it("calls get video call token", (done) => {
    chai
      .request(callsServerRoute)
      .post("get-video-call-token")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(get_video_call_token)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});


let cancle_video_call = {
  "callId": "5ffbf7b3da4baf18437058d1",
  "callerType": "dialler"
};
/*
 * Calls:  cancel video call
 */
describe("/POST cancle-video-call", () => {
  it("calls cancel video call", (done) => {
    chai
      .request(callsServerRoute)
      .post("cancle-video-call")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(cancle_video_call)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});


let check_is_call_start = {
  "roomName": "5ffbf7b3da4baf18437058d1_roomName"
};
/*
 * Calls: check is call start
 */
describe("/POST check-is-call-start", () => {
  it("calls check is call start", (done) => {
    chai
      .request(callsServerRoute)
      .post("check-is-call-start")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(check_is_call_start)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});


let answer_call = {
  "roomName": "5ffbf7b3da4baf18437058d1_roomName",
  "callId": "5ffbf7b3da4baf18437058d6"
};
/*
 * Calls : answer call
 */
describe("/POST answer-call", () => {
  it("calls call answer", (done) => {
    chai
      .request(callsServerRoute)
      .post("answer-call")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(answer_call)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});


let review_call = {
  "isThumb": true,
  "callId": "1454asdadad12554asda2sda2s1d",
  "reason": "difficultQuestion",
  "reviewBy": "dialler",
  "description": "Good question has been asked ",
  "isAskAgain": false
};
/*
 * CAlls : review calls 
 */
describe("/POST review-call", () => {
  it("calls review call", (done) => {
    chai
      .request(callsServerRoute)
      .post("review-call")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(review_call)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});


let send_test_push_notification = {
  "deviceToken": "5ffbf7b3da4baf18437058d1_roomName"
};
/*
 * calls: send test push notification
 */
describe("/POST send-test-push-notification", () => {
  it("calls send test push notification", (done) => {
    chai
      .request(callsServerRoute)
      .post("send-test-push-notification")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(send_test_push_notification)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});


let user_selection = {
  "roomName": "5ffbf7b3da4baf18437058d1_roomName"
};
/*
 * Calls: user selection
 */
describe("/POST user-selection", () => {
  it("calls user selection", (done) => {
    chai
      .request(callsServerRoute)
      .post("user-selection")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(user_selection)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});

let call_history = {
  "callerType": "dialler"
};
/*
 * Calls: call history
 */
describe("/POST call-history", () => {
  it("calls history", (done) => {
    chai
      .request(callsServerRoute)
      .post("call-history")
      .set('Content-Type', 'application/json')
      .set('x-testing-platform', 'ios')
      .set('X-testing-Version', '1.0.0')
      .set('accept-language', 'en')
      .send(call_history)
      .end((err, res) => {
        if (res && !err) {
          done();
        }
      });
  });
});
