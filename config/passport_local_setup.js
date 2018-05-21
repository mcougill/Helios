const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local');
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

passport.use(new LocalStrategy({passReqToCallback: true}, function (req, username, password, done) {
    // passport callback
    
    db.user.findOne({
        where: {
            username: username
        }
    }).then(function (user) {
        if (user === null) {
            
        } else {
            bcrypt.compare(req.body.password, user.dataValues.password, function (err, passwordEval) {
                if (err) console.error;
                if (passwordEval) {
                    console.log('password eval was correct');
                    done(null, user);
                    // res.redirect('/landing');
                } else {
                    console.log('password eval was incorrect');
                    // res.redirect('/');
                    done(null, user);
                }

            });

        }
    });
    // console.log(profile);
    
}));