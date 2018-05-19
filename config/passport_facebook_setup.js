const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
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
    clientID: process.env.facebook_app_id,
    clientSecret: process.env.facebook_app_secret,
    callbackURL: "/auth/facebook/redirect"
},
    function (accessToken, refreshToken, profile, done) {
        db.user.findOne({
            where: {
                facebookID: profile.id
            }
        }).then(function (currentUser) {
            if (currentUser) {
                console.log(currentUser.dataValues.id);
                console.log('That user already exists');
                done(null, currentUser);
            } else {
                db.user.create({
                    facebookID: profile.id,
                    username: profile.displayName
                }).then(function (newUser) {
                    console.log(newUser.dataValues.id);
                    console.log('new Facebook user created');
                    done(null, newUser);
                });
            }
        });
    }
));


