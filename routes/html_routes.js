
const path = require('path');
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
        let user = {
            user: req.user
        };

        console.log('req.user', req.user);
        res.render('index', user);
        //messageObj.messages = [];
    });

    app.get('/userId', function (req, res) {
        if (req.user.dataValues.id) {
            res.json(req.user.dataValues.id);
        }
    });



   // app.get('/loginFail', function (req, res) {
     //   let loginFail = {
       //     loginFail: 'Username/Password not found.'
        //};
        //res.render('index', loginFail);
    //});
    

    app.get('/landing', authCheck, function (req, res) {
        let user = req.user.dataValues.firstName || req.user.dataValues.username || req.body.username;

        let message = {
            message: `Welcome back ${user}!`,
            user: user
        }
        console.log(user);
        console.log(req.user.dataValues.id);
        res.render('index', message);
    });

    app.get('/register', function (req, res) {

        res.render('register');
        // messageObj.messages = [];
    });

    app.post('/register', function (req, res) {
        // users submitted info will be validated and queried against the database for duplicates, then upon success will be redirected to login page, otherwise return an error to the user

        let errors = [];
        let message = [];
        let password = req.body.password;
        let password2 = req.body.password2;
        let names = [req.body.username, req.body.firstName, req.body.lastName];
        let patt = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
        let patt2 = /^[a-zA-Z]{2,}/;
        let test = patt.test(password);
        let test2 = patt2.test(req.body.username);
        let test3 = patt2.test(req.body.firstName);
        let test4 = patt2.test(req.body.lastName);

        console.log(req.body.password);
        console.log(req.body.password2);

        if (password !== password2) {
            errors.push('Passwords do not match.');
        }

        if (req.body.password.length < 8) {
            errors.push('Password must be at least 8 characters.');
        }

        if (!test) {
            errors.push('Password must include at least one lowercase letter, one capital, letter, one number, and one special character.');
        }

        if (!(test2 || test3 || test4)) {
            errors.push('Username, First Name, and Last Name must contain only letter characters and have a minimum of 2 characters.');
        }

        if (errors.length > 0) {
            res.render('index', {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username
            });
        } else {
            db.user.findAll({
                where: {
                    username: req.body.username
                }
            })
                .then(function (data) {
                    console.log(data, 'data');
                    if (data[0]) {
                        errors.push('That username is already in use.');
                        res.render('index', {
                            errors: errors,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            username: req.body.username
                        });
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

                        message.push(`Registration successful. Welcome ${req.body.firstName}! You can now login.`);
                        res.render('index', { message: message });
                        console.log('new user was created');
                    }

                });
            console.log(req.body.username);

        }
    });
};




