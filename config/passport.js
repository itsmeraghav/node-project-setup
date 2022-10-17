var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, done) {
  User
  // .findOne({
  //   or: [{contact_number: email}, {email:email.toLowerCase()}]
  // })
  .findOne({
    $or: [
      { 'contact_number': email },
      { 'username': email.toLowerCase() },
      { 'email': email.toLowerCase() } 
    ] })
  // .findOne({contact_number: email.toLowerCase()})
  .then(function(user){   
    if(!user || !user.validPassword(password)){
      return done(null, false, {errors: {'email or password': 'is invalid'}});
    }
    return done(null, user);
  }).catch(done);
}));

  