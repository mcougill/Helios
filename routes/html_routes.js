const path = require('path');
const db = require("./../models");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const passportGoogleSetup = require('./../config/passport_google_setup.js')
const authCheck = function (req, res, next) {
    if (!req.user) {
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = function (app) {

    app.get('/', function (req, res) {
        
        res.render('index');
    });

    app.get('/loggedIn', function (req, res) {
        console.log('logged in route ran');
        let user = null;
        let message = null;
        if (req.user !== undefined) {

            user = req.user.dataValues.firstName || req.user.dataValues.username;
        } else {
            user = null;
        }
        
        if (user) {
            message = `Welcome ${user}!`;
        } else {
            message = null;
        }

        let viewInfo = {
            message: message,
            user: user
        };

        res.render('index', viewInfo);
    });



    app.get('/status/:type', function (req, res) {
        console.log('getting to html')
        console.log(req.params.type);
        res.render('status', { 
            status: req.params.type,
            user: req.user
         })
    })

    app.get('/receipt/:amount', function (req, res){
        res.render('receipt', {
            user: req.user.firstName,
            cost: req.params.amount
        })

    })

    app.get('/test', (req, res) => {
        console.log('user at /test !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', req.user);

    })

    app.get('/loginFail', function (req, res) {
        let loginFail = ['User/Password not found.'];
        let hbsObj = {
            loginFail: loginFail
        };
        res.render('index', hbsObj);

    });

    app.get('/userId', function (req, res) {
     
        if (!req.user) {
            res.json('no user');
        } else {
            res.json(req.user.dataValues.id);
        }

    });

    app.post('/register', function (req, res) {
        // users submitted info will be validated and queried against the database for duplicates, then upon success will be redirected to login page, otherwise return an error to the user

        let errors = [];
        let message = [];
        let password = req.body.password;
        let password2 = req.body.password2;
        let patt = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
        let patt2 = /^[a-zA-Z]{2,}/;
        let test = patt.test(password);
        let test2 = patt2.test(req.body.username);
        let test3 = patt2.test(req.body.firstName);
        let test4 = patt2.test(req.body.lastName);

  

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
                username: req.body.username,
                registerFail: true
            });
        } else {
            db.user.findAll({
                where: {
                    username: req.body.username
                }
            })
                .then(function (data) {
               
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
                   
                    }

                });
          

        }
    });
};