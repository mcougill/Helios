const db = require("./../models");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const authCheck = function (req, res, next) {
    if (!req.user) {
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = function (app) {
    
    app.get('/', function (req, res) {
        // let messageObj = {
        //     user: req.body.username
        // };
        
        res.render('index');
        //messageObj.messages = [];
    });

    app.get('/google', passport.authenticate('google', {
        scope: ['profile']
    }));

    app.get('/google/redirect', passport.authenticate('google'), function (req, res) {
        // messageObj.user = 'logged in as ' + req.user.dataValues.firstName;
        //console.log('req.user', req.user);
        res.redirect('/landing');
        // res.send(req.user);
    });

    app.get('/landing', authCheck, function (req, res) {
        let user = req.user.dataValues.firstName || req.body.username;
        let message = {
            message: `Logged in successfully as ${user}`
        }
        console.log(user);
        res.render('landing', message);
    });

    app.get('/register', function (req, res) {
        
        res.render('register');
        // messageObj.messages = [];
    });

    app.post('/register', function (req, res) {
        // users submitted info will be validated and queried against the database for duplicates, then upon success will be redirected to login page, otherwise return an error to the user
        let password = req.body.password;
        let password2 = req.body.password2;
        let patt = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
        let test = patt.test(password);
                
        console.log(req.body.password);
        console.log(req.body.password2);
        
        if (password !== password2) {
            
            // messageObj.messages.push('Passwords do not match.');
            // console.log(messageObj.messages);
            res.redirect('/register');
        } else if (req.body.password.length < 8) {
           // messageObj.messages.push('Password must be at least 8 characters.');
            res.redirect('/register');
        } else if (!test) {
            // messageObj.messages.push('Password must include at least one lowercase letter, one capital, letter, one number, and one special character.');
            res.redirect('/register');
        } else {
            db.user.findAll({
                where: {
                    username: req.body.username
                }
            })
                .then(function (data) {
                    console.log(data, 'data');
                    if (data[0]) {
                        // messageObj.messages.push('That username is already in use.');
                        res.redirect('/register');
                    } else {

                        // String password is being encrypted before being stored in the db
                        let plainTextPassword = req.body.password;
                        bcrypt.genSalt(saltRounds, function (err, salt) {
                            bcrypt.hash(plainTextPassword, salt, function (err, hash) {
                                if (err) console.log(err);

                                // Store hash in the password DB.
                                db.user.create({
                                    firstName: req.body.firstName,
                                    lastName: req.body.lastName,
                                    username: req.body.username,
                                    password: hash
                                });

                            });
                        });

                        // messageObj.messages.push('Registration successful!');
                        res.redirect('/');
                    }

                });
            console.log(req.body.username);

        }
    });

    app.post('/login', function (req, res) {
        //messageObj.messages = [];
        db.user.findOne({
            where: {
                username: req.body.username
            }
        }).then(function (data) {
            if (data === null) {
                // messageObj.messages.push('User not found. Please try again or register as a new user.');
                res.redirect('/');
            } else {
                bcrypt.compare(req.body.password, data.dataValues.password, function (err, passwordEval) {
                    if (err) console.error;
                    if (passwordEval) {
                        // messageObj.messages.push(`Welcome ${data.dataValues.firstName}`);
                        // messageObj.user = 'logged in as ' + req.body.username;
                        
                        console.log('password eval was correct');
                        res.redirect('/landing');
                    } else {
                        // messageObj.messages.push('The password you entered is incorrect.');
                        console.log('password eval was incorrect');
                        res.redirect('/');
                    }

                });

            }
        });
    });

    app.get('/logout', function (req, res) {
        messageObj.user = 'not logged in';
        req.logout();
        res.redirect('/');
    });
};