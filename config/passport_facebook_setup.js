const passport = require('passport');

const db = require("./../models");

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    db.user.findOne({
        where: {
            id: id
        }
    }).then(function (user) {
        done(null, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: facebook_app_id,
    clientSecret: facebook_app_secret,
    callbackURL: "/facebook/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
    db.user.findOne({
         where: {
            facebookID:profile.id
         } 
        }, function (err, user) {
      return cb(err, user);
    });
  }
));



passport.use(new GoogleStrategy({
    callbackURL: "/google/redirect",
    clientID: process.env.googleClient_id,
    clientSecret: process.env.googleClient_secret
}, function (accessToken, refreshToken, profile, done) {
    // passport callback
    db.user.findOne({
        where: {
            googleID: profile.id
        }
    }).then(function (currentUser) {
        if (currentUser) {
            console.log(currentUser.dataValues.id);
            console.log('That user already exists');
            done(null, currentUser);
        } else {
            db.user.create({
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName
            }).then(function (newUser) {
                console.log(newUser.dataValues.id);
                console.log('new user created ', newUser);
                done(null, newUser);
            });
        }
    });
    // console.log(profile);
}));