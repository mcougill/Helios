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
    console.log('passport strategy setup ran!!!!!!!!!!!!!!!!!!!!!!!!!');
    db.user.findOne({
        where: {
            username: username
        }
    }).then(function (user) {
        if (user === null) {
            // messageObj.messages.push('User not found. Please try again or register as a new user.');
            // res.redirect('/');
        } else {
            bcrypt.compare(req.body.password, user.dataValues.password, function (err, passwordEval) {
                if (err) console.error;
                if (passwordEval) {
                    // messageObj.messages.push(`Welcome ${data.dataValues.firstName}`);
                    // messageObj.user = 'logged in as ' + req.body.username;
                    
                    console.log('password eval was correct');
                    done(null, user);
                    // res.redirect('/landing');
                } else {
                    // messageObj.messages.push('The password you entered is incorrect.');
                    console.log('password eval was incorrect');
                    // res.redirect('/');
                    done(null, user);
                }

            });

        }
    });
    // console.log(profile);
    
}));