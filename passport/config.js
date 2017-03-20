module.exports = function(passport) {
  var LocalStrategy = require('passport-local').Strategy;
  var User = require('../models/users');

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {

    process.nextTick(function() {
      User.findOne({'email': email}, function(err, user) {
        if (err) {
          console.log(err);
          return done(err);
        }
        if (user) {
          console.log("Email already in use");
          return done(null, false, req.flash('signUpMessage', 'Email already in use'));
        }
        else {
          var newUser = new User();
          newUser.email = email;
          newUser.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if (err) {
              console.log(err);
              throw err;
            }
            else return done(null, newUser);
          });
        }
      });
    });

  }));

  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    User.findOne({'email': email}, function(err, user) {
      if (err) return done(err);
      if(!user) return done(null, false, req.flash('loginMessage', 'No user found'));
      if (!user.validPassword(password)) return done(null, false, req.flash,('loginMessage', 'Incorrect Password'));
      return done(null, user);
    })
  }));
};
