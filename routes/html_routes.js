const db = require("./../models");
var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function (app) {
    let messages = [];
    app.get('/', function (req, res) {
        let messageObj = {
            messages: messages
        };

        res.render('index', messageObj);
    });

    app.get('/landing', function (req, res) {
        let messageObj = {
            messages: messages
        };
        res.render('landing', messageObj);
    });

    app.get('/register', function (req, res) {
        messages = [];
        let messageObj = {
            messages: messages
        };
        res.render('register', messageObj);
    });

    app.post('/register', function (req, res) {
        // users submitted info will be validated and queried against the database for duplicates, then upon success will be redirected to login page, otherwise return an error to the user
        messages = [];
        db.user.findAll({
            where: {
                username: req.body.username
            }
        })
            .then(function (data) {
                console.log(data, 'data');
                if (data[0]) {
                    messages.push('That username is already in use.');
                    res.redirect('/register');
                } else {
                    let plainTextPassword = req.body.password;
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        bcrypt.hash(plainTextPassword, salt, function (err, hash) {
                            if (err) console.log(err);

                            db.user.create({
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                username: req.body.username,
                                password: hash
                            });
                            // Store hash in your password DB.
                        });
                    });

                    messages.push('Registration successful!');
                    res.redirect('/');
                }

            });
        console.log(req.body.username);


    });

    app.post('/login', function (req, res) {
        messages = [];
        db.user.findOne({
            where: {
                username: req.body.username
            }
        }).then(function (data) {
            if (data === null) {
                messages.push('User not found. Please try again or register as a new user.');
                res.redirect('/');
            } else {
                bcrypt.compare(req.body.password, data.dataValues.password, function (err, passwordEval) {
                    if (passwordEval) {
                        messages.push(`Welcome ${data.dataValues.firstName}`);
                        res.redirect('/landing');
                    } else {
                        messages.push('The password you entered is incorrect.');
                        res.redirect('/');
                    }
                    
                });

            }
        });
    });
};