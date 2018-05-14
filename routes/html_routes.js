const db = require("./../models");

module.exports = function (app) {
    let messages = [];
    app.get('/', function (req, res) {
        let messageObj = {
            messages: messages
        };
        
        res.render('index', messageObj);
    });

    app.get('/landing', function(req, res) {
        res.render('landing');
    });

    app.get('/register', function (req, res) {
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
                db.user.create(req.body);
                messages.push('Registration successful!');
                res.redirect('/');
            }
            
        });
        console.log(req.body.username);
        
        
    });

    app.post('/login', function(req, res) {
        console.log(req.body.username);
        console.log(req.body.password);
        res.redirect('/landing');
    });
};